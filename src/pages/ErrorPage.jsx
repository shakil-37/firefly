import { Suspense, lazy } from "react";
import Loder from "../components/Loder";
const Error = lazy(() => import("../components/Errorpage"));
//
const ErrorPage = () => {
  return (
    <Suspense fallback={<Loder />}>
      <Error />
    </Suspense>
  );
};

export default ErrorPage;
