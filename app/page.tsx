"use client";

import type { CSSProperties } from "react";
import {
  FormEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const newTodoInputStyle: CSSProperties = {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  boxSizing: "border-box",
  fontSize: "16px",
  fontFamily: "inherit",
};

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type FilterType = "all" | "active" | "completed";

type TodoTextScrollBoxProps = {
  isEditing: boolean;
  editingText: string;
  onEditingChange: (value: string) => void;
  displayText: string;
  completed: boolean;
};

function TodoTextScrollBox({
  isEditing,
  editingText,
  onEditingChange,
  displayText,
  completed,
}: TodoTextScrollBoxProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [hasHorizontalScroll, setHasHorizontalScroll] = useState(false);

  useLayoutEffect(() => {
    const el = outerRef.current;
    if (!el) {
      return;
    }

    const measure = () => {
      setHasHorizontalScroll(el.scrollWidth > el.clientWidth + 1);
    };

    measure();

    const observer = new ResizeObserver(() => {
      queueMicrotask(measure);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [isEditing, editingText, displayText, completed]);

  const justifyContent = hasHorizontalScroll ? "flex-start" : "center";
  const padding = hasHorizontalScroll
    ? "6px 12px 18px 10px"
    : "6px 12px 6px 10px";

  return (
    <div
      ref={outerRef}
      style={{
        minWidth: 0,
        width: "100%",
        maxWidth: "100%",
        height: "68px",
        boxSizing: "border-box",
        overflowX: "auto",
        overflowY: "hidden",
        WebkitOverflowScrolling: "touch",
        border: "1px solid #e5e7eb",
        borderRadius: "6px",
        display: "flex",
        flexDirection: "column",
        justifyContent,
        alignItems: "flex-start",
        padding,
      }}
    >
      <div style={{ whiteSpace: "nowrap" }}>
        {isEditing ? (
          <input
            type="text"
            value={editingText}
            onChange={(event) => onEditingChange(event.target.value)}
            style={{
              ...newTodoInputStyle,
              display: "block",
              width: "100%",
              minWidth: 0,
              margin: 0,
              whiteSpace: "nowrap",
            }}
          />
        ) : (
          <span
            style={{
              display: "inline-block",
              margin: 0,
              padding: "10px",
              lineHeight: "1.25",
              fontSize: "16px",
              whiteSpace: "nowrap",
              verticalAlign: "top",
              border: "1px solid transparent",
              borderRadius: "6px",
              boxSizing: "border-box",
              textDecoration: completed ? "line-through" : "none",
              color: completed ? "#6b7280" : "#111827",
            }}
          >
            {displayText}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
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

  const handleStartEdit = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingText(todo.text);
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setEditingText("");
  };

  const handleSaveEdit = (id: number) => {
    const text = editingText.trim();

    if (!text) {
      return;
    }

    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text } : todo)),
    );
    setEditingTodoId(null);
    setEditingText("");
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
        width: "640px",
        maxWidth: "100%",
        margin: "48px auto",
        padding: "0 16px",
        boxSizing: "border-box",
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
            ...newTodoInputStyle,
            flex: 1,
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
              display: "grid",
              gridTemplateColumns: "22px minmax(0, 1fr) 280px",
              alignItems: "center",
              gap: "10px",
              padding: "12px",
              marginBottom: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxSizing: "border-box",
              width: "100%",
              minHeight: "44px",
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo.id)}
              style={{
                flexShrink: 0,
                width: "18px",
                height: "18px",
                margin: 0,
                alignSelf: "center",
              }}
            />
            <TodoTextScrollBox
              isEditing={editingTodoId === todo.id}
              editingText={editingText}
              onEditingChange={setEditingText}
              displayText={todo.text}
              completed={todo.completed}
            />
            <div
              style={{
                display: "flex",
                flexWrap: "nowrap",
                justifyContent: "flex-end",
                gap: "6px",
                minWidth: 0,
                alignSelf: "center",
              }}
            >
              {editingTodoId === todo.id ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(todo.id)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "none",
                      background: "#2563eb",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    保存
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      background: "#fff",
                      color: "#111827",
                      cursor: "pointer",
                    }}
                  >
                    キャンセル
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => handleStartEdit(todo)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "none",
                    background: "#4b5563",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  編集
                </button>
              )}
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
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
