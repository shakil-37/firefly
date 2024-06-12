import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";
import { setUser } from "../Redux/slices/userSlice";
import Lottie from "lottie-react";
import registrationAnimation from "../animation/registration.json";
import { setAuth } from "../helper/session/authSession";
import { TbMessageHeart } from "react-icons/tb";
import Footer from "./Footer";
//
const Login = () => {
  const [btnLoading, setBtnLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // input value take function start
  const handleemail = (e) => {
    setEmail(e.target.value);
  };
  //
  const handlepassword = (e) => {
    setPassword(e.target.value);
  };
  // input value take function end
  // passwordhideshow function start
  const hideshow = () => {
    setShowPassword(!showPassword);
  };
  // passwordshohide function end
  // login function start
  const handlelogin = (event) => {
    event.preventDefault();
    setBtnLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = {};
        const userData = userCredential.user;
        user.uid = userData.uid;
        user.phoneNumber = userData.phoneNumber;
        user.name = userData.providerData[0].displayName;
        user.email = userData.providerData[0].email;
        user.photoURL = userData.providerData[0].photoURL;
        user.createdAt = userData.metadata.createdAt;
        user.lastLoginAt = userData.metadata.lastLoginAt;
        user.lastSignInTime = userData.metadata.lastSignInTime;
        user.creationTime = userData.metadata.creationTime;
        setAuth(user);
        dispatch(setUser(user));
        setBtnLoading(false);
        toast.success("Login success");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode == "auth/invalid-login-credentials") {
          setBtnLoading(false);
          toast.error("Wrong Password");
        } else {
          setBtnLoading(false);
          toast.error("Something went wrong");
        }
      });
  };
  //
  return (
    <section>
      <div className="container mx-auto">
        <div className="md:flex md:items-center mb-4">
          <div className="md:w-[50%] flex justify-center w-full">
            <Lottie animationData={registrationAnimation} />
          </div>
          <div className="px-4 md:w-[50%] md:h-screen md:flex md:justify-center md:items-center">
            <div>
              <h3 className="font-primary font-semibold text-[20px] text-black text-center">
                Become a better exprience with me
              </h3>
              <h4 className="text-[20px] text-black font-primary mt-2 font-medium text-center">
                Login your account
              </h4>
              <form onSubmit={handlelogin} className="mt-5">
                <div className="mt-[10px]">
                  <label
                    htmlFor="email"
                    className="text-black font-primary font-medium"
                  >
                    Email
                  </label>
                  <input
                    required
                    onChange={handleemail}
                    type="email"
                    placeholder="Inter your email"
                    id="email"
                    name="email"
                    className="pl-2 py-2  w-full rounded-md border-[2px] border-solid border-third outline-none font-primary font-medium"
                  />
                </div>

                <div className="mt-[10px]">
                  <label
                    htmlFor="Password"
                    className="text-black font-primary font-medium"
                  >
                    Password
                  </label>
                  <div className="relative">
                    {showPassword ? (
                      <FaRegEye
                        onClick={hideshow}
                        className="text-lg cursor-pointer absolute right-6 translate-y-[-50%] top-[50%]"
                      />
                    ) : (
                      <FaRegEyeSlash
                        onClick={hideshow}
                        className="text-lg cursor-pointer absolute right-6 translate-y-[-50%] top-[50%]"
                      />
                    )}
                    <input
                      required
                      pattern="\d{6}"
                      title="Please enter a 6-digit password"
                      onChange={handlepassword}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      className="pl-2 py-2  w-full rounded-md border-[2px] border-solid border-third outline-none font-primary font-medium"
                      placeholder="Your password"
                    />
                  </div>
                </div>

                <div className="mt-[10px] text-center">
                  {btnLoading ? (
                    <button className="flex justify-center items-center w-full font-primary rounded-md bg-third py-3">
                      <ThreeDots
                        visible={true}
                        height="20"
                        width="80"
                        color="#00B876"
                        radius="9"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                      />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="w-full bg-first py-2 font-primary rounded-md text-white text-lg hover:bg-opacity-[0.8] transition duration-100"
                    >
                      Login
                    </button>
                  )}
                </div>
              </form>
              <p className="text-center mt-3 font-primary">
                Are you new for Firefly ?
                <Link
                  to={"/registration"}
                  className="ml-4 font-medium text-black font-primary underline transition duration-100 hover:text-first"
                >
                  Register
                </Link>
              </p>
              <h5 className="relative text-center mt-[10px] font-primary text-lg font-semibold text-black after:content-[''] after:h-[2px] after:w-[30%] after:bg-third after:top-[10px] after:right-0 after:absolute before:content-[''] before:h-[2px] before:w-[30%] before:bg-third before:top-[10px] before:left-0 before:absolute">
                Or
              </h5>
              <div className="mt-[10px] text-center">
                <Link
                  to={"/forgot-password"}
                  className="font-primary inline-block transition duration-100 hover:text-first"
                >
                  Forgot your password ?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </section>
  );
};

export default Login;
