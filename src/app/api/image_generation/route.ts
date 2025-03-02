import { checkUserPermission, verifyToken } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/firebaseAdmin";
import { fileUploadToStorage } from "@/lib/firebase/storage";
import { FieldValue } from "firebase-admin/firestore";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import OpenAI from "openai";

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

    const { prompt, chatId, amount, size } = await req.json();
    console.log(prompt);
    console.log(chatId);
    console.log(amount);
    console.log(size);

    // firestoreのデータを操作して良いユーザーか？
    const hasPermission = await checkUserPermission(user.uid, chatId)
    if(!hasPermission) {
      return NextResponse.json(
        {error: "操作が許可されていないか、リソースが存在しません。"},
        {status: 403},
      )
    }


    // ユーザーメッセージをfirestoreに保存
    // Add a new document with a generated id.
    await db.collection("chats").doc(chatId).collection("messages").add({
      content: prompt,
      created_at: FieldValue.serverTimestamp(),
      sender: "user",
      type: "text",
    });

    // openAI APIを呼び出してAIの回答を生成
    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt: prompt,
      n: parseInt(amount, 10),
      size: size,
    });
    
    const image_url = response.data[0].url;
    console.log("response",response);
    // console.log("image_url",image_url);

    //URL->ダウンロード->バイナリデータに変換->保存パスを設定->ストレージにアップロード
    const imageDataPromises = response.data.map(async(item) => {
      if(item.url) {
        const response = await fetch(item.url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filePath = `${user.uid}/chatRoom/${chatId}`;
        return await fileUploadToStorage(buffer, filePath, "image/png");
      }
    });

    const urls = await Promise.all(imageDataPromises);
    console.log("urls",urls);

    // // AIの回答をfirestoreに保存
    await db.collection("chats").doc(chatId).collection("messages").add({
      content: urls,
      created_at: FieldValue.serverTimestamp(),
      sender: "assistant",
      type: "image",
    });


    return NextResponse.json({ success: "true" });
  } catch (error) {
    console.log("IMAGE_GENERATION_ERROR", error);
    return NextResponse.json({ error: "サーバー側でエラーが発生しました。" });
  }
}
