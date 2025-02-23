import React from 'react'
import ChatMessage from '@/components/ChatMessage'
import ChatForm from '@/components/ChatForm'

interface ChatProps {
  chatId?: string,
  chatType: string,
}

const Chat = ({chatId,chatType}:ChatProps) => {
  return (
    <>
      <ChatMessage chatId={chatId} chatType={chatType}/>
      <ChatForm />
    </>
  )
}

export default Chat