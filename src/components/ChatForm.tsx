"use client"
import React from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/firebaseClient'
import { useAuth } from '@/context/AuthContext'
import axios from "axios"

interface ChatFormProps {
  chatId?: string,
  chatType: string,
}

const ChatForm = ({chatId,chatType}) => {
  const {currentUser} = useAuth();

  const conversationSchema = z.object({
    prompt: z.string().min(1,{message: "1文字以上入力してください。"}),
  })

  const form = useForm<z.infer<typeof conversationSchema>>({
    defaultValues: {
      prompt: "",
    },
    resolver: zodResolver(conversationSchema),
  })

  const onSubmit = async(values: z.infer<typeof conversationSchema>) => {
    console.log(values);

    try {
      if(!chatId) {
        //初めてメッセージを送信した場合にチャットルームを作成
        // Add a new document with a generated id.
        const newChatdocRef = await addDoc(collection(db, "chats"), {
          first_message: values.prompt,
          last_updated: serverTimestamp(),
          type: chatType,
          user_id: currentUser?.uid,
        });
      }

      const response = await axios.post("/api/conversation", {prompt: values.prompt});
      console.log(response);

    } catch(error) {
      console.error(error);
    }
  }
  return (
    <div className='bg-white p-3'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='flex items-center space-x-2'>
            <FormField
              control={form.control}
              name="prompt"
              render={({field}) => (
                <FormItem className='w-full flex'>
                  <FormControl>
                    <Textarea {...field} className='bg-slate-200' rows={1}/>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button variant={"ghost"}>
              <Send />
            </Button>
          </div>
        </form>
      </Form>
    </div>

  )
}

export default ChatForm