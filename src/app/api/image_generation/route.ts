import { db } from "@/lib/firebase/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request, res: Response) {
  try {
    const { prompt, chatId, amount, size } = await req.json();
    console.log(prompt);
    console.log(chatId);
    console.log(amount);
    console.log(size);

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
    console.log("image_url",image_url);

    //URL->ダウンロード->バイナリデータに変換->保存パスを設定->ストレージにアップロード
    const imageDataPromises = response.data.map(async(item) => {
      if(item.url) {
        const response = await fetch(item.url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filePath = `${"er9CONFDWqNlIV6PnhGQbSM0ixl1"}/chatRoom/${chatId}`;
        return await fileUploadToStorage(buffer, filePath, "image/png");
      }
    })

    const urls = await Promise.all(imageDataPromises);

    // // AIの回答をfirestoreに保存
    // await db.collection("chats").doc(chatId).collection("messages").add({
    //   content: aiResponse,
    //   created_at: FieldValue.serverTimestamp(),
    //   sender: "assistant",
    //   type: "text",
    // });


    return NextResponse.json({ success: "true" });
  } catch (error) {
    console.log("CONVERSATION_ERROR", error);
    return NextResponse.json({ error: "サーバー側でエラーが発生しました。" });
  }
}
