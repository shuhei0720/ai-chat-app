"use client"

import React from 'react'
import BotAvatar from './BotAvatar'
import { FileImage, FileOutput, FileSearch2, MessageCircle, Speech } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

const Sidebar = () => {

  const pathname = usePathname()
  console.log(pathname)

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
    <div className='space-y-1 bg-gray-900 text-white p-3 h-full'>
        {/* タイトル&ロゴエリア */}
        <div className='flex items-center'>
            <div className='mr-3'>
                <BotAvatar />
            </div>
            <h1 className='font-bole text-xl'>AI Chat App</h1>
        </div>

        {/* チャットタイプエリア */}
        <div className='space-y-1'>
            {routes.map((route) => (
                <Link
                href={route.href}
                key={route.href}
                className={cn('block p-3 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/10 transition rounded-lg', pathname.startsWith(route.href) && "bg-white/10")}>
                    <div className='flex items-center'>
                        <route.Icon className={cn("h-5 w-5 mr-3", route.color)}/>
                        <p>{route.label}</p>
                    </div>
                </Link>
            ))}
        </div>

        {/* チャットルームエリア */}
        <div>チャットルームエリア</div>
    </div>
  )
}

export default Sidebar