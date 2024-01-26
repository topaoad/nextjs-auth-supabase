import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

//インスタンスを作成
const prisma = new PrismaClient();

// データベースに接続する関数
export const connect = async () => {
  try {
    //prismaでデータベースに接続
    prisma.$connect();
  } catch (error) {
    return Error("DB接続失敗しました")
  }
}

// データベースからデータを取得する　const res = await fetch('http://localhost:3000/api/todo')から呼び出される
export const GET = async (req: Request) => {
  try {
    await connect();
    const todos = await prisma.todo.findMany();

    return NextResponse.json({ todos }, { status: 200 })

  } catch (error) {
    return NextResponse.json({ messeage: "Error" }, { status: 500 })

  } finally {
    //必ず実行する
    await prisma.$disconnect();
  }
}

// データベースにデータを登録する
export const POST = async (req: Request, res: NextResponse) => {
  console.log(req);
  const { title } = await req.json();
  try {
    await connect();
    const todo = await prisma.todo.create({
      data: {
        title: title,
        createdAt: new Date()
      }
    });

    return NextResponse.json({ message: "投稿完了" }, { status: 200 })

  } catch (error) {
    console.error('エラー発生:', error); // エラー情報を詳細に出力
    return NextResponse.json({ messeage: "投稿失敗" }, { status: 500 })

  } finally {
    await prisma.$disconnect();
  }
}