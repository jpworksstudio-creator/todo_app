"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type FilterType = "all" | "active" | "completed";

export default function Home() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const hasInitializedStorage = useRef(false);

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

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");

    if (savedTodos) {
      try {
        const parsed = JSON.parse(savedTodos) as Todo[];
        if (Array.isArray(parsed)) {
          queueMicrotask(() => {
            setTodos(parsed);
          });
        }
      } catch {
        // Ignore invalid JSON and fall back to empty list.
      }
    }

    hasInitializedStorage.current = true;
  }, []);

  useEffect(() => {
    if (!hasInitializedStorage.current) {
      return;
    }

    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") {
      return !todo.completed;
    }

    if (filter === "completed") {
      return todo.completed;
    }

    return true;
  });

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

      <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
        <button
          type="button"
          onClick={() => setFilter("all")}
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            background: filter === "all" ? "#111827" : "#ffffff",
            color: filter === "all" ? "#ffffff" : "#111827",
            cursor: "pointer",
          }}
        >
          すべて
        </button>
        <button
          type="button"
          onClick={() => setFilter("active")}
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            background: filter === "active" ? "#111827" : "#ffffff",
            color: filter === "active" ? "#ffffff" : "#111827",
            cursor: "pointer",
          }}
        >
          未完了
        </button>
        <button
          type="button"
          onClick={() => setFilter("completed")}
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            background: filter === "completed" ? "#111827" : "#ffffff",
            color: filter === "completed" ? "#ffffff" : "#111827",
            cursor: "pointer",
          }}
        >
          完了
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
        {filteredTodos.map((todo) => (
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
