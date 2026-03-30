import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  { id: 1, text: "Thiết kế giao diện ứng dụng", done: true },
  { id: 2, text: "Viết unit test cho các component", done: false },
  { id: 3, text: "Deploy lên production server", done: false },
];

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem("todos");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const storedTodos = loadFromStorage();

const todoSlice = createSlice({
  name: "todos",
  initialState: storedTodos.length ? storedTodos : initialState,
  reducers: {
    addTodo: (state, action) => {
      state.push({
        id: Date.now(),
        text: action.payload,
        done: false,
        createdAt: new Date().toISOString(),
      });
    },
    updateTodo: (state, action) => {
      const { id, text } = action.payload;
      const todo = state.find((t) => t.id === id);
      if (todo) todo.text = text;
    },
    deleteTodo: (state, action) => {
      return state.filter((t) => t.id !== action.payload);
    },
    toggleTodo: (state, action) => {
      const todo = state.find((t) => t.id === action.payload);
      if (todo) todo.done = !todo.done;
    },
  },
});

export const { addTodo, updateTodo, deleteTodo, toggleTodo } = todoSlice.actions;
export default todoSlice.reducer;