import { checkUserPermission, verifyToken } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/firebaseAdmin";
import { fileUploadToStorage } from "@/lib/firebase/storage";
import { FieldValue } from "firebase-admin/firestore";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {

    const headersList = await headers()
    const authHeader = headersList.get('Authorization')

    // トークンが添付されているか？
    if(!authHeader) {
      return NextResponse.json(
        {error: "トークンが添付されていません。"},
        {status: 401},
      )
    }

    const token = authHeader.split("Bearer ")[1];
    // デコード
    const user = await verifyToken(token);
    if(!user) {
      return NextResponse.json(
        {error: "無効なトークンです。"},
        {status: 401},
      )
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const prompt = formData.get("prompt") as string;
    const chatId = formData.get("chatId") as string;
    console.log(files);
    console.log(prompt);
    console.log(chatId);

    // firestoreのデータを操作して良いユーザーか？
    const hasPermission = await checkUserPermission(user.uid, chatId)
    if(!hasPermission) {
      return NextResponse.json(
        {error: "操作が許可されていないか、リソースが存在しません。"},
        {status: 403},
      )
    }

    let urls:string[] = []

    if(files.length > 0) {
      //URL->ダウンロード->バイナリデータに変換->保存パスを設定->ストレージにアップロード
      const imageDataPromises = files.map(async(file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filePath = `${user.uid}/chatRoom/${chatId}`;
        return await fileUploadToStorage(buffer, filePath, file.type);
      });

      urls = await Promise.all(imageDataPromises);
      console.log("urls",urls);
    }
    
    // ユーザーメッセージをfirestoreに保存
    // Add a new document with a generated id.
    await db.collection("chats").doc(chatId).collection("messages").add({
    content: {text:prompt, imageUrl: urls},
      created_at: FieldValue.serverTimestamp(),
      sender: "user",
      type: "image_analysis",
    });

    const messagesRef = db.collection('chats').doc(chatId).collection("messages");
    const snapShot = await messagesRef.orderBy("created_at", "asc").get();

    const messages:ChatCompletionMessageParam[] = snapShot.docs.map((doc) => {
      if(doc.data().sender == "user") {
        //ユーザーメッセージ
        return {
          role: "user",
          content: [
            // テキスト
            { type: "text", text: doc.data().content.text },
            // 画像
            ...doc.data().content.imageUrl.map((url: string) => {
              return {
                type: "image_url",
                image_url: {
                  "url": url,
                },
              }
            })
          ],
        }
      } else {
        return {
          role: "assistant",
          content:doc.data().content
        }
      }
    })
    console.log("messages", messages);

    // openAI APIを呼び出してAIの回答を生成
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      
      // [
      //   // ユーザーメッセージ
      //   {
      //     role: "user",
      //     content: [
      //       // テキスト
      //       { type: "text", text: prompt },
      //       // 画像
      //       {
      //         type: "image_url",
      //         image_url: {
      //           "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
      //         },
      //       },
      //     ],
      //   },
      //   // AIメッセージ
      //   {
      //     role: "assistant",
      //     content:"写真には犬が映っています。"
      //   },
      //   // ユーザーメッセージ
      //   {
      //     role: "user",
      //     content: [
      //       // テキスト
      //       { type: "text", text: prompt },
      //       // 画像
      //       {
      //         type: "image_url",
      //         image_url: {
      //           "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
      //         },
      //       },
      //     ],
      //   },
      // ],
    });
    
    console.log(response.choices[0]);

    const aiREsponse = response.choices[0].message.content;

    // // AIの回答をfirestoreに保存
    await db.collection("chats").doc(chatId).collection("messages").add({
      content: aiREsponse,
      created_at: FieldValue.serverTimestamp(),
      sender: "assistant",
      type: "text",
    });


    return NextResponse.json({ success: "true" });
  } catch (error) {
    console.log("IMAGE_ANALYSIS_ERROR", error);
    return NextResponse.json({ error: "サーバー側でエラーが発生しました。" });
  }
}
