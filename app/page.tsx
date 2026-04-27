"use client";

import { FormEvent, useState } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = () => {
    const text = input.trim();

    if (!text) {
      return;
    }

    setTodos((prev) => [{ id: Date.now(), text, completed: false }, ...prev]);
    setInput("");
  };

  const handleAddTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo();
  };

  const handleDeleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleToggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  return (
    <main
      style={{
        maxWidth: "640px",
        margin: "48px auto",
        padding: "0 16px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: "20px", color: "red", textAlign: "center" }}>
        ToDo App
      </h1>

      <form onSubmit={handleAddTodo} style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="新しいToDoを入力"
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />
        <button
          type="button"
          onClick={addTodo}
          style={{
            padding: "10px 16px",
            borderRadius: "6px",
            border: "none",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          追加
        </button>
      </form>

      <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px",
              marginBottom: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo.id)}
              />
              <span
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                  color: todo.completed ? "#6b7280" : "#111827",
                }}
              >
                {todo.text}
              </span>
            </label>
            <button
              type="button"
              onClick={() => handleDeleteTodo(todo.id)}
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "none",
                background: "#dc2626",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
