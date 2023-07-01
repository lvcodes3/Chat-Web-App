// Dependencies //
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
// Context //
import { AuthContext } from "../helpers/AuthContext";

interface FormDataTypes {
  email: string;
  password: string;
}

interface ErrorResponse {
  message: string;
}

const Login = () => {
  const { setUser } = useContext(AuthContext);

  let navigate = useNavigate();

  const [formData, setFormData] = useState<FormDataTypes>({
    email: "",
    password: "",
  });

  const validateFormData = () => {
    let errorCount: number = 0;

    // email //
    if (formData.email.length === 0) {
      toast.error("Your email is required.");
      errorCount++;
    }

    // password //
    if (formData.password.length === 0) {
      toast.error("Your password is required.");
      errorCount++;
    }

    // validation result //
    if (errorCount === 0) {
      return true;
    } else {
      return false;
    }
  };

  const formSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // prevent screen refresh when form is submitted //
    e.preventDefault();

    // validate inputs //
    if (validateFormData()) {
      try {
        // submit form data //
        const response = await axios.post(
          "http://localhost:5000/api/v1/users/login",
          formData,
          { withCredentials: true }
        );

        // set the context values //
        setUser({
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          picture: response.data.picture,
          created_at: response.data.created_at,
          updated_at: response.data.updated_at,
          last_signed_in: response.data.last_signed_in,
          status: false,
        });

        // go to home page //
        navigate("/");
      } catch (err: unknown) {
        // error is an Axios Error
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError<ErrorResponse>;

          // axios error has a response
          if (axiosError.response) {
            const errorResponse = axiosError.response.data as ErrorResponse;
            toast.error(errorResponse.message);
          }
          // axios error has a request
          else if (axiosError.request) {
            console.log(axiosError.request);
            alert(
              "No response recieved. Please check your internet connection."
            );
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
    }
  };

  return (
    <div className="flex justify-center my-5">
      <form
        className="w-3/4 p-6 border-2 border-black rounded-md"
        onSubmit={formSubmit}
      >
        <h1 className="text-center text-xl block mb-2 font-bold">Login</h1>

        <label htmlFor="email" className="block mb-2 font-bold">
          Email:
        </label>
        <input
          id="email"
          type="email"
          className="w-full p-2 mb-4 border-2 border-black rounded-md"
          autoComplete="off"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              email: e.target.value,
            }));
          }}
        />

        <label htmlFor="password" className="block mb-2 font-bold">
          Password:
        </label>
        <input
          id="password"
          type="password"
          className="w-full p-2 mb-4 border-2 border-black rounded-md"
          autoComplete="off"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              password: e.target.value,
            }));
          }}
        />

        <button
          type="submit"
          className="w-full p-2 text-white bg-black rounded-md"
        >
          Login
        </button>
      </form>
    </div>
  );
};
export default Login;
