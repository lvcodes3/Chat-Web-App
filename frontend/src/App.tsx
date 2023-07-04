// Dependencies //
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Context //
import { AuthContext } from "./helpers/AuthContext";
// Pages & Components //
import Header from "./components/Header";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

interface User {
  id: string;
  username: string;
  email: string;
  picture: string;
  created_at: string;
  updated_at: string;
  last_signed_in: string;
  status: boolean;
}

const initialUser: User = {
  id: "",
  username: "",
  email: "",
  picture: "",
  created_at: "",
  updated_at: "",
  last_signed_in: "",
  status: false,
};

function App() {
  const [user, setUser] = useState<User>(initialUser);

  return (
    <>
      <AuthContext.Provider value={{ user, setUser }}>
        <Router>
          <Header />
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </>
  );
}

export default App;
