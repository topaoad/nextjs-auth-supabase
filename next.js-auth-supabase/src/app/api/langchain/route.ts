import type { NextApiRequest, NextApiResponse } from 'next';
import { ChatOpenAI } from "@langchain/openai";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import path from 'path';
import dotenv from 'dotenv';
import { BufferMemory } from "langchain/memory";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  AIMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "langchain/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import { BaseMessage } from "langchain/schema";
import readline from 'readline';
import { StringOutputParser } from "@langchain/core/output_parsers";
import { connect } from 'http2';
import { NextResponse } from 'next/server';

// .envファイルの読み込み
// dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config({ path: path.join(process.cwd(), '') });


// データベースにデータを登録する
export const POST = async (req: Request, res: NextResponse) => {
  console.log(req);
  // const { title } = await req.json();
  const { question } = await req.json();

  try {
    // ファイルの呼び出し
    // const REPO_PATH = "../../../repos";
    const REPO_PATH = path.join(process.cwd(), 'src/repos');
    const loader = new DirectoryLoader(REPO_PATH, {
      ".ts": (path) => new TextLoader(path),
      ".tsx": (path) => new TextLoader(path),
      ".js": (path) => new TextLoader(path),
      ".jsx": (path) => new TextLoader(path),
    });
    const docs = await loader.load();
    const javascriptSplitter = RecursiveCharacterTextSplitter.fromLanguage("js", {
      chunkSize: 2000,
      chunkOverlap: 200,
    });
    const texts = await javascriptSplitter.splitDocuments(docs);

    console.log("Loaded ", texts.length, " documentssub.");

    const privateKey = process.env.SUPABASE_PRIVATE_KEY;
    if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

    const url = process.env.SUPABASE_URL;
    if (!url) throw new Error(`Expected env var SUPABASE_URL`);

    const client = createClient(url, privateKey);

    const vectorStore = await SupabaseVectorStore.fromDocuments(
      texts,
      new OpenAIEmbeddings(),
      {
        client,
        tableName: "documents",
        queryName: "match_documents",
      }
    );


    const retriever = vectorStore.asRetriever({
      searchType: "mmr", // Use max marginal relevance search
      searchKwargs: { fetchK: 5 },
    });

    const model = new ChatOpenAI({ modelName: "gpt-4" }).pipe(
      new StringOutputParser()
    );

    const memory = new BufferMemory({
      returnMessages: true, // Return stored messages as instances of `BaseMessage`
      memoryKey: "chat_history", // This must match up with our prompt template input variable.
    });

    // プロンプトの作成
    const questionGeneratorTemplate = ChatPromptTemplate.fromMessages([
      AIMessagePromptTemplate.fromTemplate(
        "Given the following conversation about a codebase and a follow up question, rephrase the follow up question to be a standalone question."
      ),
      new MessagesPlaceholder("chat_history"),
      AIMessagePromptTemplate.fromTemplate(`Follow Up Input: {question}
Standalone question:`),
    ]);

    // 文書を統合するプロンプトの作成
    const combineDocumentsPrompt = ChatPromptTemplate.fromMessages([
      AIMessagePromptTemplate.fromTemplate(
        "Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.\n\n{context}\n\n"
      ),
      new MessagesPlaceholder("chat_history"),
      HumanMessagePromptTemplate.fromTemplate("Question: {question}"),
    ]);

    // チェーンの作成
    const combineDocumentsChain = RunnableSequence.from([
      {
        question: (output: string) => output,
        chat_history: async () => {
          const { chat_history } = await memory.loadMemoryVariables({});
          return chat_history;
        },
        context: async (output: string) => {
          const relevantDocs = await retriever.getRelevantDocuments(output);
          return formatDocumentsAsString(relevantDocs);
        },
      },
      combineDocumentsPrompt,
      model,
      new StringOutputParser(),
    ]);

    const conversationalQaChain = RunnableSequence.from([
      {
        question: (i: { question: string }) => i.question,
        chat_history: async () => {
          const { chat_history } = await memory.loadMemoryVariables({});
          return chat_history;
        },
      },
      questionGeneratorTemplate,
      model,
      new StringOutputParser(),
      combineDocumentsChain,
    ]);

    // 質問に対する回答を取得
    const result = await conversationalQaChain.invoke({
      question,
    });

    await memory.saveContext(
      {
        input: question,
      },
      {
        output: result,
      }
    );
    console.log(result);


    return NextResponse.json({ message: "投稿完了", result: result }, { status: 200 });
    
  } catch (error) {
    console.error('エラー発生:', error); // エラー情報を詳細に出力
    return NextResponse.json({ messeage: "投稿失敗" }, { status: 500 })

  } finally {
    console.log('finally');
  }
}