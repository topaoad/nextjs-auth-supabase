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

export const DELETE = async (req: Request, { params }: { params: Params }) => {
  try {
    const targetId: number = Number(params.id);

    await connect();
    const todos = await prisma.todo.delete({
      where: { id: targetId }
    });

    return NextResponse.json({ message: "削除成功", todos }, { status: 200 })

  } catch (error) {
    return NextResponse.json({ messeage: "削除失敗" }, { status: 500 })

  } finally {
    await prisma.$disconnect();
  }
}