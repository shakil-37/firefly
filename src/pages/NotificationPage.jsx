import { Suspense, lazy } from "react";
import Loder from "../components/Loder";
import Notification from "../components/Notification";
const NotificationLayOut = lazy(() => import("../layout/MainLayOut"));
const NotificationPage = () => {
  return (
    <Suspense fallback={<Loder />}>
      <NotificationLayOut>
        <Notification />
      </NotificationLayOut>
    </Suspense>
  );
};

export default NotificationPage;
