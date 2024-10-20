import React, { useEffect, useState } from "react";
import "./App.css"; // optional for additional styling

const TodoApp = () => {
  const [task, setTask] = useState("");
  const [update, setUpdate] = useState({});
  const [todoList, setTodoList] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [edit, setEdit] = useState(false);

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

  const addData = async () => {
    try {
      const postUrl = "http://localhost:2000/";
      const response = await fetch(postUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: task,
          isCompleted: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const data = await response.json();
      console.log("new data", data);

      // After successful response, update the todo list with the new task
      setTodoList([...todoList, data]); // Assuming 'data' contains the new task details
    } catch (error) {
      console.log("Error adding task:", error);
    }
  };

  // Function to handle adding a new task
  const addTask = () => {
    if (task.trim() !== "") {
      addData(); // Only call addData if the task input is not empty
      setTask(""); // Reset task input after calling the API
    }
  };

  // Function to mark task as complete
  const toggleComplete = (index) => {
    const newTodoList = [...todoList];
    newTodoList[index].isCompleted = !newTodoList[index].isCompleted; // Fix to toggle individual task completion
    setTodoList(newTodoList);
  };

  const upDateData = async (id) => {
    const updateUrl = `http://localhost:2000/${id}`;
    try {
      const response = await fetch(updateUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Add correct headers for JSON
        },
        body: JSON.stringify({
          task: update.task, // Use updated task
          isCompleted: update.isCompleted || false, // Default to false if undefined
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTask = await response.json();
      console.log("Task updated:", updatedTask);

      // Update task in the todo list without refreshing
      const updatedList = todoList.map((todo) =>
        todo._id === id ? updatedTask : todo
      );
      setTodoList(updatedList);

      // Exit edit mode
      setEdit(false);
      setUpdate({});
    } catch (error) {
      console.log(error);
    }
  };

  const updateTask = (todo) => {
    setEdit(true); // Enter edit mode
    setUpdate(todo); // Set the task to be updated
  };

  // Function to delete a task
  const deleteTask = async (id) => {
    const delUrl = `http://localhost:2000/${id}`; // Include id in the URL
    try {
      const response = await fetch(delUrl, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the task");
      }

      console.log("Task deleted:", response);

      // Filter out the task with the matching id
      const newTodoList = todoList.filter((task) => task._id !== id);
      setTodoList(newTodoList);
    } catch (error) {
      console.log("Error deleting task:", error);
    }
  };

  return (
    <div className="todo-app">
      <h1>To-Do List</h1>
      <div className="input-container">
        {edit ? (
          <input
            type="text"
            placeholder="Update task"
            value={update.task}
            onChange={
              (e) => setUpdate({ ...update, task: e.target.value }) // Only update the task field
            }
          />
        ) : (
          <input
            type="text"
            placeholder="Add a new task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
        )}
        {edit ? (
          <button onClick={() => upDateData(update._id)}>Edit Task</button> // Pass function reference
        ) : (
          <button onClick={addTask}>Add Task</button>
        )}
      </div>
      <ul className="todo-list">
        {todoList.map((todo, index) => (
          <li key={index} className={todo.isCompleted ? "completed" : ""}>
            <span onClick={() => toggleComplete(index)}>{todo.task}</span>
            <button
              type="submit"
              onClick={() => updateTask(todo)} // Set the task for editing
            >
              Edit
            </button>
            <button className="delete-btn" onClick={() => deleteTask(todo._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
