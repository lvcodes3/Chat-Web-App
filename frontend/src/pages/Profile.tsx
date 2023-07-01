// Dependencies //
import { useState, useEffect, useContext } from "react";
import axios, { AxiosError } from "axios";
// Context //
import { AuthContext } from "../helpers/AuthContext";

interface ErrorResponse {
  message: string;
}

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);

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
  }, []);

  return <div>Profile</div>;
};
export default Profile;
