import { getAuth, updatePassword } from "firebase/auth";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";
import { IoChatbubblesOutline } from "react-icons/io5";
import forgotPasswordAnimation from "../animation/forgotPassword.json";
import Lottie from "lottie-react";
import { FaArrowLeft } from "react-icons/fa6";
import Footer from "./Footer";
//
const ForgotPassword = () => {
  //
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  //
  // handleNewPassword
  function handleNewPassword(e) {
    setNewPassword(e.target.value);
  }
  // handle confirmPassword

  // handleChangPassword
  function handlePasswordChange(e) {
    e.preventDefault();
    setBtnLoading(true);
    updatePassword(auth.currentUser, newPassword)
      .then(() => {
        setBtnLoading(false);
        toast.success("Change successfully");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch((error) => {
        setBtnLoading(false);
        toast.error("Something went wrong");
      });
  }
  //
  return (
    <section>
      <div className="container mx-auto mb-4">
        <div className="md:flex md:items-center mb-4">
          <div className="md:w-[50%] flex justify-center w-full">
            <Lottie animationData={forgotPasswordAnimation} />
          </div>
          <div className="px-4 md:w-[50%] md:h-screen md:flex md:justify-center md:items-center">
            <div>
              <div className="text-center mt-4">
                <FaArrowLeft className="inline-block" onClick={() => navigate("/login")} />
              </div>

              <h3 className="font-primary font-semibold text-[20px] text-black mt-6 text-center">
                Forgot your password ?
              </h3>
              <form onSubmit={handlePasswordChange} className="mt-5">
                <div className="mt-[10px]">
                  <label
                    htmlFor="newPassword"
                    className="text-black font-primary font-medium"
                  >
                    New password
                  </label>
                  <div className="relative mt-[10px]">
                    {showNewPassword ? (
                      <FaRegEye
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="text-lg cursor-pointer absolute right-6 translate-y-[-50%] top-[50%]"
                      />
                    ) : (
                      <FaRegEyeSlash
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="text-lg cursor-pointer absolute	right-6 translate-y-[-50%] top-[50%]"
                      />
                    )}
                    <input
                      required
                      pattern="\d{6}"
                      title="Please enter a 6-digit password"
                      onChange={handleNewPassword}
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      id="newPassword"
                      className="pl-2 py-2  w-full rounded-md border-[2px] border-solid border-third outline-none font-primary font-medium"
                      placeholder="Your new password"
                    />
                  </div>
                </div>

                <div className="mt-[10px] text-center">
                  {btnLoading ? (
                    <button className="flex justify-center items-center w-full bg-third rounded-md py-3">
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
                      Change password
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default ForgotPassword;
