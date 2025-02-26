"use client"
import React, { useState } from 'react'
import ChatMessage from '@/components/ChatMessage'
import ChatForm from '@/components/ChatForm'

interface ChatProps {
  initialChatId?: string,
  chatType: string,
}

const Chat = ({initialChatId,chatType}:ChatProps) => {
  const[chatId, setChatId] = useState(initialChatId)
  return (
    <>
      <ChatMessage chatId={chatId} chatType={chatType}/>
      <ChatForm setChatId={setChatId} chatId={chatId} chatType={chatType}/>
    </>
  )
}

export default Chat