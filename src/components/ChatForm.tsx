"use client"
import React from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { LoaderCircle, Send } from 'lucide-react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/firebaseClient'
import { useAuth } from '@/context/AuthContext'
import axios from "axios"
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { amountOptions, getFormConfig, sizeOptions } from '@/lib/formConfigurations'
import { conversationSchema, imageGenerationSchema } from '@/lib/validationSchema'
import { ChatType } from '@/types'

interface ChatFormProps {
  chatId?: string,
  chatType: ChatType,
  setChatId: React.Dispatch<React.SetStateAction<string | undefined>>
}

const ChatForm = ({chatId,chatType, setChatId}: ChatFormProps) => {
  const router = useRouter();
  const {currentUser} = useAuth();

  const { schema, defaultValue } = getFormConfig(chatType);
  console.log("schema",schema);
  console.log("defaultValue",defaultValue);

  type FormData = {
    prompt: string,
    amount: string,
    size: string,
  }

  const form = useForm<FormData>({
    defaultValues: defaultValue,
    resolver: zodResolver(schema),
  })

  const isSubmitting = form.formState.isSubmitting;
  console.log("エラー内容", form.formState.errors);

  const getRequestData = (values: FormData, chatId: string) => {
    let apiUrl = "";
    let apiData = {};

    switch(chatType) {
      case "conversation":
        apiUrl = "/api/conversation";
        apiData = {
          prompt: values.prompt,
          chatId: chatId,
        }
      break;
      case "image_generation":
        apiUrl = "/api/image_generation";
        apiData = {
          prompt: values.prompt,
          amount: values.amount,
          size: values.size,
          chatId: chatId,
        }
      break;
    }

    return {apiUrl, apiData}
  }

  const onSubmit = async(values: FormData) => {
    console.log(values.amount);

    try {
      let chatRef;
      let isNewChat = false;
      if(!chatId) {
        //初めてメッセージを送信した場合にチャットルームを作成
        // Add a new document with a generated id.
        const newChatDocRef = await addDoc(collection(db, "chats"), {
          first_message: values.prompt,
          last_updated: serverTimestamp(),
          type: chatType,
          user_id: currentUser?.uid,
        });
        chatRef = doc(db, "chats", newChatDocRef.id)
        isNewChat = true;
        setChatId(newChatDocRef.id);
      } else {
        chatRef = doc(db, "chats", chatId)
      }

      const {apiUrl, apiData} = getRequestData(values, chatRef.id);
      console.log("apiUrl",apiUrl)
      console.log("apiData",apiData)
      const response = await axios.post(apiUrl, apiData);
      console.log(response);

      if(isNewChat) {
        // 初めてメッセージを送信たい場合
        // router.push(`/${chatType}/${chatRef.id}`)
        window.history.pushState(null, "", `/&{chatType}/${chatRef.id}`);

      } else {
        // すでにチャットルームにアクセスしている場合
        await updateDoc(chatRef, {
          last_updated: serverTimestamp(),
        });
      }
      
    } catch(error) {
      console.error(error);
    } finally {
      form.reset();
    }
  }
  return (
    <div className='bg-white p-3'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">

          {chatType == "image_generation" && (
            <div className='flex items-center space-x-2'>
            {/* amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a verified email to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {amountOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
  
            {/* size */}
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a verified email to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            </div>
          )}
          
          <div className='flex items-center space-x-2'>
            <FormField
              control={form.control}
              name="prompt"
              render={({field}) => (
                <FormItem className='w-full flex'>
                  <FormControl>
                    <Textarea disabled={isSubmitting} {...field} className='bg-slate-200' rows={1}/>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button disabled={isSubmitting} variant={"ghost"}>
              {isSubmitting ? (
                <LoaderCircle className='animate-spin'/>
              ) :(
                <Send />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>

  )
}

export default ChatForm