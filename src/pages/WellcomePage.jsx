import { Suspense, lazy } from "react";
import Loder from "../components/Loder";
const Wellcome = lazy(() => import("../components/Wellcome"));
// 
const WellcomePage = () => {
  return (
    <Suspense fallback={<Loder />}>
      <Wellcome />
    </Suspense>
  );
};

export default WellcomePage;
