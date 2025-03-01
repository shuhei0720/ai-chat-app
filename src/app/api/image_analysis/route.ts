import { db } from "@/lib/firebase/firebaseAdmin";
import { fileUploadToStorage } from "@/lib/firebase/storage";
import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const prompt = formData.get("prompt") as string;
    const chatId = formData.get("chatId") as string;
    console.log(files);
    console.log(prompt);
    console.log(chatId);

    let urls:string[] = []

    if(files.length > 0) {
      //URL->ダウンロード->バイナリデータに変換->保存パスを設定->ストレージにアップロード
      const imageDataPromises = files.map(async(file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filePath = `${"er9CONFDWqNlIV6PnhGQbSM0ixl1"}/chatRoom/${chatId}`;
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

    // openAI APIを呼び出してAIの回答を生成
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        // ユーザーメッセージ
        {
          role: "user",
          content: [
            // テキスト
            { type: "text", text: prompt },
            // 画像
            {
              type: "image_url",
              image_url: {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
              },
            },
          ],
        },
        // AIメッセージ
        {
          role: "assistant",
          content:"写真には犬が映っています。"
        },
        // ユーザーメッセージ
        {
          role: "user",
          content: [
            // テキスト
            { type: "text", text: prompt },
            // 画像
            {
              type: "image_url",
              image_url: {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
              },
            },
          ],
        },
      ],
    });
    
    console.log(response.choices[0]);

    

    // // AIの回答をfirestoreに保存
    // await db.collection("chats").doc(chatId).collection("messages").add({
    //   content: urls,
    //   created_at: FieldValue.serverTimestamp(),
    //   sender: "assistant",
    //   type: "image",
    // });


    return NextResponse.json({ success: "true" });
  } catch (error) {
    console.log("IMAGE_ANALYSIS_ERROR", error);
    return NextResponse.json({ error: "サーバー側でエラーが発生しました。" });
  }
}
