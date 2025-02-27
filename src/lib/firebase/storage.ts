import { bucket } from "./firebaseAdmin";
import { v4 as uuidv4 } from 'uuid';

export const fileUploadToStorage = async(
  buffer:Buffer,
  filePath: string,
  contentType: string,
) => {
  try {
    const fileExtention = contentType === "audio/mpeg" ? "mp3" : contentType.split("/")[1];
    const randomFileName = uuidv4();
    const fileName = `${filePath}/${randomFileName}.${fileExtention}`;
    const uploadFile = bucket.file(fileName);

    await uploadFile.save(buffer, {
      metadata: {
        contentType: contentType,
      }
    });

    await uploadFile.makePublic();
    return `https://storage.googoleapis.com/${bucket.name/fileName}`;
  } catch (error: any) {
    console.log(error);
    throw new Error("ファイルのアップロードに失敗しました。", error.message);
  }
  
};