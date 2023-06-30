// Dependencies //
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

interface FormDataTypes {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  picture: string;
}

interface FormErrorTypes {
  usernameError: string;
  emailError: string;
  passwordError: string;
  passwordConfirmationError: string;
  pictureError: string;
}

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormDataTypes>({
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    picture: "",
  });
  const [registerError, setRegisterError] = useState<string>("");
  const [formError, setFormError] = useState<FormErrorTypes>({
    usernameError: "",
    emailError: "",
    passwordError: "",
    passwordConfirmationError: "",
    pictureError: "",
  });
  const [avatarLinks, setAvatarLinks] = useState<string[]>([]);
  const [selectedAvatarIdx, setSelectedAvatarIdx] = useState<
    number | undefined
  >(undefined);

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
    let errorCount = 0;

    // username //
    if (formData.username.length < 3 || formData.username.length > 15) {
      setFormError((prevFormError) => ({
        ...prevFormError,
        usernameError: "Your username must be between 3 and 15 characters.",
      }));
      errorCount++;
    } else {
      if (formError.usernameError !== "") {
        setFormError((prevFormError) => ({
          ...prevFormError,
          usernameError: "",
        }));
      }
    }

    // email //
    if (formData.email.length === 0) {
      setFormError((prevFormError) => ({
        ...prevFormError,
        emailError: "Your email is required.",
      }));
      errorCount++;
    } else if (formData.email.length > 100) {
      setFormError((prevFormError) => ({
        ...prevFormError,
        emailError: "Your email can not exceed 100 characters.",
      }));
      errorCount++;
    } else {
      if (formError.emailError !== "") {
        setFormError((prevFormError) => ({
          ...prevFormError,
          emailError: "",
        }));
      }
    }

    // password //
    if (formData.password.length < 4 || formData.password.length > 20) {
      setFormError((prevFormError) => ({
        ...prevFormError,
        passwordError: "Your password must be between 4 and 20 characters.",
      }));
      errorCount++;
    } else {
      if (formError.passwordError !== "") {
        setFormError((prevFormError) => ({
          ...prevFormError,
          passwordError: "",
        }));
      }
    }

    // password confirmation //
    if (formData.passwordConfirmation.length === 0) {
      setFormError((prevFormError) => ({
        ...prevFormError,
        passwordConfirmationError: "Your password confirmation is required.",
      }));
      errorCount++;
    } else if (formData.passwordConfirmation !== formData.password) {
      setFormError((prevFormError) => ({
        ...prevFormError,
        passwordConfirmationError:
          "Your password confirmation must match your password.",
      }));
      errorCount++;
    } else {
      if (formError.passwordConfirmationError !== "") {
        setFormError((prevFormError) => ({
          ...prevFormError,
          passwordConfirmationError: "",
        }));
      }
    }

    // picture //
    if (formData.picture.length === 0) {
      setFormError((prevFormError) => ({
        ...prevFormError,
        pictureError: "You must select an avatar.",
      }));
      errorCount++;
    } else if (formData.picture.length > 50) {
      setFormError((prevFormError) => ({
        ...prevFormError,
        pictureError: "Error with image avatar link.",
      }));
      errorCount++;
    } else {
      if (formError.pictureError !== "") {
        setFormError((prevFormError) => ({
          ...prevFormError,
          pictureError: "",
        }));
      }
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
        const data = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          picture: formData.picture,
        };
        const response = await axios.post(
          "http://localhost:5000/api/v1/users/register",
          data
        );
        console.log(response);

        // navigate to the home page //
        navigate("/");
      } catch (err: unknown) {
        type ErrorResponse = {
          message: string;
        };

        // Axios Error
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError<ErrorResponse>;

          // axios error has a response
          if (axiosError.response) {
            const errorResponse = axiosError.response.data as ErrorResponse;
            setRegisterError(errorResponse.message);
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

        {registerError && (
          <p className="text-center block mb-2 font-bold text-red-500">
            {registerError}
          </p>
        )}

        <label htmlFor="username" className="block mb-2 font-bold">
          Username:
        </label>
        <span className="text-red-500">{formError.usernameError}</span>
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
        <span className="text-red-500">{formError.emailError}</span>
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
        <span className="text-red-500">{formError.passwordError}</span>
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
        <span className="text-red-500">
          {formError.passwordConfirmationError}
        </span>
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
          <span className="text-red-500">{formError.pictureError}</span>
          <div className="flex justify-center">
            <img
              className={`w-1/3 border-2 ${
                selectedAvatarIdx === 0 ? "border-green-500" : "border-black"
              } rounded-md cursor-pointer m-1`}
              src={avatarLinks[0]}
              alt="Avatar Option 1"
              onClick={() => {
                setSelectedAvatarIdx(0);
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  picture: avatarLinks[0],
                }));
              }}
            />
            <img
              className={`w-1/3 border-2 ${
                selectedAvatarIdx === 1 ? "border-green-500" : "border-black"
              } rounded-md cursor-pointer m-1`}
              src={avatarLinks[1]}
              alt="Avatar Option 2"
              onClick={() => {
                setSelectedAvatarIdx(1);
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  picture: avatarLinks[1],
                }));
              }}
            />
            <img
              className={`w-1/3 border-2 ${
                selectedAvatarIdx === 2 ? "border-green-500" : "border-black"
              } rounded-md cursor-pointer m-1`}
              src={avatarLinks[2]}
              alt="Avatar Option 3"
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
