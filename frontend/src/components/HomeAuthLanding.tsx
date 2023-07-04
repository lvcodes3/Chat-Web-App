// Dependencies //
import { useContext } from "react";
// Context //
import { AuthContext } from "../helpers/AuthContext";

const HomeAuthLanding = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1 className="text-center text-2xl font-bold mb-5">
        Hello, {user.username}!
      </h1>
      <div className="flex justify-around align-center">
        <div className="w-1/2">
          <h1 className="text-center text-xl font-bold">
            Make New Friends & Chat with them!
          </h1>
        </div>
        <div className="w-1/2">
          <h1 className="text-center text-xl font-bold">
            Socialize and have fun!
          </h1>
        </div>
      </div>
    </div>
  );
};
export default HomeAuthLanding;
