import { Suspense, lazy } from "react";
import Loder from "../components/Loder";
import Contact from "../components/Contact";
const ContactLayOut = lazy(() => import("../layout/MainLayOut"));
//
const ContactPage = () => {
  //
  return (
    <Suspense fallback={<Loder />}>
      <ContactLayOut>
        <Contact />
      </ContactLayOut>
    </Suspense>
  );
};

export default ContactPage;
