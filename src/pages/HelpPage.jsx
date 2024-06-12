import { Suspense, lazy } from "react";

import Loder from "../components/Loder";
const Help = lazy(() => import("../components/Help"));
const HelpPage = () => {
  return (
    <Suspense fallback={<Loder />}>
      <Help />
    </Suspense>
  );
};

export default HelpPage;
