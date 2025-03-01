import { db } from "@/lib/firebase/firebaseAdmin";
import { fileUploadToStorage } from "@/lib/firebase/storage";
import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request, res: Response) {
  try {
    const { prompt, chatId } = await req.json();
    console.log(prompt);
    console.log(chatId);

    // ユーザーメッセージをfirestoreに保存
    // Add a new document with a generated id.
    // await db.collection("chats").doc(chatId).collection("messages").add({
    //   content: prompt,
    //   created_at: FieldValue.serverTimestamp(),
    //   sender: "user",
    //   type: "text",
    // });

    // openAI APIを呼び出してAIの回答を生成
    const mp3 = await openai.audio.speech.create({
      model: "tts-1-hd",
      voice: "alloy",
      input: prompt,
    });
    console.log("mp3",mp3);

    //URL->ダウンロード->バイナリデータに変換->保存パスを設定->ストレージにアップロード
    const imageDataPromises = response.data.map(async(item) => {
      if(item.url) {
        const response = await fetch(item.url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filePath = `${"er9CONFDWqNlIV6PnhGQbSM0ixl1"}/chatRoom/${chatId}`;
        return await fileUploadToStorage(buffer, filePath, "image/png");
      }
    });

    // // AIの回答をfirestoreに保存
    // await db.collection("chats").doc(chatId).collection("messages").add({
    //   content: urls,
    //   created_at: FieldValue.serverTimestamp(),
    //   sender: "assistant",
    //   type: "image",
    // });


    return NextResponse.json({ success: "true" });
  } catch (error) {
    console.log("TEXT_TO_SPEECH_ERROR", error);
    return NextResponse.json({ error: "サーバー側でエラーが発生しました。" });
  }
}
