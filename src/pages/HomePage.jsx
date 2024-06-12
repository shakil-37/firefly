import { Suspense, lazy } from "react";
import Loder from "../components/Loder";
import Home from "../components/Home";
const HomeLayOut = lazy(() => import("../layout/MainLayOut"));
const HomePage = () => {
  //
  return (
    <Suspense fallback={<Loder />}>
      <HomeLayOut>
        <Home />
      </HomeLayOut>
    </Suspense>
  );
};

export default HomePage;
