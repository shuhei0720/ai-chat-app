import { bucket } from "./firebaseAdmin";
import { v4 as uuidv4 } from 'uuid';

export const fileUploadToStorage = (
  buffer:Buffer,
  filePath: string,
  contentType: string,
) => {
  const fileExtention = contentType === "audio/mpeg" ? "mp3" : contentType.split("/")[1];
  const randomFileName = uuidv4();
  const fileName = `${filePath}/${randomFileName}.${fileExtention}`;
  const uploadFile = bucket.file(fileName);
};