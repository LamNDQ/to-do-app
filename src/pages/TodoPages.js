import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addTodo, updateTodo, deleteTodo, toggleTodo } from "../redux/todoSlice";
import Button from "../components/Button";
import "../styles/TodoPage.css";

const FILTERS = ["All", "Active", "Completed"];

// Format ISO date string to readable "HH:mm DD/MM/YYYY"
const formatDate = (iso) => {
    const d = new Date(iso);
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")} — ${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
};

function TodoPage() {
    const dispatch = useDispatch();
    const todos = useSelector((state) => state.todos);


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

    /* ── Add ── */
    const handleAdd = () => {
        const trimmed = input.trim();
        if (!trimmed) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }
        dispatch(addTodo(trimmed));
        setInput("");
        inputRef.current.focus();
        toast.success("✦ Task added!");
    };

    /* ── Toggle ── */
    const handleToggle = (id) => {
        dispatch(toggleTodo(id));
    };

    /* ── Delete ── */
    const handleDelete = (id) => {
        dispatch(deleteTodo(id));
        toast.error("🗑 Task deleted");
    };

    /* ── Edit start ── */
    const handleStartEdit = (todo) => {
        setEditId(todo.id);
        setEditText(todo.text);
    };

    /* ── Edit save ── */
    const handleSaveEdit = (id) => {
        const trimmed = editText.trim();
        if (!trimmed) return;
        dispatch(updateTodo({ id, text: trimmed }));
        setEditId(null);
        setEditText("");
        toast.info("✎ Task updated");
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setEditText("");
    };

    /* ── Clear completed ── */
    const handleClearCompleted = () => {
        todos.filter((t) => t.done).forEach((t) => dispatch(deleteTodo(t.id)));
        toast.warn("Cleared all completed tasks");
    };

    /* ── Filter ── */
    const filtered = todos.filter((t) => {
        if (filter === "Active") return !t.done;
        if (filter === "Completed") return t.done;
        return true;
    });

    const activeCount = todos.filter((t) => !t.done).length;
    const completedCount = todos.filter((t) => t.done).length;

    return (
        <div className="page-wrapper">
            <div className="todo-bg-grid" />

            {/* Page header */}
            <div className="page-header">
                <span className="page-icon spin">✦</span>
                <div>
                    <h1 className="page-title">My Tasks</h1>
                    <p className="page-subtitle">Organize your day, own your time.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-row">
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
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />
                <button className="add-btn" onClick={handleAdd}>＋</button>
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
                        <span className="empty-icon">☁️</span>
                        <p>No tasks here!</p>
                    </li>
                )}

                {filtered.map((todo) => (
                    <li key={todo.id} className={`todo-item ${todo.done ? "done" : ""}`}>
                        {editId === todo.id ? (
                            /* ── Edit mode ── */
                            <div className="edit-row">
                                <input
                                    ref={editRef}
                                    className="edit-input"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleSaveEdit(todo.id);
                                        if (e.key === "Escape") handleCancelEdit();
                                    }}
                                />
                                <Button variant="success" onClick={() => handleSaveEdit(todo.id)} title="Save">✓</Button>
                                <Button variant="ghost" onClick={handleCancelEdit} title="Cancel">✕</Button>
                            </div>
                        ) : (
                            /* ── View mode ── */
                            <>
                                <button
                                    className={`check-btn ${todo.done ? "checked" : ""}`}
                                    onClick={() => handleToggle(todo.id)}
                                    title={todo.done ? "Mark incomplete" : "Mark complete"}
                                >
                                    {todo.done ? "✓" : ""}
                                </button>

                                <div className="todo-info">
                                    <span className="todo-text">{todo.text}</span>
                                    <span className="todo-time">{formatDate(todo.createdAt)}</span>
                                </div>

                                <div className="action-btns">
                                    <Button variant="ghost" onClick={() => handleStartEdit(todo)} title="Edit">✎</Button>
                                    <Button variant="danger" onClick={() => handleDelete(todo.id)} title="Delete">🗑</Button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>

            {/* Footer */}
            {completedCount > 0 && (
                <div className="todo-footer">
                    <button className="clear-btn" onClick={handleClearCompleted}>
                        Clear completed ({completedCount})
                    </button>
                </div>
            )}
        </div>
    );
}

export default TodoPage;
