// Dependencies //
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
// Context //
import { AuthContext } from "../helpers/AuthContext";
// React Icons //
import { FaUser, FaPowerOff } from "react-icons/fa";

interface ErrorResponse {
  message: string;
}

const Header = () => {
  const { user, setUser } = useContext(AuthContext);

  let navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/v1/users/logout", null, {
        withCredentials: true,
      });

      setUser({
        id: "",
        username: "",
        email: "",
        picture: "",
        created_at: "",
        updated_at: "",
        last_signed_in: "",
        status: false,
      });

      navigate("/login");
    } catch (err) {
      // error is an Axios Error
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;

        // axios error has a response
        if (axiosError.response) {
          const errorResponse = axiosError.response.data as ErrorResponse;
          console.log(errorResponse.message);
        }
        // axios error has a request
        else if (axiosError.request) {
          console.log(axiosError.request);
          alert("No response recieved. Please check your internet connection.");
        }
        // axios error has a message
        else {
          console.log("Error", axiosError.message);
          alert("An error occurred. Please try again.");
        }
      }
      // unknown error
      else {
        console.log("Error", err);
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <nav className="h-16 bg-black flex justify-between">
      <div className="flex items-center">
        <Link
          to="/"
          className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 mx-5 rounded-md text-sm font-medium"
        >
          Chat Web App
        </Link>
      </div>

      {user.status ? (
        <div className="flex items-center">
          <Link
            to="/profile"
            className="flex items-center bg-white hover:bg-gray-200 text-black font-bold py-1 px-3 rounded"
          >
            {user.username}
            <FaUser className="ml-1" />
          </Link>
          <button
            className="flex items-center bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 mx-5 rounded"
            onClick={logout}
          >
            Logout
            <FaPowerOff className="ml-1" />
          </button>
        </div>
      ) : (
        <div className="flex items-center">
          <Link
            to="/login"
            className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 mx-5 rounded-md text-sm font-medium"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 mx-5 rounded-md text-sm font-medium"
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
};
export default Header;
