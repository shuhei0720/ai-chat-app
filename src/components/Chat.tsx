import React from 'react'
import ChatMessage from '@/components/ChatMessage'
import ChatForm from '@/components/ChatForm'

interface ChatProps {
  chatId: string,
}

const Chat = ({chatId}:ChatProps) => {
  return (
    <>
      <ChatMessage chatId={chatId}/>
      <ChatForm />
    </>
  )
}

export default Chat