import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import errorAnimation from "../animation/notFoundAnimation"
const Errorpage = () => {
  //
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  //
  useEffect(() => {
    if (!localStorage.getItem("isLoaded")) {
      localStorage.setItem("isLoaded", true);
      window.location.reload();
    }
  }, []);

  //
  return (
    <section className="flex justify-center items-center h-screen">
       <Lottie animationData={errorAnimation} />
    </section>
  );
};

export default Errorpage;
