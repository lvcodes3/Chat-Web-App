// Dependencies //
import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios, { AxiosError } from "axios";
// Context //
import { AuthContext } from "../helpers/AuthContext";
// Components //
import AuthLanding from "../components/AuthLanding";
import UnauthLanding from "../components/UnauthLanding";

interface ErrorResponse {
  message: string;
}

const Home = () => {
  const location = useLocation();

  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/users/auth",
          {
            withCredentials: true,
          }
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
          status: true,
        });
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
    if (location.pathname === "/") {
      authenticateUser();
    }
  }, [location.pathname, setUser]);

  return <div>{user.status ? <AuthLanding /> : <UnauthLanding />}</div>;
};
export default Home;
