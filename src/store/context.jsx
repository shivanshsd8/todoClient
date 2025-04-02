import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"

export const TodoContext = createContext();

export function TodoProvider({ children }) {
    const [loggedIn, setLoggedIn] = useState(false)
    const [todos, setTodos] = useState([])
    const [loading, setLoading] = useState(false)
    const [signInerror, setSignInError] = useState()
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = useState('')

    // All Sign in and Signup related Function :-
    async function signupHandler(username, password, name, setErrors, setShowPopUp, setPopUpMessage) {
        try {
            // setLoading(true);
            setErrors({});
            const response = await fetch('https://todoserver-68m5.onrender.com/api/v1/user/signup', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, name })
            })
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Signup Failed!")
            }
            else {
                setPopUpMessage(data.message);
                setShowPopUp(true);
                setTimeout(() => {
                    navigate('/signin')
                }, 1500)
            }
        }
        catch (err) {
            setPopUpMessage(err.message);
            setShowPopUp(true);
            setLoading(false)
            navigate('/signup')
        }

    }
    async function signInHandler(username, password, setErrors, setShowPopUp, setPopUpMessage) {
        try {
            setLoading(true);
            setErrors({})
            const response = await fetch('https://todoserver-68m5.onrender.com/api/v1/user/signin', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            })

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "SignIn failed, Please try again!")
            }
            if (!data.token) {
                throw new Error("Login failed!")
            }
            localStorage.setItem('token', data.token)
            setLoggedIn(true)
            setCurrentTab('Home')
            navigate('/home')
        }
        catch (err) {
            setPopUpMessage(err.message);
            setShowPopUp(true);
        }
        finally {
            setLoading(false)
        }
    }
    async function addTodoHandler(title, description) {
        try {
            const response = await fetch('https://todoserver-68m5.onrender.com/api/v1/todo/addTodo', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem('token')
                },
                body: JSON.stringify({ title, description })
            })
            const data = await response.json();
            if (response.ok) {
                const newTodo = { title, description, done: data.newTodo.done, _id: data.newTodo._id }
                setTodos([...todos, newTodo])
                navigate('/home')
            }
            else {
                alert(data.message || "Failed to add todo!")
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    // All Todo Related Functions and variables :-

    async function deleteTodoHandler(todo) {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                navigate('/signin')
                return;
            }
            const response = await fetch(`https://todoserver-68m5.onrender.com/api/v1/todo/deleteTodo/${todo._id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            })
            const data = await response.json();
            if (response.ok) {
                setTodos(prevTodos => prevTodos.filter(t => t._id !== todo._id))
            }
            else {
                alert('failed to delete todo!')
            }
        }
        catch (err) {
            alert('Failed to delete Todo' + err)
        }
    }
    async function updateTodoHandler(todo, updatedTodo) {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                navigate('/signin')
                return;
            }
            const response = await fetch(`https://todoserver-68m5.onrender.com/api/v1/todo/updateTodo/${todo._id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(updatedTodo)
            })
            const data = await response.json();
            if (response.ok) {
                setTodos(prevTodos =>
                    prevTodos.map(t => (t._id === todo._id ? { ...t, ...updatedTodo } : t))
                );
                alert('Todo Updated!')
            }
            else {
                alert(data.message)
                navigate('/home')
            }
        }
        catch (err) {
            alert('Failed to update todo ' + err)
        }
    }
    async function markAsDoneHandler(todo, newUpdatedtodo) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/signin')
                return;
            }
            const response = await fetch(`https://todoserver-68m5.onrender.com/api/v1/todo/updateTodo/${todo._id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(newUpdatedtodo)
            })
            const data = await response.json();
            if (!response.ok) {
                alert('failed to update!')
                return;
            }
        }
        catch (err) {
            alert("Failed to mark todo as Done" + err)
        }
    }

    useEffect(() => {
        async function fetchTodos() {
            const token = localStorage.getItem('token');
            if (!token) {
                if (window.location.pathname !== '/') {
                    navigate('/signin');
                }
                return;
            }
            else {
                setLoggedIn(true);
                const res = await fetch('https://todoserver-68m5.onrender.com/api/v1/todo/', {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": localStorage.getItem('token')
                    },
                })
                const data = await res.json();
                setTodos(data.allTodos || [])
            }

        }
        fetchTodos();
    }, [loggedIn])

    function logout() {
        localStorage.removeItem('token')
        setLoggedIn(false)
        navigate('/')
    }
    return (
        <TodoContext.Provider value={{ loggedIn, todos, setTodos, setLoggedIn, signInHandler, logout, signInerror, addTodoHandler, signupHandler, loading, currentTab, setCurrentTab, updateTodoHandler, deleteTodoHandler, markAsDoneHandler }}>
            {children}
        </TodoContext.Provider>
    )
}