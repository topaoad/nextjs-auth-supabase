"use client";

import { useState } from "react";





export function CodeContactForm() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  async function submitQuestion(question:string) {
    const response = await fetch('http://localhost:3000/api/langchain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log(data); 
    return (data)
  }

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const result = await submitQuestion(question);
      setAnswer(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="質問を入力してください"
      />
      <button type="submit">送信</button>
      <div>{answer}</div>
    </form>
  );
}
