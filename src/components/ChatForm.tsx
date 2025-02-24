"use client"
import React from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'

const ChatForm = () => {
  const form = useForm()
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="prompt"
        render={(field) => (
          <FormItem>
            <FormControl>
              <Textarea {...field}/>
            </FormControl>
          </FormItem>
        )}
      />
    </Form>

  )
}

export default ChatForm