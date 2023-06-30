// Dependencies //
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Context //
import { AuthContext } from "./helpers/AuthContext";
// Pages & Components //
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

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

  useEffect(() => {
    const validateJWT = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/users/auth"
        );
        console.log(response);
      } catch (err: unknown) {
        console.log(err);
      }
    };
    validateJWT();
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ user, setUser }}>
        <Router>
          <Header />
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </>
  );
}

export default App;
