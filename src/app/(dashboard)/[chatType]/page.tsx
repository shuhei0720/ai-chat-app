import { notFound } from 'next/navigation';
import React from 'react'

const ChatTypePage = ({params}: {params: {chatType: string}}) => {
    console.log(params);

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
    <div>ChatTypePage</div>
  )
}

export default ChatTypePage