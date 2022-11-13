import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [updatingInput, setUpdatingInput] = useState("");
  const [updatedTodo, setUpdatedTodo] = useState("");

  const addItem = async (e) => {
    e.preventDefault();
    if (input === "") {
      alert("Please Enter a valid todo");
      return;
    }
    try {
      await axios.post("http://localhost:5500/todo", { item: input });
      setInput("");
    }
    catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getTodos = async () => {
      try {
        let allTodos = await axios.get("http://localhost:5500/todo");
        setTodos(allTodos.data);
      }
      catch (err) {
        console.log(err);
      }
    };
    getTodos();
  }, [todos]);

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5500/todo/${id}`);
    }
    catch (err) {
      console.log(err);
    }
  };

  const updateInputForm = () => {
    return (
      <form className="update-form" onSubmit={(e) => updateTodo(e)}>

        <input
          type="text"
          placeholder="Edit the todo"
          className="new-upd-inp"
          onChange={(e) => {
            setUpdatedTodo(e.target.value);
          }}
          value={updatedTodo}
        />

        <button type="submit" className="new-upd-btn">
          Update
        </button>

      </form>
    );
  };

  const updateTodo = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5500/todo/${updatingInput}`, {
        item: updatedTodo,
      });
      setUpdatedTodo("");
      setUpdatingInput("");
    }
    catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <h1>Todo App</h1>
      <form className="form" onSubmit={(e) => addItem(e)}>

        <input
          type="text"
          placeholder="Enter a todo item"
          onChange={(e) => {
            setInput(e.target.value);
          }}
          value={input}
        />

        <button type="submit">Add</button>

      </form>

      <div className="todo-listItems">

        {todos.map((todo) => (
          <div className="todo-Item">
            {updatingInput === todo._id ? (
              updateInputForm()
            ) : (
              <>
                <p className="item-content">{todo.item}</p>
                <div className="btn-wrap">

                  <button
                    className="updBtn"
                    onClick={() => {
                      setUpdatingInput(todo._id);
                    }}>Update
                  </button>

                  <button
                    className="delBtn"
                    onClick={() => {
                      deleteTodo(todo._id);
                    }}>Delete
                  </button>

                </div>
              </>
            )}
          </div>
        ))}

      </div>
    </div>
  );
}

export default App;
