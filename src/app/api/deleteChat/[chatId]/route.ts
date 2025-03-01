import { db } from "@/lib/firebase/firebaseAdmin";
import { NextResponse } from "next/server"

export async function DELETE(req:Request, res:Response, {params}: {params: {chatId: string}}) {
  try {
    const {chatId} = params
    // firestoreからデータを削除する処理
    const chatRef = db.collection("chats").doc(chatId);
    await db.recursiveDelete(chatRef);
    // storageからデータを削除する処理
  } catch(error) {
    console.log("削除処理中のエラー",error)
    return NextResponse.json({error: "削除処理中のエラーが発生しました。"},{status: 500})
  }
}