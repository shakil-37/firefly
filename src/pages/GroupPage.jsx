import { Suspense, lazy } from "react";
import Loder from "../components/Loder";
import Group from "../components/Group";
const GroupLayOut = lazy(() => import("../layout/MainLayOut"));
//
const GroupPage = () => {
  //
  return (
    <Suspense fallback={<Loder />}>
      <GroupLayOut>
        <Group />
      </GroupLayOut>
    </Suspense>
  );
};

export default GroupPage;
