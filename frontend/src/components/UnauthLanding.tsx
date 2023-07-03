// Images //
import bgImage from "../assets/bg.jpg";

const Landing = () => {
  return (
    <div
      className="py-5 bg-cover bg-center bg-no-repeat h-screen"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <h1 className="text-center text-2xl font-bold mb-5">
        Welcome to the Chat Web App!
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
export default Landing;
