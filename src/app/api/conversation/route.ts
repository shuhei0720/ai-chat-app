import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {

  const { prompt } = await req.json();
  console.log(prompt);

  // ユーザーメッセージをfirestoreに保存

  // openAI APIを呼び出してAIの回答を生成

  // AIの回答をfirestoreに保存

  return NextResponse.json({success: "true"})
}