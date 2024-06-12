import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import defaultImage from "../images/profile.jpg";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  deleteUser,
  getAuth,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { toast } from "react-toastify";
import { setAuth } from "../helper/session/authSession";
import { setUser } from "../Redux/slices/userSlice";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
//
const Settings = () => {
  //
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const user = useSelector((state) => state.setUser.user);
  const dispatch = useDispatch();
  const auth = getAuth();
  const navigate = useNavigate();
  const joinDate = new Date(user.creationTime).toLocaleDateString();

  //
  function handleName(e) {
    setName(e.target.value);
  }
  // handleEditProfile
  const handleEditProfile = (e) => {
    e.preventDefault();
    updateProfile(auth.currentUser, {
      displayName: name,
    })
      .then(() => {
        // Profile updated!
        // ...
        setName("");
        const user = {};
        user.uid = auth.currentUser.uid;
        user.displayName = auth.currentUser.displayName;
        user.phoneNumber = auth.currentUser.phoneNumber;
        user.email = auth.currentUser.email;
        user.createdAt = auth.currentUser.metadata.createdAt;
        user.creationTime = auth.currentUser.metadata.creationTime;
        user.lastSignInTime = auth.currentUser.metadata.lastSignInTime;
        user.lastLoginAt = auth.currentUser.metadata.lastLoginAt;
        setAuth(user);
        dispatch(setUser(user));
        toast.success("Update Successfully");
      })
      .catch((error) => {
        // An error occurred
        // ...

        toast.error("Something went wrong");
      });
  };
  // handleName

  //
  // handlCurrentPassword
  function handlCurrentPassword(e) {
    setCurrentPassword(e.target.value);
  }
  // handlNewPassword
  function handlNewPassword(e) {
    setNewPassword(e.target.value);
  }

  // handleProfileUPload
  // function handleProfileUPload(){
  //   console.log("profile upload");
  // }
  // handlePasswordChange
  function handlePasswordChange(e) {
    e.preventDefault();
    updatePassword(auth.currentUser, newPassword)
      .then(() => {
        // Update successful.
        toast.success("Change password successfully");
        setTimeout(() => {
          window.location.href = "/settings";
        }, 2000);
      })
      .catch((error) => {
        toast.error("Something went wrong");
        setTimeout(() => {
          window.location.href = "/settings";
        }, 2000);
      });
  }
  // handle account delete
  function handleDeleteAccount() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success confirmBtn",
        cancelButton: "btn btn-danger cancelBtn",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You want to delete your account",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteUser(auth.currentUser)
            .then(() => {
              // User deleted.
              localStorage.removeItem("user");
              dispatch(setUser(null));
              swalWithBootstrapButtons.fire({
                title: "Deleted!",
                text: "Your account has been deleted.",
                icon: "success",
              });
              navigate("/registration");
            })
            .catch((error) => {
              // An error ocurred
              // ...
              console.log(error);
              toast.error("Something went wrong");
            });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your account is safe)",
            icon: "error",
          });
        }
      });
  }
  //
  return (
    <section className="py-3">
      <div>
       <div className="px-2">
       <h1 className="font-semibold font-primary text-xl">Settings</h1>
       </div>
        <div className="w-20 h-20 rounded-full mx-auto mt-5 relative border-2 border-solid border-third overflow-hidden">
          <img
            className="h-full w-full object-cover"
            src={user.photoURL || defaultImage}
            alt="profile"
          />
        </div>
        <h3 className="mt-3 text-center capitalize font-semibold font-primary">
          {user?.name}
        </h3>
        <hr className="text-third my-3" />

        <Accordion className="shadow">
          <AccordionItem>
            <h2>
              <AccordionButton className="bg-third py-1 px-2">
                <Box
                  className="font-medium font-primary text-lg"
                  as="span"
                  flex="1"
                  textAlign="left"
                >
                  Personal info
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} className="px-2">
              <h6 className="font-primary font-normal text-lg text-black text-opacity-[0.4]">
                Name
              </h6>
              <h3 className="font-primary font-normal text-lg capitalize">
                {user?.name}
              </h3>
              <h6 className="font-primary font-normal text-lg text-black text-opacity-[0.4]">
                Email
              </h6>
              <h3 className="font-primary font-normal text-lg capitalize">
                {user?.email}
              </h3>
              <h6 className="font-primary font-normal text-lg text-black text-opacity-[0.4]">
                Join
              </h6>
              <h3 className="font-primary font-normal text-lg capitalize">
                {joinDate}
              </h3>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <h2>
              <AccordionButton className="bg-third py-1 px-2">
                <Box
                  className="font-medium font-primary text-lg"
                  as="span"
                  flex="1"
                  textAlign="left"
                >
                  Edit Profile
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} className="px-2">
              <form onSubmit={handleEditProfile}>
                <div>
                  <label
                    htmlFor="name"
                    className="text-black font-primary font-medium text-[16px] opacity-[0.5]"
                  >
                    Name
                  </label>
                  <input
                    required
                    defaultValue={user.displayName}
                    onChange={handleName}
                    type="text"
                    id={name}
                    // value={name}
                    name="name"
                    className="pl-2 py-1  w-full rounded-md border-[2px] border-solid border-third outline-none font-primary font-medium capitalize text-lg"
                  />
                </div>

                <div className="mt-[10px] text-center">
                  <button
                    type="submit"
                    className="w-full bg-third py-1 font-primary rounded-md text-black font-medium text-lg hover:bg-opacity-[0.5] transition duration-100"
                  >
                    Update
                  </button>
                </div>
              </form>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <h2>
              <AccordionButton className="bg-third py-1 px-2">
                <Box
                  className="font-medium font-primary text-lg"
                  as="span"
                  flex="1"
                  textAlign="left"
                >
                  Password & Security
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} className="px-2">
              <form onSubmit={handlePasswordChange}>
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="text-black font-primary font-medium text-[16px] opacity-[0.5]"
                  >
                    Current Password
                  </label>
                  <div className="relative">
                    {showCurrentPassword ? (
                      <FaRegEye
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="text-lg cursor-pointer absolute right-3 translate-y-[-50%] top-[50%]"
                      />
                    ) : (
                      <FaRegEyeSlash
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="text-lg cursor-pointer absolute right-3 translate-y-[-50%] top-[50%]"
                      />
                    )}
                    <input
                      required
                      pattern="\d{6}"
                      title="Please enter a 6-digit password"
                      onChange={handlCurrentPassword}
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      id="currentPassword"
                      className="mt-[5px] px-1 py-1 w-full rounded-md border-[2px] border-solid border-third outline-none font-primary font-normal capitalize"
                    />
                  </div>
                </div>

                <div className="mt-[10px]">
                  <label
                    htmlFor="newPassword"
                    className="text-black font-primary font-medium text-[16px] opacity-[0.5]"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    {showNewPassword ? (
                      <FaRegEye
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="text-lg cursor-pointer absolute right-3 translate-y-[-50%] top-[50%]"
                      />
                    ) : (
                      <FaRegEyeSlash
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="text-lg cursor-pointer absolute right-3 translate-y-[-50%] top-[50%]"
                      />
                    )}
                    <input
                      required
                      pattern="\d{6}"
                      title="Please enter a 6-digit password"
                      onChange={handlNewPassword}
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      id="newPassword"
                      className="px-1 py-1 w-full rounded-md border-[2px] border-solid border-third outline-none font-primary font-normal"
                    />
                  </div>
                </div>

                <div className="mt-[10px] text-center">
                  <button
                    type="submit"
                    className="w-full bg-third py-1  font-primary rounded-md text-lg hover:bg-opacity-[0.5]"
                  >
                    Change
                  </button>
                </div>
              </form>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <h2>
              <AccordionButton className="bg-third py-1 px-2">
                <Box
                  className="font-medium font-primary text-lg"
                  as="span"
                  flex="1"
                  textAlign="left"
                >
                  Help & Support
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} className="px-2 py-3">
              <ul>
                <li
                  onClick={() => navigate("/help")}
                  className="font-primary cursor-pointer text-black hover:text-black hover:text-opacity-[0.5] transition duration-100"
                >
                  Tearm & Condition
                </li>
              
              </ul>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <h2>
              <AccordionButton className="bg-third py-1 px-2">
                <Box
                  className="font-medium font-primary text-lg"
                  as="span"
                  flex="1"
                  textAlign="left"
                >
                  Notification
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} className="px-2 py-3">
            <Link to={"/notification"}>Notification</Link>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <h2>
              <AccordionButton className="bg-third py-1 px-2">
                <Box
                  className="font-medium font-primary text-lg"
                  as="span"
                  flex="1"
                  textAlign="left"
                >
                  Delete Account
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} className="px-2 py-3">
              <ul>
                <li
                  onClick={handleDeleteAccount}
                  className="font-primary cursor-pointer text-black hover:text-black hover:text-opacity-[0.5] transition duration-100"
                >
                  Delete account
                </li>
              </ul>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default Settings;