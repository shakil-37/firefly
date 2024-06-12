import { Route, Routes } from "react-router-dom";
import Errorpage from "./components/Errorpage";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import WellcomePage from "./pages/WellcomePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import HelpPage from "./pages/HelpPage";
import { getAuth } from "./helper/session/authSession";
import ProfilePage from "./pages/ProfilePage";
import MessagePage from "./pages/MessagePage";
import GroupPage from "./pages/GroupPage";
import NotificationPage from "./pages/NotificationPage";
import SettingPage from "./pages/SettingPage";
import EditProfilePage from "./pages/EditProfilePage";
import ContactPage from "./pages/ContactPage";
// import LayoutTest from "./components/LayoutTest";
import Test from "./components/Test";
//
function App() {
  if (getAuth()) {
    return (
      <Routes>
        {/* <Route path="/test" element={<Test />} /> */}
        {/* <Route path="/layout-test" element={<LayoutTest />} /> */}
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/message" element={<MessagePage />} />
        <Route path="/group" element={<GroupPage />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/profile-edit" element={<EditProfilePage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="*" element={<Errorpage />} />
        <Route path="/login" element={<Errorpage />} />
      </Routes>
    );
  } else {
    return (
      <Routes>
        <Route path="/test" element={<Test />} />
        <Route path="/" element={<WellcomePage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/support" element={<HelpPage />} />
        <Route path="*" element={<Errorpage />} />
        <Route path="/help" element={<HelpPage />} />
      </Routes>
    );
  }
  //
}

export default App;
//
