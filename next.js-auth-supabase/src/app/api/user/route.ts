import { PrismaClient, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

//インスタンスを作成
const prisma = new PrismaClient();

// カスタム型を定義
export type UserWithProfile = Prisma.UserGetPayload<{
  include: { profile: true }
}>

// データベースに接続する関数　不要なようなので省略
// export const connect = async () => {
//   try {
//     //prismaでデータベースに接続
//     prisma.$connect();
//   } catch (error) {
//     return Error("DB接続失敗しました")
//   }
// }

// ユーザーとそのプロファイルを含むデータを取得する関数
export async function getUsersWithProfiles(): Promise<UserWithProfile[]> {
  return prisma.user.findMany({
    include: {
      profile: true, // Profile データを含める
    },
  });
}

// ユーザー情報とそのプロファイル情報を取得する
export const GET = async (req: Request) => {
  try {

    // await connect();
    // ユーザー情報と紐づくプロファイル情報を取得
    const usersWithProfiles = await getUsersWithProfiles();


    console.log(usersWithProfiles);
    return NextResponse.json({ usersWithProfiles }, { status: 200 })

  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 })

  } finally {
    //$disconnectは推奨されているので実行する
    await prisma.$disconnect();
  }
}
