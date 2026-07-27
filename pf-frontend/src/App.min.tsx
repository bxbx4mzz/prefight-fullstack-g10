import { useEffect, useState } from "react";
import axios from "axios";
import { type TodoItem } from "./types";
function App() {
  const [todos, setTodos] = useState<TodoItem[]>([]);

  async function fetchData() {
    // This will not work without CORS enabled.
    // const res = await axios.get<TodoItem[]>("http://localhost:3001/todo");

    // Using proxy server to avoid dealing with CORS.
    const res = await axios.get<TodoItem[]>("api/todo");
    setTodos(res.data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
      <header>
        <h1>Todo App</h1>
      </header>
      <main>
        <pre>{JSON.stringify(todos)}</pre>
      </main>
    </div>
  );
}

export default App;
