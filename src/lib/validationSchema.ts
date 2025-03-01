import { z } from "zod";

const MAX_AUDIO_FILE_SIZE = 1024 * 1024 * 20; //20MB

// flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, webm
const ACCEPTED_AUDIO_FORMATS = [
  "audio/flac",
  "audio/mpeg",
  "video/mp4",
  "audio/mp4",
  "video/mpeg",
  "audio/aac",
  "audio/ogg",
  "audio/vnd.wav",
  "audio/wav",
  "video/webm",
]

const ACCEPTED_AUDIO_EXTENSION = [
  "flac",
  "mp3",
  "mp4",
  "mpeg",
  "mpga",
  "m4a",
  "ogg",
  "wav",
  "webm",
]

export const conversationSchema = z.object({
  prompt: z.string().min(1,{message: "1文字以上入力してください。"}),
})

export const imageGenerationSchema = z.object({
  prompt: z
    .string()
    .min(1,{message: "1文字以上入力してください。"})
    .max(1000,{message: "1000文字以下で入力してください。"}),
  amount: z.string(),
  size: z.string(),
})

export const textToSpeechSchema = z.object({
  prompt: z
    .string()
    .min(1,{message: "1文字以上入力してください。"})
    .max(4096,{message: "4096文字以下で入力してください。"}),
  })

export const speechToTextSchema = z.object({
  file: z
    .instanceof(File, {message: "ファイルを選択してください。"})
    //最大サイズ
    .refine((file) => file.size <= MAX_AUDIO_FILE_SIZE, {
      message: "20MB以下のファイルを選択してください。"
    })
    //ファイルの形式
    .refine((file) => {
      const fileTypeValid = ACCEPTED_AUDIO_FORMATS.includes(file.type);
      const fileExtensionValid = ACCEPTED_AUDIO_FORMATS.includes(
        file.name.split(".").pop()!
      );
      return fileTypeValid && fileExtensionValid;
    },{
      message: "対応していないファイルタイプです。"
    })


})