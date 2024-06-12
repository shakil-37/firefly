import React from "react";
import { RxCross2 } from "react-icons/rx";
import { TbMessageHeart } from "react-icons/tb";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaRegMessage } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import defaultImage from "../images/profile.jpg";
import { FaUserCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { RiProfileLine } from "react-icons/ri";
import { FaBarsStaggered } from "react-icons/fa6";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { MdGroups } from "react-icons/md";
import { MdPermContactCalendar } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../Redux/slices/userSlice";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TbPhoneCalling } from "react-icons/tb";
import { FiVideo } from "react-icons/fi";
import ProfileImage from "../components/ProfileImage";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { CiImageOn } from "react-icons/ci";
import { LuSticker } from "react-icons/lu";
import { IoMdThumbsUp } from "react-icons/io";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import { VscSend } from "react-icons/vsc";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref as sref,
} from "firebase/storage";
import { getDatabase, onValue, push, set, ref } from "firebase/database";
import { IoCallOutline } from "react-icons/io5";
//
const MainLayOut = (props) => {
  //
  const navigate = useNavigate();
  const [sideNav, setSideNav] = useState(false);
  const [avatarModal, setAvatarModal] = useState(false);
  const user = useSelector((state) => state.setUser.user);
  const active = useSelector((state) => state.active.active);
  const [notification, setNotification] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [messageValue, setMeassageValue] = useState("");
  const [imagePreview, setImagePreview] = useState(false);
  const [image, setImage] = useState(null);
  const [rawImage, setRawImage] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const dispatch = useDispatch();
  const db = getDatabase();
  const storage = getStorage();

  // console.log(msgs);
  // handle sidenav
  const handleSideNav = () => {
    setSideNav(!sideNav);
  };
  // handle profile
  const handleAvatar = () => {
    setAvatarModal(!avatarModal);
  };

  // handle logout
  const handleLogOut = () => {
    localStorage.removeItem("user");
    dispatch(setUser(null));
    navigate("/login");
  };
  // get  notification data
  useEffect(() => {
    const friendRequestList = [];
    onValue(ref(db, "request/"), (snapshot) => {
      snapshot.forEach((request) => {
        if (request.val().receverId == user.uid) {
          friendRequestList.push(request.val());
        }
      });
    });
    //
    const frindsDataRef = ref(db, "friends/");
    const friendsData = [];
    onValue(frindsDataRef, (snapshot) => {
      snapshot.forEach((friend) => {
        if (
          friend.val().senderId == user.uid ||
          user.uid == friend.val().senderId
        ) {
          friendsData.push(friend.val().receverId);
        } else if (
          friend.val().receverId == user.uid ||
          user.uid == friend.val().receverId
        ) {
          friendsData.push(friend.val().senderId);
        }
      });
    });
    const postsDataRef = ref(db, "posts/");
    const postsData = [];
    onValue(postsDataRef, (snapshot) => {
      snapshot.forEach((post) => {
        const postCreator = post.val().creatorId;
        friendsData.map((friend) => {
          if (friend.match(postCreator)) {
            postsData.push(post.val());
          }
        });
      });
    });
    //
    let notificationData = [];
    // Use concat method to combine the arrays
    notificationData = notificationData.concat(friendRequestList, postsData);
    setNotification(notificationData);
    //
  }, []);
  // handleEmojiValue
  function handleEmojiValue(e) {
    setMeassageValue((prev) => prev.concat(e.emoji));
  }
  // handle message value
  function handleMessageValue(e) {
    setMeassageValue(e.target.value);
  }
  // handleSendMessage
  function handleSendMessage() {
    if (messageValue.length > 0) {
      if (active.status == "Active") {
        set(push(ref(db, "singleMsg/")), {
          message: messageValue,
          msgSenderId: user.uid,
          msgSenderName: user.name,
          msgReceverId: active.id,
          msgReceverName: active.name,
          time: `${
            new Date().getHours() % 12 || 12
          }:${new Date().getMinutes()} ${
            new Date().getDate() >= 12 ? "Am" : "Pm"
          }/${new Date().getDate()}/${
            new Date().getMonth() + 1
          }/${new Date().getFullYear()}`,
        }).then(() => {
          setMeassageValue("");
          setShowEmoji(false);
          console.log("msg send succes");
        });
      }
      // console.log("send message");
    } else {
      setMeassageValue("");
      console.log("message jay nai");
    }
  }
  // handleMsgImgChange
  function handleMsgImgChange(e) {
    e.preventDefault();
    setRawImage(e);
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
    setImagePreview(true);
  }
  // handleRemoveMsgImage
  function handleRemoveMsgImage() {
    console.log("remove");
    setImage(null);
    setImagePreview(false);
  }
  // handleMsgImageSend
  function handleMsgImageSend() {
    if (image && rawImage) {
      const msgImageRef = sref(
        storage,
        "singlemsg/" + rawImage.target.files[0]?.name
      );
      const uploadTask = uploadBytesResumable(
        msgImageRef,
        rawImage.target.files[0]
      );
      //
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;
            // ...
            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            set(push(ref(db, "singleMsg/")), {
              img: downloadURL,
              msgSenderId: user.uid,
              msgSenderName: user.name,
              msgReceverId: active.id,
              msgReceverName: active.name,
              time: `${
                new Date().getHours() % 12 || 12
              }:${new Date().getMinutes()} ${
                new Date().getDate() >= 12 ? "Am" : "Pm"
              }/${new Date().getDate()}/ ${
                new Date().getMonth() + 1
              }/${new Date().getFullYear()}`,
            }).then(() => {
              setImagePreview(false);
            });
          });
        }
      );
    }
  }
  // get single message from db
  useEffect(() => {
    const singleMsgRef = ref(db, "singleMsg/");
    onValue(singleMsgRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (
          (item.val().msgSenderId == user.uid &&
            item.val().msgReceverId == active?.id) ||
          (item.val().msgReceverId == user.uid &&
            item.val().msgSenderId == active?.id)
        ) {
          list.push({ ...item.val(), id: item.key });
        }
      });
      setMsgs(list);
    });
  }, [active?.id]);
  // removeNotificationLength
  function removeNotificationLength() {
    console.log(notification);
  }
  //
  return (
    <section>
      <div className="flex flex-col relative lg:flex-row">
        <div className="py-4 px-4 sm:px-6 shadow flex flex-col-reverse items-center sm:flex-row lg:flex-col xl:flex-col 2xl:flex-col justify-between lg:py-4 xl:py-4 2xl:py-4 sm:py-4 md:py-4 md:flex-row">
          {sideNav && (
            <div className="sm:hidden md:hidden lg:hidden xl:hidden 2xl:hidden  w-full">
              <ul className="my-2">
                <li>
                  <NavLink
                    to="/contact"
                    className={({ isActive, isPending }) =>
                      isPending
                        ? "pending"
                        : isActive
                        ? "active bg-first opacity-[0.5] inline-block w-full rounded-sm font-semibold font-primary py-1 text-center text-white"
                        : "text-center py-1 bg-third inline-block w-full rounded-sm font-primary font-semibold"
                    }
                  >
                    Contact
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/message"
                    className={({ isActive, isPending }) =>
                      isPending
                        ? "pending"
                        : isActive
                        ? "active bg-first bg-opacity-[0.5] inline-block w-full rounded-sm font-semibold font-primary py-1 text-center text-white"
                        : "text-center py-1 bg-third inline-block w-full rounded-sm font-primary font-semibold"
                    }
                  >
                    Messanger
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/group"
                    className={({ isActive, isPending }) =>
                      isPending
                        ? "pending"
                        : isActive
                        ? "active bg-first bg-opacity-[0.5] inline-block w-full rounded-sm font-semibold font-primary py-1 text-center text-white"
                        : "text-center py-1 bg-third inline-block w-full rounded-sm font-primary font-semibold"
                    }
                  >
                    Group
                  </NavLink>
                </li>
              </ul>
              <hr />
              <ul className="text-center mt-2">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex justify-between items-center gap-x-2">
                    <div className="w-10 h-10 rounded-full border-solid border-third border-2 overflow-hidden">
                      <img src={user.photoURL || defaultImage} alt="profile" />
                    </div>
                    <div className="text-start">
                      <h5 className="font-primary capitalize font-medium text-lg">
                        sakil
                      </h5>
                      <p className="font-primary">sakildevmern@gmail.com</p>
                    </div>
                  </div>
                  <div className="relative">
                    <IoMdNotificationsOutline
                      onClick={() => navigate("/notification")}
                      className="text-2xl cursor-pointer"
                    />
                    <div className="absolute top-[-14px] left-[12px] h-5 w-5 rounded-full flex justify-center items-center bg-second">
                      <p className="text-white font-semibold">1</p>
                    </div>
                  </div>
                </div>
                <li>
                  <NavLink
                    to="/profile"
                    className={({ isActive, isPending }) =>
                      isPending
                        ? "pending"
                        : isActive
                        ? "active bg-first bg-opacity-[0.5] inline-block w-full rounded-sm font-semibold font-primary py-1 text-center text-white"
                        : "text-center py-1 bg-third inline-block w-full rounded-sm font-primary font-semibold"
                    }
                  >
                    Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/settings"
                    className={({ isActive, isPending }) =>
                      isPending
                        ? "pending"
                        : isActive
                        ? "active bg-first bg-opacity-[0.5] inline-block w-full rounded-sm font-semibold font-primary py-1 text-center text-white"
                        : "text-center py-1 bg-third inline-block w-full rounded-sm font-primary font-semibold"
                    }
                  >
                    Settings
                  </NavLink>
                </li>
                <li className="text-center mt-2">
                  <RiLogoutCircleRLine
                    onClick={handleLogOut}
                    className="inline-block text-xl cursor-pointer"
                  />
                </li>
              </ul>
            </div>
          )}
          <ul className="hidden sm:block md:block lg:block xl:block 2xl:block">
            <li className="flex justify-center items-center">
              <TbMessageHeart
                onClick={() => navigate("/")}
                className="text-3xl text-first cursor-pointer"
              />
            </li>
          </ul>
          <ul className="hidden sm:flex sm:gap-x-2 md:flex items-center lg:block xl:block 2xl:block">
            <li className="flex justify-center items-center">
              <NavLink
                to="/profile"
                className={({ isActive, isPending }) =>
                  isPending
                    ? "pending"
                    : isActive
                    ? "active text-first bg-third py-3 px-3 rounded-md"
                    : "bg-third text-black text-opacity-[0.5] py-3 px-3 rounded-md"
                }
              >
                <FaUserCircle className="text-2xl" />
              </NavLink>
            </li>
            <li className="lg:mt-2 xl:mt-2 2xl:mt-2 flex justify-center items-center">
              <NavLink
                to="/message"
                className={({ isActive, isPending }) =>
                  isPending
                    ? "pending"
                    : isActive
                    ? "active text-first bg-third py-3 px-3 rounded-md"
                    : "bg-third text-black text-opacity-[0.5] py-3 px-3 rounded-md"
                }
              >
                <FaRegMessage className="text-2xl" />
              </NavLink>
            </li>
            <li className="lg:mt-2 xl:mt-2 2xl:mt-2 flex justify-center items-center">
              <NavLink
                to="/group"
                className={({ isActive, isPending }) =>
                  isPending
                    ? "pending"
                    : isActive
                    ? "active text-first bg-third py-3 px-3 rounded-md"
                    : "bg-third text-black text-opacity-[0.5] py-3 px-3 rounded-md"
                }
              >
                <MdGroups className="text-2xl" />
              </NavLink>
            </li>
            <li className="lg:mt-2 xl:mt-2 2xl:mt-2 flex justify-center items-center relative">
              {notification.length > 0 && (
                <div className="absolute top-0 right-0 h-5 w-5 text-center bg-second rounded-full text-white flex justify-center items-center">
                  <span>{notification.length}</span>
                </div>
              )}
              <NavLink
                onClick={removeNotificationLength}
                to="/notification"
                className={({ isActive, isPending }) =>
                  isPending
                    ? "pending"
                    : isActive
                    ? "active text-first bg-third py-3 px-3 rounded-md"
                    : "bg-third text-black text-opacity-[0.5] py-3 px-3 rounded-md"
                }
              >
                <IoMdNotificationsOutline className="text-2xl" />
              </NavLink>
            </li>
            <li className="lg:mt-2 xl:mt-2 2xl:mt-2 flex justify-center items-center">
              <NavLink
                to="/contact"
                className={({ isActive, isPending }) =>
                  isPending
                    ? "pending"
                    : isActive
                    ? "active text-first bg-third py-3 px-3 rounded-md"
                    : "bg-third text-black text-opacity-[0.5] py-3 px-3 rounded-md"
                }
              >
                <MdPermContactCalendar className="text-2xl" />
              </NavLink>
            </li>
          </ul>
          <ul className="hidden sm:flex lg:block xl:block 2xl:block sm:gap-2">
            <li className="lg:mt-2 xl:mt-2 2xl:mt-2 flex justify-center items-center relative">
              <div
                onClick={handleAvatar}
                className="border-2 border-third border-solid overflow-hidden h-[40px] w-[40px] rounded-full cursor-pointer relative"
              >
                <img
                  className="h-full w-full"
                  src={user.photoURL || defaultImage}
                  alt="profile"
                />
              </div>
              {avatarModal && (
                <div className="absolute sm:top-[50px] sm:right-[-16px] md:top-[50px] md:right-[-16px] lg:right-[-22px] lg:top-[-105px] xl:right-[-22px] xl:top-[-105px] 2xl:right-[-22px] 2xl:top-[-105px] bg-third py-1 transition duration-100 flex z-20 rounded-md">
                  <ul>
                    <li
                      onClick={() => navigate("/profile")}
                      className="flex justify-between items-center px-2 gap-x-2 hover:bg-white hover:transition hover:duration-100 cursor-pointer"
                    >
                      <p className="font-primary font-medium">Profile</p>
                      <RiProfileLine />
                    </li>
                    <li
                      onClick={() => navigate("/settings")}
                      className="my-1 flex justify-between items-center px-2 gap-x-2 hover:bg-white hover:transition hover:duration-100 cursor-pointer"
                    >
                      <p className="font-primary font-medium">Setting</p>
                      <IoSettingsOutline />
                    </li>
                    <li
                      onClick={handleLogOut}
                      className="my-1 flex justify-between items-center px-2 gap-x-[2px] hover:bg-white hover:transition hover:duration-100 cursor-pointer"
                    >
                      <p className="font-primary font-medium">Log out</p>
                      <RiLogoutCircleRLine />
                    </li>
                  </ul>
                </div>
              )}
            </li>
          </ul>
          <div className="block text-right sm:hidden md:hidden lg:hidden xl:hidden 2xl:hidden w-full bg-white">
            <div className="flex justify-between items-center">
              <TbMessageHeart
                onClick={() => navigate("/")}
                className="text-3xl text-first"
              />
              {sideNav ? (
                <FaBarsStaggered
                  className="inline-block text-xl"
                  onClick={handleSideNav}
                />
              ) : (
                <FaBars
                  className="inline-block text-xl"
                  onClick={handleSideNav}
                />
              )}
            </div>
          </div>
        </div>

        <div className="lg:max-w-[400px] sm:w-full md:w-full xl:max-w-[300px] 2xl:max-w-[300px]">
          {props?.children}
        </div>

        <div className="shadow-md relative w-full h-screen overflow-y-scroll bg-white hidden sm:hidden md:hidden lg:block xl:block 2xl:block">
          <div className="z-1 py-4 sticky top-0 left-0 w-full bg-third px-4 flex justify-between items-center">
            <div className="flex items-center gap-x-3">
              <div className="w-16 h-16 rounded-full bg-first overflow-hidden object-cover">
                <div className="h-full w-full">
                  {active ? (
                    <ProfileImage id={active.id} />
                  ) : (
                    <img src={defaultImage} />
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-primary capitalize text-lg font-semibold">
                  {active?.name}
                </h3>
                <h4 className="font-primary font-medium text-first">
                  {active?.status}
                </h4>
              </div>
              <div>
                <span>
                  <MdKeyboardArrowDown />
                </span>
              </div>
            </div>
            <div className="flex items-center gap-x-4">
              <div>
                <span>
                  <IoCallOutline className="text-2xl" />
                </span>
              </div>
              <div>
                <span>
                  <FiVideo className="text-2xl" />
                </span>
              </div>
            </div>
          </div>

          <div className="py-2 px-2">
            {msgs.map((item, i) => {
              return item.msgSenderId == user.uid ? (
                item.message ? (
                  <div key={i} className="flex justify-end">
                    <div className="my-3">
                      <div className="bg-third px-2 py-2 rounded-md">
                        <h3
                          title={item.time}
                          className="font-primary font-medium text-center"
                        >
                          {item.message}
                        </h3>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={i} className="mt-3 mb-3 text-right">
                    <div className="inline-block w-[200px] h-[200px]  rounded-lg overflow-hidden">
                      <img
                        title={item.time}
                        className="h-full w-full"
                        src={item?.img}
                        alt="image"
                      />
                    </div>
                  </div>
                )
              ) : item.message ? (
                <div key={i} className="flex justify-start">
                  <div>
                    <div className="bg-third px-2 py-2 rounded-md mb-3">
                      <h3
                        title={item.time}
                        className="font-primary font-medium text-center"
                      >
                        {item.message}
                      </h3>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={i} className="mt-3 mb-3 text-left">
                  <div className="inline-block w-[200px] h-[200px]  rounded-lg overflow-hidden">
                    <img
                      title={item.time}
                      className="h-full w-full"
                      src={item?.img}
                      alt="image"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/*  */}
          {imagePreview && (
            <div className="sticky bottom-0 left-0">
              <div className="max-h-[150px] px-3 py-3 flex gap-x-1 bg-third">
                {image && (
                  <div
                    className="overflow-hidden w-[25%]
              rounded-lg relative object-cover"
                  >
                    <div
                      onClick={handleRemoveMsgImage}
                      className="z-1 absolute top-2 right-2 h-8 w-8 cursor-pointer rounded-full bg-third flex justify-center items-center transition duration-100 hover:bg-white hover:border-2"
                    >
                      <RxCross2 />
                    </div>
                    <img className="h-full w-full" src={image} alt="image" />
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="text-center">
            {showEmoji && (
              <div>
                <EmojiPicker
                  reactionsDefaultOpen={true}
                  onEmojiClick={(e) => handleEmojiValue(e)}
                  width={"100%"}
                  height={"400px"}
                />
              </div>
            )}
          </div>
          <div className="sticky z-1 px-4 py-2 bg-white left-0 bottom-0 w-full flex items-center justify-between">
            <div className="flex items-center justify-between min-w-[10%]">
              <div>
                <span className="text-2xl">
                  <MdOutlineKeyboardVoice />
                </span>
              </div>
              <div>
                <label className="cursor-pointer text-2xl">
                  <input
                    // name="messageValue"
                    // multiple={true}
                    accept=".png, .jpg, .jpeg .svg"
                    onChange={(e) => handleMsgImgChange(e)}
                    className="hidden"
                    type="file"
                  />
                  <CiImageOn />
                </label>
              </div>
              <div>
                <span className="text-2xl">
                  <LuSticker />
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between min-w-[80%]">
              <div className="relative w-full">
                <label>
                  <div className="relative">
                    <input
                      name="messageValue"
                      id="messageValue"
                      value={messageValue}
                      onChange={handleMessageValue}
                      className="border-2 w-full h-full pl-3 py-2 outline-none rounded-xl"
                      type="text"
                      placeholder="Aa"
                    />
                    <span
                      onClick={() => setShowEmoji(!showEmoji)}
                      className="z-1 absolute inline-block top-[50%] right-3 text-2xl translate-y-[-50%] cursor-pointer"
                    >
                      <MdOutlineEmojiEmotions />
                    </span>
                  </div>
                </label>
              </div>
            </div>
            <div className="flex min-w-[5%] justify-center">
              {messageValue.length > 0 ? (
                <span
                  className="cursor-pointer text-2xl"
                  onClick={handleSendMessage}
                >
                  <VscSend />
                </span>
              ) : image ? (
                <VscSend
                  className="text-2xl cursor-pointer"
                  onClick={handleMsgImageSend}
                />
              ) : (
                <span className="text-2xl">
                  <IoMdThumbsUp />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainLayOut;
