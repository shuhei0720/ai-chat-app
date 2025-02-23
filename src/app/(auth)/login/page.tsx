"use client"
import { Button } from '@/components/ui/button'
import { auth, provider } from '@/lib/firebase/firebaseClient'
import { signInWithPopup } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import React from 'react'

const LoginPage = () => {
  const router = useRouter();

  const handleLogin = () => {
    signInWithPopup(auth,provider).then(() => {
      router.push("/conversation");
    }).catch((error) => {
      console.log(error);
    })
  }
  return (
    <Button onClick={handleLogin}>login</Button>
  )
}

export default LoginPage