
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonServer from "./auth-button-server";
import { redirect } from "next/navigation";
import { Database } from "./lib/database.types";
import { NewTodoForm } from "@/components/NewTodoForm";
import { NewToast } from "@/components/NewToast";
import { ModeToggle } from "@/components/ModeToggle";
import { PrismaClient, Todo, } from '@prisma/client';
import { UserWithProfile } from '@/app/api/user/route'

const getTodoList = async () => {
  const res = await fetch('http://localhost:3000/api/todo')
  const json = await res.json()
  return json.todos
}
const getUserList = async () => {
  const res = await fetch('http://localhost:3000/api/user')
  const json = await res.json()
  return json.usersWithProfiles
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
  const userList = await getUserList()
  console.log(userList)

  return (
    <>
      <AuthButtonServer />
      <h1>Next.js + TypeScript + Prisma + supabase</h1>

      {todoList.map((todo: Todo) => (
        <div key={todo.id}>
          <h2>{todo.title}</h2>
        </div>
      ))}
      {userList.map((user: UserWithProfile) => (
        <div key={user.id}>
          <h2>{user.name}</h2>
        </div>
      ))}
      <NewTodoForm />
      <NewToast />
      <ModeToggle />
    </>
  );
}