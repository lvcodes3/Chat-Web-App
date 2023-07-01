// Dependencies //
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
// Context //
import { AuthContext } from "../helpers/AuthContext";
// React-Icons //
import { FaSpinner } from "react-icons/fa";

interface FormDataTypes {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  picture: string;
}

interface ImageLoadingTypes {
  image1: boolean;
  image2: boolean;
  image3: boolean;
}

interface ErrorResponse {
  message: string;
}

const Register = () => {
  const { setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormDataTypes>({
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    picture: "",
  });
  const [imgsLoading, setImgsLoading] = useState<ImageLoadingTypes>({
    image1: true,
    image2: true,
    image3: true,
  });
  const [avatarLinks, setAvatarLinks] = useState<string[]>([]);
  const [selectedAvatarIdx, setSelectedAvatarIdx] = useState<number>(-1);

  useEffect(() => {
    generateRandomAvatarLinks();
  }, []);

  const generateRandomAvatarLinks = () => {
    const links: string[] = [];

    for (let i = 0; i < 3; i++) {
      const chars: string =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let randomChars: string = "";
      const length: number = 29;
      for (let j = 0; j < length; j++) {
        const randomIdx: number = Math.floor(Math.random() * chars.length);
        const randomChar: string = chars[randomIdx];
        randomChars += randomChar;
      }
      links.push(`https://robohash.org/${randomChars}`);
    }

    setAvatarLinks(links);
  };

  const validateFormData = () => {
    let errorCount: number = 0;

    // username //
    if (formData.username.length < 3 || formData.username.length > 15) {
      toast.error("Your username must be between 3 and 15 characters.");
      errorCount++;
    }

    // email //
    if (formData.email.length === 0) {
      toast.error("Your email is required.");
      errorCount++;
    } else if (formData.email.length > 100) {
      toast.error("Your email can not exceed 100 characters.");
      errorCount++;
    }

    // password //
    if (formData.password.length < 4 || formData.password.length > 20) {
      toast.error("Your password must be between 4 and 20 characters.");
      errorCount++;
    }

    // password confirmation //
    if (formData.passwordConfirmation.length === 0) {
      toast.error("Your password confirmation is required.");
      errorCount++;
    } else if (formData.passwordConfirmation !== formData.password) {
      toast.error("Your password confirmation must match your password.");
      errorCount++;
    }

    // picture //
    if (formData.picture.length === 0) {
      toast.error("You must select an avatar.");
      errorCount++;
    } else if (formData.picture.length > 50) {
      toast.error("Error with image avatar link.");
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
        const registerData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          picture: formData.picture,
        };

        // submit form data //
        const response = await axios.post(
          "http://localhost:5000/api/v1/users/register",
          registerData,
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

        // navigate to the home page //
        navigate("/");
      } catch (err: unknown) {
        // Axios Error
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
            console.log(
              "No response recieved. Please check your internet connection."
            );
          }
          // axios error has a message
          else {
            console.log("Error", axiosError.message);
            console.log("An error occurred. Please try again.");
          }
        }
        // Unknown Error
        else {
          console.log("Error", err);
          console.log("An error occurred. Please try again.");
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
        <h1 className="text-center text-xl block mb-2 font-bold">Register</h1>

        <label htmlFor="username" className="block mb-2 font-bold">
          Username:
        </label>
        <input
          id="username"
          type="text"
          className="w-full p-2 mb-4 border-2 border-black rounded-md"
          autoComplete="off"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              username: e.target.value,
            }));
          }}
        />

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

        <label htmlFor="passwordConfirmation" className="block mb-2 font-bold">
          Password Confirmation:
        </label>
        <input
          id="passwordConfirmation"
          type="password"
          className="w-full p-2 mb-4 border-2 border-black rounded-md"
          autoComplete="off"
          placeholder="Password"
          value={formData.passwordConfirmation}
          onChange={(e) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              passwordConfirmation: e.target.value,
            }));
          }}
        />

        <div className="mb-4">
          <p className="block mb-2 font-bold">Select an Avatar:</p>
          <div className="flex justify-center">
            {/* First Image */}
            {imgsLoading.image1 && (
              <div className="w-1/3 flex justify-center items-center m-1">
                <FaSpinner
                  style={{
                    fontSize: "2rem",
                    animation: "spin 1.5s linear infinite",
                  }}
                />
                <style>
                  {`
                    @keyframes spin {
                      0% {
                        transform: rotate(0deg);
                      }
                      100% {
                        transform: rotate(360deg);
                      }
                    }
                  `}
                </style>
              </div>
            )}
            <img
              className={`w-1/3 border-2 ${
                selectedAvatarIdx === 0
                  ? "border-green-500"
                  : imgsLoading.image1
                  ? "hidden"
                  : "border-black"
              } rounded-md cursor-pointer m-1`}
              src={avatarLinks[0]}
              alt="Avatar Option 1"
              onLoad={() => {
                setImgsLoading((prevImgsLoading) => ({
                  ...prevImgsLoading,
                  image1: false,
                }));
              }}
              onClick={() => {
                setSelectedAvatarIdx(0);
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  picture: avatarLinks[0],
                }));
              }}
            />

            {/* Second Image */}
            {imgsLoading.image2 && (
              <div className="w-1/3 flex justify-center items-center m-1">
                <FaSpinner
                  style={{
                    fontSize: "2rem",
                    animation: "spin 1.5s linear infinite",
                  }}
                />
                <style>
                  {`
                    @keyframes spin {
                      0% {
                        transform: rotate(0deg);
                      }
                      100% {
                        transform: rotate(360deg);
                      }
                    }
                  `}
                </style>
              </div>
            )}
            <img
              className={`w-1/3 border-2 ${
                selectedAvatarIdx === 1
                  ? "border-green-500"
                  : imgsLoading.image2
                  ? "hidden"
                  : "border-black"
              } rounded-md cursor-pointer m-1`}
              src={avatarLinks[1]}
              alt="Avatar Option 2"
              onLoad={() => {
                setImgsLoading((prevImgsLoading) => ({
                  ...prevImgsLoading,
                  image2: false,
                }));
              }}
              onClick={() => {
                setSelectedAvatarIdx(1);
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  picture: avatarLinks[1],
                }));
              }}
            />

            {/* Third Image */}
            {imgsLoading.image3 && (
              <div className="w-1/3 flex justify-center items-center m-1">
                <FaSpinner
                  style={{
                    fontSize: "2rem",
                    animation: "spin 1.5s linear infinite",
                  }}
                />
                <style>
                  {`
                    @keyframes spin {
                      0% {
                        transform: rotate(0deg);
                      }
                      100% {
                        transform: rotate(360deg);
                      }
                    }
                  `}
                </style>
              </div>
            )}
            <img
              className={`w-1/3 border-2 ${
                selectedAvatarIdx === 2
                  ? "border-green-500"
                  : imgsLoading.image3
                  ? "hidden"
                  : "border-black"
              } rounded-md cursor-pointer m-1`}
              src={avatarLinks[2]}
              alt="Avatar Option 3"
              onLoad={() => {
                setImgsLoading((prevImgsLoading) => ({
                  ...prevImgsLoading,
                  image3: false,
                }));
              }}
              onClick={() => {
                setSelectedAvatarIdx(2);
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  picture: avatarLinks[2],
                }));
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full p-2 text-white bg-black rounded-md"
        >
          Register
        </button>
      </form>
    </div>
  );
};
export default Register;
