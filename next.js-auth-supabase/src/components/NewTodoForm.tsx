"use client";

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  username: z.string().min(6, {
    message: "6文字以上で入力してください。",
  }),
})

export const NewTodoForm = () => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })


  const onSubmit = async (formData: z.infer<typeof formSchema>) => {

    try {
      const response = await fetch('http://localhost:3000/api/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: formData.username }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('ToDoが追加されました！');
        form.reset()
      } else {
        alert(`エラー: ${data.message}`);
      }
    } catch (error) {
      alert('通信エラーが発生しました。');
    }
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>投稿内容</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">追加</Button>
      </form>
    </Form>
  )
};

