import { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaRegEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { ThreeDots } from "react-loader-spinner";
import { toast } from "react-toastify";
import { GoogleAuthProvider } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../Redux/slices/userSlice";
import { TbMessageHeart } from "react-icons/tb";
import { FaFacebook } from "react-icons/fa";
import registrationAnimation from "../animation/registration.json";
import Lottie from "lottie-react";
import { setAuth } from "../helper/session/authSession";
import Footer from "./Footer";
//
const Registration = () => {
  const [fullname, setfullname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [age, setAge] = useState("");
  const [showhidepassword, setshowhidepassword] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const auth = getAuth();
  const db = getDatabase();
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const dispatch = useDispatch();
  // input value take function start
  const handlefullname = (e) => {
    setfullname(e.target.value);
  };
  //
  const handelemail = (e) => {
    setemail(e.target.value);
  };
  //
  function handleAge(e) {
    setAge(e.target.value);
  }
  //
  const handlepassword = (e) => {
    setpassword(e.target.value);
  };
  //
  // input value take function end
  // showhide password function start
  const handleshowhidepassword = () => {
    setshowhidepassword(!showhidepassword);
  };
  // showhide password function end

  // user registration
  const registration = (event) => {
    event.preventDefault();
    setBtnLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        updateProfile(auth.currentUser, {
          displayName: fullname,
        })
          .then(() => {
            const authUser = userCredential.user;
            const user = {};
            user.uid = authUser.uid;
            user.phoneNumber = authUser.phoneNumber;
            user.name = authUser.providerData[0].displayName;
            user.email = authUser.providerData[0].email;
            user.photoURL = authUser.providerData[0].photoURL;
            user.createdAt = authUser.metadata.createdAt;
            user.creationTime = authUser.metadata.creationTime;
            user.lastLoginAt = authUser.metadata.lastLoginAt;
            user.lastSignInTime = authUser.metadata.lastSignInTime;
            set(ref(db, "users/" + user.uid), user);
            setBtnLoading(false);
            toast.success("Registration successfully");
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          })
          .catch((error) => {
            //
            setBtnLoading(false);
            toast.error("Something went wrong");
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/email-already-in-use") {
          setBtnLoading(false);
          toast.error("This email already exits");
        } else {
          setBtnLoading(false);
          toast.error("Something went wrong");
        }
      });
  };

  // handle authentication  with facebook
  // async function facebookAuth() {
  //   console.log("facebook");
  // }
  // handle authentication with google
  async function googleAuth() {
    await signInWithPopup(auth, provider)
      .then((res) => {
        const user = {};
        user.uid = res.user.uid;
        user.phoneNumber = res.user.phoneNumber;
        user.name = res.user.providerData[0].displayName;
        user.email = res.user.providerData[0].email;
        user.photoURL = res.user.providerData[0].photoURL;
        user.createdAt = res.user.metadata.createdAt;
        user.lastLoginAt = res.user.metadata.lastLoginAt;
        user.lastSignInTime = res.user.metadata.lastSignInTime;
        user.creationTime = res.user.metadata.creationTime;
        set(ref(db, "users/" + user.uid), user).then(() => {
          setAuth(user);
          dispatch(setUser(user));
          window.location.href = "/";
        });
      })
      .catch((error) => {
        toast.error("Something went wrong");
      });
  }
  //
  return (
    <section>
      <div className="container mx-auto mb-2">
        <div className="md:flex">
          <div className="md:w-[50%] flex justify-center w-full">
            <Lottie animationData={registrationAnimation}/>
          </div>
          <div className="px-4 md:w-[50%] md:h-screen md:flex md:justify-center md:items-center">
            <div>
              <h3 className="font-primary font-semibold text-[20px] text-black text-center">
                Register Account
              </h3>
              <h4 className="text-[20px] text-black font-primary mt-2 font-medium text-center">
                Lets join with account
              </h4>
              <form onSubmit={registration} className="mt-5">
                <div className="mt-5">
                  <label
                    htmlFor="fullname"
                    className="text-black font-primary font-medium"
                  >
                    Full Name
                  </label>
                  <input
                    required
                    value={fullname}
                    onChange={handlefullname}
                    type="text"
                    name="fullname"
                    id="fullname"
                    className="pl-2 py-2  w-full rounded-md border-[2px] border-solid border-third outline-none font-primary font-medium"
                    placeholder="Your full name"
                  />
                </div>

                <div className="mt-[10px]">
                  <label
                    htmlFor="email"
                    className="text-black font-primary font-medium"
                  >
                    Email
                  </label>
                  <input
                    required
                    value={email}
                    onChange={handelemail}
                    type="email"
                    name="email"
                    id="email"
                    className="pl-2 py-2  w-full rounded-md border-[2px] border-solid border-third outline-none font-primary font-medium"
                    placeholder="Your email"
                  />
                </div>

                <div className="mt-[10px]">
                  <label
                    htmlFor="age"
                    className="text-black font-primary font-medium"
                  >
                    Age
                  </label>
                  <input
                    min={18}
                    required
                    value={age}
                    onChange={handleAge}
                    type="number"
                    name="age"
                    id="age"
                    className="pl-2 py-2  w-full rounded-md border-[2px] border-solid border-third outline-none font-primary font-medium"
                    placeholder="Your age"
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
                    {showhidepassword ? (
                      <FaRegEye
                        onClick={handleshowhidepassword}
                        className="text-lg cursor-pointer absolute right-6 top-[50%] translate-y-[-50%]"
                      />
                    ) : (
                      <FaRegEyeSlash
                        onClick={handleshowhidepassword}
                        className="text-lg cursor-pointer absolute	right-6 translate-y-[-50%] top-[50%]"
                      />
                    )}
                    <input
                      pattern="\d{6}"
                      title="Please enter a 6-digit password"
                      required
                      value={password}
                      onChange={handlepassword}
                      type={showhidepassword ? "text" : "password"}
                      name="password"
                      id="password"
                      className="pl-2 py-2  w-full rounded-md border-[2px] border-solid border-third outline-none font-primary font-medium"
                      placeholder="Your password"
                    />
                  </div>
                </div>

                <p className="text-center mt-3 font-primary font-normal">
                  By registering you agree to the Firefly
                  <span
                    onClick={() => navigate("/help")}
                    className="ml-3 font-medium text-first font-primary transition duration-100 hover:bg-opacity-[0.8] cursor-pointer"
                  >
                    Terms of Use
                  </span>
                </p>
                <div className="mt-[10px] text-center">
                  {btnLoading ? (
                    <button className="w-full py-3 bg-third font-primary rounded-md flex justify-center">
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
                      Creat an account
                    </button>
                  )}
                </div>
              </form>
              <h4 className="relative text-center mt-[10px] font-primary text-lg font-semibold text-black after:content-[''] after:h-[2px] after:w-[30%] after:bg-third after:top-[10px] after:right-0 after:absolute before:content-[''] before:h-[2px] before:w-[30%] before:bg-third before:top-[10px] before:left-0 before:absolute">
                Sign in using
              </h4>
              <div className="flex gap-x-3 mt-[10px]">
                <div className="bg-third rounded-md w-full h-14 flex justify-center items-center">
                  <FcGoogle
                    title="google"
                    onClick={googleAuth}
                    className="text-3xl cursor-pointer"
                  />
                </div>
                <div className="bg-third rounded-md w-full h-14 flex justify-center items-center">
                  <FaFacebook
                    title="facebook"
                    className="text-3xl  text-first"
                  />
                </div>
              </div>
              <p className="text-center mt-[10px] font-primary text-black">
                I have already an account ?
                <Link
                  to={"/login"}
                  className="ml-4 font-medium text-black font-primary underline transition duration-100 hover:text-first"
                >
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default Registration;
