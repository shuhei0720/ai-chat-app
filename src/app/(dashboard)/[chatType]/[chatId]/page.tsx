import { notFound } from 'next/navigation';
import React from 'react'

const ChatRoomPage = ({params}: {params: {chatType: string}}) => {
    const allowedChatType = [
        "conversation",
        "image_generation",
        "text_to_speech",
        "speech_to_text",
        "image_analysis",
    ];

    if(!allowedChatType.includes(params.chatType)) {
        return notFound()
    }
  return (
    <div>ChatRoomPage</div>
  )
}

export default ChatRoomPage