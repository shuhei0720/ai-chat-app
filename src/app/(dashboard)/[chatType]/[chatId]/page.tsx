import Chat from "@/components/Chat";
import { notFound } from "next/navigation";
import React from "react";

const ChatRoomPage = ({ params }: { params: { chatType: string, chatId: string} }) => {
  console.log(params);
  const {chatId} = params
  console.log(chatId);
  const allowedChatType = [
    "conversation",
    "image_generation",
    "text_to_speech",
    "speech_to_text",
    "image_analysis",
  ];

  if (!allowedChatType.includes(params.chatType)) {
    return notFound();
  }
  return (
    <Chat chatId={chatId}/>
  )
};

export default ChatRoomPage;
