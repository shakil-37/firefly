import { useNavigate } from "react-router-dom";
import wellcomeChatting from "../animation/wellcomePageChatting.json";
import Lottie from "lottie-react";
import Footer from "./Footer";
import WellcomeHeading from "./WellcomeHeading";
import WellcomeSlider from "./WellcomeSlider";
// import Test from "./Test";
//
const Wellcome = () => {
  //
  const navigate = useNavigate();
  //
  return (
    <section className="pt-5">
      <div className="container mx-auto">
        <div className="flex justify-end gap-x-3 px-3 sm:w-full">
          <button
            onClick={() => navigate("/registration")}
            className="px-2 py-1 sm:px-2 sm:py-2 md:px-3 md:py-0 rounded-lg font-primary font-medium sm:font-medium text-base md:text-md bg-first text-white transition duration-100 hover:bg-opacity-[0.8]"
          >
            Get start
          </button>
          <button
            onClick={() => navigate("/help")}
            className="px-2 py-1 sm:px-2 sm:py-2 md:px-4 md:py-4 rounded-lg font-primary font-medium sm:font-medium text-base md:text-md bg-third transition duration-100 hover:bg-opacity-[0.8]"
          >
            About us
          </button>
        </div>
        <div className="px-3 my-20 sm:my-20 text-center font-bold sm:text-3xl md:text-5xl text-3xl  font-primary text-first">
          <WellcomeHeading />
        </div>
        <div className="block px-3 lg:flex md:block sm:px-2">
          <div className="lg:w-[50%] md:w-[100%] flex justify-center w-full">
            <div className="w-full">
              <WellcomeSlider />
            </div>
          </div>
          <div className="lg:w-[50%] md:w-[100%] md:h-screen md:flex md:justify-center md:items-center lg:block">
            <Lottie animationData={wellcomeChatting} />
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default Wellcome;
