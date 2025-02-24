import { db } from "@/lib/firebase/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    const { prompt, chatId } = await req.json();
    console.log(prompt);

    // ユーザーメッセージをfirestoreに保存
    // Add a new document with a generated id.
    await db.collection('chats').doc(chatId).collection("messages").add({
      content: prompt,
      created_at: FieldValue.serverTimestamp(),
      sender: 'user',
      type: 'conversation',
    });

    // openAI APIを呼び出してAIの回答を生成

    // AIの回答をfirestoreに保存

    return NextResponse.json({success: "true"})
  } catch(error) {
    console.log("CONVERSATION_ERROR",error)
    return NextResponse.json({error: "サーバー側でエラーが発生しました。"})
  }

  
}