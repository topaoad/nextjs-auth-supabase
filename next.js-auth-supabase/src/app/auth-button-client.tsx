"use client";
import { useForm } from '@mantine/form';

import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function AuthButtonClient({
  session,
}: {
  session: Session | null;
}) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const handleSignInGithub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
  };

  const handleSignInGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
  };

  const handleSignInEmailPassword = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error('ログインエラー:', error.message);
    } else {
      router.refresh();
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    });

    // `auth.users`テーブルから取得したユーザー情報を使用して`User`テーブルにレコードを追加
    if (data) {
      const { user } = data;
      // `auth.users`テーブルから取得したユーザー情報を使用して`User`テーブルにレコードを追加
      const { error: insertError } = await supabase.from('User').insert([
        {
          id: user?.id,
          email: user?.email,
          // その他の必要な情報を追加
        },
      ]);

      if (insertError) {
        console.error('Failed to insert user into custom User table:', insertError);
      }
    }
  };

  return session ? (
    <button onClick={handleSignOut}>Logout</button>
  ) : (
    <>
      <button onClick={handleSignInGithub}>Login with GitHub</button>
      <button onClick={handleSignInGoogle}>Login with Google</button>
      <form onSubmit={(e) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const email = target.elements.namedItem('email') as HTMLInputElement;
        const password = target.elements.namedItem('password') as HTMLInputElement;
        handleSignInEmailPassword(email.value, password.value);
      }}>
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">メアドでログイン</button>
      </form>

      <form onSubmit={(e) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const email = target.elements.namedItem('email') as HTMLInputElement;
        const password = target.elements.namedItem('password') as HTMLInputElement;
        handleSignUp(email.value, password.value);
      }}>
        {/* <form onSubmit={(e) => {
       console.log("hogehoge")*/}
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">メアドで登録</button>
      </form>


    </>
  );
}