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
    const file = formData.get("file") as File;
    const chatId = formData.get("chatId") as string;
    console.log(file);
    console.log(chatId);

    //バイナリデータに変換->保存パスを設定->ストレージにアップロードして参照URLを取得
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filePath = `${"er9CONFDWqNlIV6PnhGQbSM0ixl1"}/chatRoom/${chatId}`;
    const url = await fileUploadToStorage(buffer, filePath, "audio/mpeg");
    console.log("url",url);

    // ユーザーメッセージをfirestoreに保存
    await db.collection("chats").doc(chatId).collection("messages").add({
      content: url,
      created_at: FieldValue.serverTimestamp(),
      sender: "user",
      type: "audio",
    });

    // openAI APIを呼び出してAIの回答を生成
    // const audioResponse = await openai.audio.speech.create({
    //   model: "tts-1-hd",
    //   voice: "alloy",
    //   input: prompt,
    // });
    // console.log("audioResponse",audioResponse);

    // // AIの回答をfirestoreに保存
    // await db.collection("chats").doc(chatId).collection("messages").add({
    //   content: url,
    //   created_at: FieldValue.serverTimestamp(),
    //   sender: "assistant",
    //   type: "audio",
    // });


    return NextResponse.json({ success: "true" });
  } catch (error) {
    console.log("SPEECH_TO_TEXT_ERROR", error);
    return NextResponse.json({ error: "サーバー側でエラーが発生しました。" });
  }
}
