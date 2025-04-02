import Navbar from "./components/Navbar"
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Home from "./components/Home";
import AddTodo from "./components/AddTodo";
import Welcome from "./components/Welcome";
import Profile from "./components/Profile";

import './App.css'
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { TodoProvider } from "./store/context";


function Footer() {
  return (
    <>
      <div style={{ textAlign: 'center', height: '50px' }}>
        <p>Made with <span aria-label="Love" style={{ color: "#f43f5e" }}>&hearts;</span> by Shivansh</p>
      </div>

    </>
  )
}

function Layout() {
  return (
    <>
      <div className="layout">
        <Navbar />
        <div className="content">
          <Outlet></Outlet>
        </div>
        <Footer />
      </div>
    </>
  )
}

function App() {
  return (
    <>
      <BrowserRouter>
        <TodoProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Welcome />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/home" element={<Home />} />
              <Route path="/addTodo" element={<AddTodo />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </TodoProvider>
      </BrowserRouter>
    </>
  )
}

export default App
