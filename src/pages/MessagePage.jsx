import { Suspense, lazy } from "react";
import Loder from "../components/Loder";
import Messanger from "../components/Messanger";
const MessageLayOut = lazy(() => import("../layout/MainLayOut"));
const MessagePage = () => {
  return (
    <Suspense fallback={<Loder />}>
      <MessageLayOut>
        <Messanger />
      </MessageLayOut>
    </Suspense>
  );
};

export default MessagePage;
