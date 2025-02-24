"use client"
import React from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'

const ChatForm = () => {
  const form = useForm()

  const onSubmit = (values: any) => {
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="prompt"
          render={({field}) => (
            <FormItem>
              <FormControl>
                <Textarea {...field}/>
              </FormControl>
            </FormItem>
          )}
        />
        <Button>save</Button>
      </form>
    </Form>

  )
}

export default ChatForm