import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import  {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const URL = process.env.REACT_APP_SERVER_URL

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [updatingInput, setUpdatingInput] = useState("");
  const [updatedTodo, setUpdatedTodo] = useState("");

  const addItem = async (e) => {
    e.preventDefault();
    if (input === "") {
      return toast.error("Input field cannot be empty");
    }
    try {
      await axios.post(`${URL}/todo`, { item: input });
      setInput("");
      toast.success("Todo added")
    }
    catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const getTodos = async () => {
      try {
        let allTodos = await axios.get(`${URL}/todo`);
        setTodos(allTodos.data);
      }
      catch (error) {
        toast.error(error.message)
      }
    };
    getTodos();
  }, [todos]);

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${URL}/todo/${id}`);
      toast.error("Todo deleted");
    }
    catch (error) {
      toast.error(error.message)
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
      await axios.put(`${URL}/todo/${updatingInput}`, {
        item: updatedTodo,
      });
      setUpdatedTodo("");
      setUpdatingInput("");
      toast.success("Todo updated successfully");
    }
    catch (error) {
      toast.error(error.message)
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

        {todos.map((todo, index) => (
          <div className="todo-Item" key={index}>
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
      <ToastContainer/>
    </div>
  );
}

export default App;
