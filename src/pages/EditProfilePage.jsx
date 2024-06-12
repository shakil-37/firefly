import { Suspense, lazy } from "react";
import Loder from "../components/Loder";
import EditProfile from "../components/EditProfile";
const EditProfileLayOut = lazy(() => import("../layout/MainLayOut"));
//
const EditProfilePage = () => {
  //
  return (
    <Suspense fallback={<Loder />}>
      <EditProfileLayOut>
        <EditProfile />
      </EditProfileLayOut>
    </Suspense>
  );
};

export default EditProfilePage;
