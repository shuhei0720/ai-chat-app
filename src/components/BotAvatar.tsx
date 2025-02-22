import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


const BotAvatar = () => {
  return (
    <Avatar>
        <AvatarImage src="/ai_logo.svg" />
        <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}

export default BotAvatar