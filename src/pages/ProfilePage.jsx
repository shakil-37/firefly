import { Suspense, lazy } from "react";
import Loder from "../components/Loder";
import Profile from "../components/Profile";
const ProfileLayOut = lazy(() => import("../layout/MainLayOut"));
//
const ProfilePage = () => {
  //
  return (
    <Suspense fallback={<Loder />}>
      <ProfileLayOut>
        <Profile />
      </ProfileLayOut>
    </Suspense>
  );
};

export default ProfilePage;
