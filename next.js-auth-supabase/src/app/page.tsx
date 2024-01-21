
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonServer from "./auth-button-server";
import { redirect } from "next/navigation";
import NewTweet from "./new-tweet";
import { Database } from "./lib/database.types";
import { NewTodoForm } from "@/components/NewTodoForm";

const getTodoList = async () => {
  const res = await fetch('http://localhost:3000/api/todo')
  const json = await res.json()
  return json.todos
}

type todo = {
  id: number
  title: string
  created_at: Date
}

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }


  const { data: tweets } = await supabase
    .from("tweets")
    .select("*, profiles(*)");


  const todoList = await getTodoList()

  return (
    <>
      <AuthButtonServer />
      <h1>Next.js + TypeScript + Prisma + supabase</h1>

      {todoList.map((todo: todo) => (
        <div key={todo.id}>
          <h2>{todo.title}</h2>
        </div>
      ))}

      <NewTodoForm />
    </>
  );
}