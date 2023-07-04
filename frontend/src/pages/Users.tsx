// Dependencies //
import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios, { AxiosError } from "axios";
// Context //
import { AuthContext } from "../helpers/AuthContext";

interface Users {
  id: string;
  username: string;
  picture: string;
  last_signed_in: string;
}

interface Friends {
  id: string;
  sender: string;
  receiver: string;
  status: string;
  friend_at: null | string;
}

interface ErrorResponse {
  message: string;
}

const Users = () => {
  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState<Users[] | undefined>(undefined);
  const [friends, setFriends] = useState<Friends[] | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // get users //
        const usersResponse = await axios.get(
          "http://localhost:5000/api/v1/users",
          {
            withCredentials: true,
          }
        );
        console.log(usersResponse);
        setUsers(usersResponse.data);

        // get friends //
        const friendsResponse = await axios.get(
          "http://localhost:5000/api/v1/friends",
          {
            withCredentials: true,
          }
        );
        console.log(friendsResponse);
        setFriends(friendsResponse.data);
      } catch (err: unknown) {
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
    fetchData();
  }, []);

  return (
    <div className="py-5">
      <h1 className="text-center text-2xl font-bold mb-5">Users</h1>
      {users?.map((user, index) => {
        return (
          <div key={index}>
            <h1>{user.username}</h1>
          </div>
        );
      })}
    </div>
  );
};
export default Users;
