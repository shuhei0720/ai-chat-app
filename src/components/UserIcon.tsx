"use client"
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '@/context/AuthContext'


const UserIcon = () => {
  const {currentUser} = useAuth();
  console.log(currentUser?.photoURL);
  const photoURL = currentUser?.photoURL ? currentUser.photoURL : undefined;
  return (
    <Avatar className="h-8 w-8">
        <AvatarImage src={photoURL} />
        <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}

export default UserIcon