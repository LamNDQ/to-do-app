import React, { useState, useRef, useEffect } from "react";
import "./App.css";

const FILTERS = ["All", "Active", "Completed"];

function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Thiết kế giao diện ứng dụng", done: true },
    { id: 2, text: "Viết unit test cho các component", done: false },
    { id: 3, text: "Deploy lên production server", done: false },
  ]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("All");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [shake, setShake] = useState(false);
  const inputRef = useRef();
  const editRef = useRef();

  useEffect(() => {
    if (editId !== null && editRef.current) editRef.current.focus();
  }, [editId]);

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setTodos([
      ...todos,
      { id: Date.now(), text: trimmed, done: false },
    ]);
    setInput("");
    inputRef.current.focus();
  };

  const toggleDone = (id) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const startEdit = (todo) => {
    setEditId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id) => {
    const trimmed = editText.trim();
    if (!trimmed) return;
    setTodos(todos.map((t) => (t.id === id ? { ...t, text: trimmed } : t)));
    setEditId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText("");
  };

  const clearCompleted = () => {
    setTodos(todos.filter((t) => !t.done));
  };

  const filtered = todos.filter((t) => {
    if (filter === "Active") return !t.done;
    if (filter === "Completed") return t.done;
    return true;
  });

  const activeCount = todos.filter((t) => !t.done).length;
  const completedCount = todos.filter((t) => t.done).length;

  return (
    <div className="app">
      <div className="bg-grid" />
      <div className="glow glow-1" />
      <div className="glow glow-2" />

      <div className="container">
        <header className="header">
          <div className="header-icon">✦</div>
          <h1 className="title">My Tasks</h1>
          <p className="subtitle">Organize your day, own your time.</p>
        </header>

        {/* Stats */}
        <div className="stats">
          <div className="stat-card">
            <span className="stat-num">{todos.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card accent">
            <span className="stat-num">{activeCount}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-card success">
            <span className="stat-num">{completedCount}</span>
            <span className="stat-label">Done</span>
          </div>
        </div>

        {/* Input */}
        <div className={`input-row ${shake ? "shake" : ""}`}>
          <input
            ref={inputRef}
            className="task-input"
            type="text"
            placeholder="Add a new task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />
          <button className="add-btn" onClick={addTodo}>
            <span className="add-icon">＋</span>
          </button>
        </div>

        {/* Filter tabs */}
        <div className="filter-row">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Todo list */}
        <ul className="todo-list">
          {filtered.length === 0 && (
            <li className="empty-state">
              <p>No tasks here!</p>
            </li>
          )}
          {filtered.map((todo) => (
            <li key={todo.id} className={`todo-item ${todo.done ? "done" : ""}`}>
              {editId === todo.id ? (
                <div className="edit-row">
                  <input
                    ref={editRef}
                    className="edit-input"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(todo.id);
                      if (e.key === "Escape") cancelEdit();
                    }}
                  />
                  <button className="icon-btn save-btn" onClick={() => saveEdit(todo.id)} title="Save">✓</button>
                  <button className="icon-btn cancel-btn" onClick={cancelEdit} title="Cancel">✕</button>
                </div>
              ) : (
                <>
                  <button
                    className={`check-btn ${todo.done ? "checked" : ""}`}
                    onClick={() => toggleDone(todo.id)}
                    title={todo.done ? "Mark incomplete" : "Mark complete"}
                  >
                    {todo.done ? "✓" : ""}
                  </button>
                  <span className="todo-text">{todo.text}</span>
                  <div className="action-btns">
                    <button
                      className="icon-btn edit-btn"
                      onClick={() => startEdit(todo)}
                      title="Edit"
                    >✎</button>
                    <button
                      className="icon-btn delete-btn"
                      onClick={() => deleteTodo(todo.id)}
                      title="Delete"
                    >🗑</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        {/* Footer */}
        {completedCount > 0 && (
          <div className="footer">
            <button className="clear-btn" onClick={clearCompleted}>
              Clear completed ({completedCount})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;