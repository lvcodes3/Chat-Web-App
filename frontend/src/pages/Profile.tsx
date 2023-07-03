// Dependencies //
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
// Context //
import { AuthContext } from "../helpers/AuthContext";

interface ErrorResponse {
  message: string;
}

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);

  let navigate = useNavigate();

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/users/profile",
          {
            withCredentials: true,
          }
        );
        console.log(response);
      } catch (err: unknown) {
        // error is an Axios Error
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError<ErrorResponse>;

          // axios error has a response
          if (axiosError.response) {
            const errorResponse = axiosError.response.data as ErrorResponse;
            console.log(errorResponse.message);

            // set the default context values //
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
    };
    authenticateUser();
  }, [setUser]);

  return (
    <div>
      {user.status ? (
        <div className="my-5">
          <h1 className="text-center text-2xl font-bold">
            Hello, {user.username}!
          </h1>
        </div>
      ) : (
        <div className="my-5">
          <h1 className="text-center text-2xl font-bold mb-2">
            Access Denied!
          </h1>
          <h2
            className="text-center text-xl font-bold underline cursor-pointer"
            onClick={() => {
              navigate("/login");
            }}
          >
            Click here to Log In!
          </h2>
        </div>
      )}
    </div>
  );
};
export default Profile;
