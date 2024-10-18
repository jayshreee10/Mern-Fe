import React, { useEffect, useState } from "react";
import "./App.css"; // optional for additional styling

const TodoApp = () => {
  const [task, setTask] = useState("");
  const [todoList, setTodoList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "http://localhost:2000/";
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        setTodoList(data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const postUrl = "http://localhost:2000/add";

  const addData = async () => {
    try {
      const postUrl = "http://localhost:2000/user";
      const response = await fetch(postUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: task,
          completed: true,
        }),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  // Function to handle adding a new task
  const addTask = () => {
    if (task.trim() !== "") {
      setTodoList([...todoList, { text: task, completed: false }]);
      setTask(""); // Reset task input
    }
    addData();
  };

  // Function to mark task as complete
  const toggleComplete = (index) => {
    const newTodoList = [...todoList];
    newTodoList[index].completed = !newTodoList[index].completed;
    setTodoList(newTodoList);
  };

  // Function to delete a task
  const deleteTask = (index) => {
    const newTodoList = todoList.filter((_, i) => i !== index);
    setTodoList(newTodoList);
  };

  return (
    <div className="todo-app">
      <h1>To-Do List</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Add a new task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul className="todo-list">
        {todoList.map((todo, index) => (
          <li key={index} className={todo.completed ? "completed" : ""}>
            <span onClick={() => toggleComplete(index)}>{todo.text}</span>
            <button className="delete-btn" onClick={() => deleteTask(index)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
