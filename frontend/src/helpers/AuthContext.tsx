// Dependencies //
import { createContext, Dispatch, SetStateAction } from "react";

// Defining the User interface to repesent the user state structure //
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

// Defining the AuthContextType interface to represent the shape of the AuthContext value //
interface AuthContextType {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}

// Defining the initial user state //
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

const initialAuthState: AuthContextType = {
  user: initialUser,
  setUser: () => {},
};

// Creating the AuthContext object with initial value of undefined //
export const AuthContext = createContext<AuthContextType>(initialAuthState);
