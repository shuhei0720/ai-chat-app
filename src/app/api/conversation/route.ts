import { db } from "@/lib/firebase/firebaseAdmin";
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

    // ユーザーメッセージをfirestoreに保存
    // Add a new document with a generated id.
    await db.collection("chats").doc(chatId).collection("messages").add({
      content: prompt,
      created_at: FieldValue.serverTimestamp(),
      sender: "user",
      type: "text",
    });

    const messagesRef = db.collection('chats').doc(chatId).collection("messages");
    const snapShot = await messagesRef.get();

    const messages = snapShot.docs.map((doc) => (
      {
        role: doc.data().sender,
        content: doc.data().content,
      }
    ))
    console.log("messages", messages);

    // openAI APIを呼び出してAIの回答を生成
    // const completion = await openai.chat.completions.create({
    //   model: "gpt-4o-mini",
    //   messages: [
    //     { role: "developer", content: "You are a helpful assistant." },
    //     {
    //       role: "user",
    //       content: "Write a haiku about recursion in programming.",
    //     },
    //   ],
    // });

    // AIの回答をfirestoreに保存

    return NextResponse.json({ success: "true" });
  } catch (error) {
    console.log("CONVERSATION_ERROR", error);
    return NextResponse.json({ error: "サーバー側でエラーが発生しました。" });
  }
}
