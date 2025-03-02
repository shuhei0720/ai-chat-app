import { getAuth } from "firebase-admin/auth"

export async function verifyToken(token: string) {
  // デコード
  try {
    const decodedToken = await getAuth().verifyIdToken(token)
    return decodedToken;
  } catch(error) {
    console.log("IDトークンの検証エラー",error);
    throw new Error("無効なトークンです。");
  }
}