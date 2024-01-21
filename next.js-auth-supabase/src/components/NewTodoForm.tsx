"use client";

import React, { useState } from 'react';

export const NewTodoForm = () => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('ToDoが追加されました！');
        setTitle(''); // フォームをクリア
      } else {
        alert(`エラー: ${data.message}`);
      }
    } catch (error) {
      alert('通信エラーが発生しました。');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="新しいToDoを入力してください"
          required
        />
        <button type="submit">追加</button>
      </form>
    </>

  );
};

