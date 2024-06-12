import { Suspense, lazy } from "react";
import Loder from "../components/Loder";
const ForgotPassword = lazy(() => import("../components/ForgotPassword"));
const ForgotPasswordPage = () => {
  //
  return (
    <Suspense fallback={<Loder />}>
      <ForgotPassword />
    </Suspense>
  );
};

export default ForgotPasswordPage;
