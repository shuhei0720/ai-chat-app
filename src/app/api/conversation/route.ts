import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {

  const { prompt } = await req.json();
  console.log(prompt);

  return NextResponse.json({success: "true"})
}