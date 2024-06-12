import { Suspense, lazy } from "react";
import Loder from "../components/Loder";
import Settings from "../components/Settings";
const SettingLayOut = lazy(() => import("../layout/MainLayOut"));
const SettingPage = () => {
  //
  return (
    <Suspense fallback={<Loder />}>
      <SettingLayOut>
        <Settings />
      </SettingLayOut>
    </Suspense>
  );
};

export default SettingPage;
