import { conversationSchema, imageGenerationSchema } from "./validationSchema";

export const amountOptions = [
  {
    value: "1",
    label: "1枚",
  },
  {
    value: "2",
    label: "2枚",
  },
  {
    value: "3",
    label: "3枚",
  },
  {
    value: "4",
    label: "4枚",
  },
];

export const sizeOptions = [
  {
    value: "256x256",
    label: "256x256",
  },
  {
    value: "512x512",
    label: "512x512",
  },
  {
    value: "1024x10243",
    label: "1024x1024",
  },
];

const formConfig = {
  conversation: {schema: conversationSchema, defaultValue: {prompt: "",}},
  image_generation: {schema: imageGenerationSchema, defaultValue: {prompt: "", amount: "1", size: "256x256"}},
  // 以下は仮
  text_to_speech: {schema: conversationSchema, defaultValue: {prompt: "",}},
  speech_to_text: {schema: conversationSchema, defaultValue: {prompt: "",}},
  image_analysis: {schema: conversationSchema, defaultValue: {prompt: "",}},
}

export const getFormConfig = (chatType) => {
  return formConfig[chatType]
}