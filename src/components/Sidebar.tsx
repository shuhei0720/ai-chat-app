import React from 'react'
import BotAvatar from './BotAvatar'
import { FileImage, FileOutput, FileSearch2, MessageCircle, Speech } from 'lucide-react'

const Sidebar = () => {

  const routes = [
    {
        label: "Conversation",
        href: "/conversation",
        color: "text-violet-500",
        Icon: MessageCircle
    },
    {
        label: "Image Generation",
        href: "/image_generation",
        color: "text-blue-500",
        Icon: FileImage
    },
    {
        label: "Text To Speech",
        href: "/text_to_speech",
        color: "text-red-500",
        Icon: FileOutput
    },
    {
        label: "Speech To Text",
        href: "/speech_to_text",
        color: "text-green-500",
        Icon: Speech
    },
    {
        label: "Image Analysis",
        href: "/image_analysis",
        color: "text-orange-500",
        Icon: FileSearch2
    }
  ]
  return (
    <div className='bg-gray-900 text-white p-3 h-full'>
        {/* タイトル&ロゴエリア */}
        <div className='flex items-center'>
            <div className='mr-3'>
                <BotAvatar />
            </div>
            <h1 className='font-bole text-xl'>AI Chat App</h1>
        </div>

        {/* チャットタイプエリア */}
        <div>チャットタイプエリア</div>

        {/* チャットルームエリア */}
        <div>チャットルームエリア</div>
    </div>
  )
}

export default Sidebar