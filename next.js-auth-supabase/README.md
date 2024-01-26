# 当リポジトリについて
チュートリアルや参考サイトに沿って実装

## 実装内容
- Next.js + Supabase で認証機能、データベースとのCRUDを実装する
- Prismaを使ったORM、データベースのマイグレーション、シーディングを実装する
- スキーマ定義から型を生成することで、スキーマ駆動開発を実装する

## 採用技術
- Next.js 14.0.2
- TypeScript 4.4.3
- Supabase 1.25.0
- Tailwind CSS 2.2.7

## 参考サイト

- [Next.js + Supabase でログイン周りの機能を実装する](https://qiita.com/masakiwakabayashi/items/716577dbfebf83665378)
- [Next.js 13 App router Supabase 認証機能付き vns開発用テンプレート](https://qiita.com/masakinihirota/items/12da291e560c4850b511#todo)
- [Next.js + Supabase でログイン周りの機能を実装する](https://qiita.com/masakiwakabayashi/items/716577dbfebf83665378)
- [Next.js + Supabase アプリでサーバーやローカル開発環境で、認証に必要な Client ID と Client secrets の取得。(Slack、Google、GitHub)(フロー図がわかりやすい)](https://qiita.com/masakinihirota/items/706326a64dab3ffbf55b)

## supabaseのauth-helpers-nextjsを使った認証機能の実装の流れ
1 ユーザーがサインインを試みる: handleSignIn 関数が supabase.auth.signInWithOAuth メソッドを呼び出し、GitHubなどのOAuthプロバイダを使ってユーザーの認証を開始します。
2 OAuthプロバイダの認証ページにリダイレクト: ユーザーはOAuthプロバイダ（このケースではGitHub）の認証ページにリダイレクトされます。
3 ユーザーがプロバイダで認証: ユーザーがプロバイダでログインし、アプリケーションにアクセスを許可します。
4 Supabaseにリダイレクト: プロバイダの認証が成功すると、ユーザーは https://<your-project>.supabase.co/auth/v1/callback などのSupabaseの認証コールバックURLにリダイレクトされます。この段階で、プロバイダからSupabaseに認証情報が渡されます。
5 Supabaseでの認証処理と最終的なリダイレクト: Supabaseは認証情報を処理し、supabase.auth.signInWithOAuth メソッドの options で指定された redirectTo URL（この例では http://localhost:3000/auth/callback）にユーザーをリダイレクトします。
6 アプリケーションでの追加処理: 最終的なリダイレクト先であるアプリケーションの /auth/callback で、必要に応じて追加の認証処理やセッション管理などが行われます。（/auth/callback は@supabase/auth-helpers-nextjsの機能で認証処理やセッション管理を行うためのものです）


このフローにより、ユーザーはOAuthプロバイダを通じてSupabaseとアプリケーションに安全に認証されます。また、supabase.auth.signInWithOAuth の redirectTo オプションに指定されたURLは、Supabaseでの認証処理の後、最終的なユーザーのリダイレクト先として機能します。

### Supabaseを使ったデータのながれ
- マイグレーションする（--nameの後ろにマイグレーションする名前）
npx prisma migrate dev --name 
- seed.tsのレコードをテーブルに適用する
npx prisma db seed
- マイグレーションファイルの作成なしにデータベースのテーブルを変更する
npx prisma db push
- 型定義を生成する
npx prisma generate
※型定義詳細は下部参照


### Prisma+Supabaseをバックエンドとする場合のエンドポイントについて
Next.jsのルートハンドラーをエンドポイントとしてデータフェッチしています
- /api/todo/route.ts
todoリストの取得や投稿、削除などの処理を行っています

### Next.jsのルートハンドラーとExpressサーバーについて
Express自体はインストールしたが、ルートハンドラーが十分エンドポイントとしての機能を果たしているので使っていない。

### 型定義とデータフェッチ詳細について
- 単体テーブルについてはテーブル名の型定義があるが、リレーションテーブルについては型定義がないため、
カスタム型定義を作成し、エクスポートし、それをフロント側で使用する。
※他に良い方法があるか確認中（2024/1/26）


