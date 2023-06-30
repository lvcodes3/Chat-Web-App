// Dependencies //
import { Link } from "react-router-dom";
// React Icons //
import { FaUser, FaPowerOff } from "react-icons/fa";

const Header = () => {
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
    </nav>
  );
};
export default Header;
