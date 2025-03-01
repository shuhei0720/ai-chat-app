import { z } from "zod";

const MAX_AUDIO_FILE_SIZE = 1024 * 1024 * 20; //20MB

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

})