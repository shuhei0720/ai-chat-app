import Chat from "@/components/Chat";
import { ChatType } from "@/types";
import { notFound } from "next/navigation";
import React from "react";

const ChatRoomPage = ({ params }: { params: { chatType: string, chatId: string} }) => {
  console.log(params);
  const {chatId,chatType } = params
  console.log(chatId);

  //型ガード関数
  const isChatTypeKey = (key: string): key is ChatType =>
    [
      "conversation",
      "image_generation",
      "text_to_speech",
      "speech_to_text",
      "image_analysis",
    ].includes(key);

    if (!isChatTypeKey(chatType)) {
      return notFound();
    }

  return (
    <Chat initialChatId={chatId} chatType={chatType}/>
  )
};

export default ChatRoomPage;
