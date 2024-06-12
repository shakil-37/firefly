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
import { getDatabase, onValue, ref } from "firebase/database";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TbPhoneCalling } from "react-icons/tb";
import { FiVideo } from "react-icons/fi";
import ProfileImage from "./ProfileImage";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { CiImageOn } from "react-icons/ci";
import { LuSticker } from "react-icons/lu";
import { IoMdThumbsUp } from "react-icons/io";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import { VscSend } from "react-icons/vsc";
//
const LayoutTest = (props) => {
  //
  const navigate = useNavigate();
  const [sideNav, setSideNav] = useState(false);
  const [avatarModal, setAvatarModal] = useState(false);
  const user = useSelector((state) => state.setUser.user);
  const active = useSelector((state) => state.active.active);
  const [notification, setNotification] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [messageValue, setMeassageValue] = useState("");
  const dispatch = useDispatch();
  const db = getDatabase();
  //
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
        console.log("send message");
      } else {
        setMeassageValue("");
      }
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
                      <p className="font-primary font-medium text-lg">
                        sakildevmern@gmail.com
                      </p>
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
                <div className="absolute sm:top-[50px] sm:right-[-16px] md:top-[50px] md:right-[-16px] lg:right-[-22px] lg:top-[-105px] xl:right-[-22px] xl:top-[-105px] 2xl:right-[-22px] 2xl:top-[-105px] bg-third py-1 transition duration-100 flex z-10 rounded-md">
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
          <div className="py-4 sticky top-0 left-0 w-full bg-third px-4 flex justify-between items-center">
            <div className="flex items-center gap-x-3">
              <div className="w-16 h-16 rounded-full bg-first overflow-hidden object-cover">
                <div className="h-full w-full">
                  <ProfileImage id={active?.id} />
                </div>
              </div>
              <div>
                <h3 className="font-primary capitalize text-lg font-semibold">
                  {active?.name}
                </h3>
                <h4>{active?.status}</h4>
              </div>
              <div>
                <span>
                  <MdKeyboardArrowDown />
                </span>
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              <div className="bg-first">
                <span>
                  <TbPhoneCalling />
                </span>
              </div>
              <div className="bg-second">
                <span>
                  <FiVideo />
                </span>
              </div>
            </div>
          </div>
          <h2>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ea
            consequatur facere perferendis atque maxime, at tempora odit neque
            aperiam? Deleniti repudiandae molestias at dolore reprehenderit, id
            vitae perferendis? Repudiandae, quia. Corporis nisi quibusdam quasi
            necessitatibus? Eos accusantium tenetur fugiat rerum quasi dolorem
            odit fugit obcaecati, officiis esse excepturi maxime nisi mollitia,
            modi odio pariatur. Explicabo cumque sed rem labore cum non deleniti
            hic mollitia beatae sit doloribus blanditiis tenetur fugiat quaerat
            totam accusamus amet est illo dignissimos vel, quibusdam fugit id
            sunt asperiores. Maiores distinctio laudantium ipsa eveniet dolor
            qui sequi, illo non! Optio, laboriosam placeat aperiam enim,
            commodi, facere dignissimos ullam non porro dolore et obcaecati
            error? Id consequatur rerum quibusdam neque! Corrupti laborum
            excepturi fugiat iure beatae voluptatem, tempore aperiam a omnis, ab
            maiores unde pariatur eius odio ut porro at sequi dolore! Iste
            suscipit voluptatum quidem, minus dolores facilis sit quibusdam quia
            tempora harum quaerat eum! Nostrum nobis veritatis et consequatur,
            eaque autem ab corporis quidem aliquam veniam illo. Expedita
            obcaecati alias sunt velit voluptate earum natus tenetur ullam,
            optio beatae. Harum, ut omnis quidem deserunt possimus perferendis
            tempora beatae impedit id quo rerum praesentium incidunt voluptate
            sint quibusdam ratione nobis! In, beatae quae quas asperiores odit
            nesciunt dolorem vero ratione consectetur quo natus omnis ipsam eos
            fuga libero explicabo commodi at, veritatis odio maxime! Beatae
            saepe repudiandae eum maxime libero. Exercitationem velit vero
            numquam unde, earum in, quam possimus repellendus non dolorem
            assumenda, commodi tempora architecto sequi consequatur? Nobis
            tenetur ad eveniet obcaecati repudiandae distinctio qui incidunt
            sequi nulla ducimus voluptatem voluptate, ea, ipsa velit, quam quae
            quidem porro a odit praesentium rem. Similique nisi modi numquam!
            Dicta, odio ad. Molestiae dolor est eveniet, ut qui quam optio
            omnis, odio dignissimos consequuntur quibusdam, veniam laudantium
            neque voluptates non at rerum ullam. Obcaecati quisquam rem nulla
            ullam. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ea
            consequatur facere perferendis atque maxime, at tempora odit neque
            aperiam? Deleniti repudiandae molestias at dolore reprehenderit, id
            vitae perferendis? Repudiandae, quia. Corporis nisi quibusdam quasi
            necessitatibus? Eos accusantium tenetur fugiat rerum quasi dolorem
            odit fugit obcaecati, officiis esse excepturi maxime nisi mollitia,
            modi odio pariatur. Explicabo cumque sed rem labore cum non deleniti
            hic mollitia beatae sit doloribus blanditiis tenetur fugiat quaerat
            totam accusamus amet est illo dignissimos vel, quibusdam fugit id
            sunt asperiores. Maiores distinctio laudantium ipsa eveniet dolor
            qui sequi, illo non! Optio, laboriosam placeat aperiam enim,
            commodi, facere dignissimos ullam non porro dolore et obcaecati
            error? Id consequatur rerum quibusdam neque! Corrupti laborum
            excepturi fugiat iure beatae voluptatem, tempore aperiam a omnis, ab
            maiores unde pariatur eius odio ut porro at sequi dolore! Iste
            suscipit voluptatum quidem, minus dolores facilis sit quibusdam quia
            tempora harum quaerat eum! Nostrum nobis veritatis et consequatur,
            eaque autem ab corporis quidem aliquam veniam illo. Expedita
            obcaecati alias sunt velit voluptate earum natus tenetur ullam,
            optio beatae. Harum, ut omnis quidem deserunt possimus perferendis
            tempora beatae impedit id quo rerum praesentium incidunt voluptate
            sint quibusdam ratione nobis! In, beatae quae quas asperiores odit
            nesciunt dolorem vero ratione consectetur quo natus omnis ipsam eos
            fuga libero explicabo commodi at, veritatis odio maxime! Beatae
            saepe repudiandae eum maxime libero. Exercitationem velit vero
            numquam unde, earum in, quam possimus repellendus non dolorem
            assumenda, commodi tempora architecto sequi consequatur? Nobis
            tenetur ad eveniet obcaecati repudiandae distinctio qui incidunt
            sequi nulla ducimus voluptatem voluptate, ea, ipsa velit, quam quae
            quidem porro a odit praesentium rem. Similique nisi modi numquam!
            Dicta, odio ad. Molestiae dolor est eveniet, ut qui quam optio
            omnis, odio dignissimos consequuntur quibusdam, veniam laudantium
            neque voluptates non at rerum ullam. Obcaecati quisquam rem nulla
            ullam.
          </h2>
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
          <div className="px-4 sticky left-0 bottom-0 w-full flex items-center justify-between">
            <div className="flex items-center gap-x-3 bg-first min-w-[15%]">
              <div>
                <span>
                  <MdOutlineKeyboardVoice />
                </span>
              </div>
              <div>
                <span>
                  <CiImageOn />
                </span>
              </div>
              <div>
                <span>
                  <LuSticker />
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between min-w-[78%]">
              <div className="relative w-full">
                <input
                  name="messageValue"
                  id="messageValue"
                  value={messageValue}
                  onChange={handleMessageValue}
                  className="w-full h-full py-2 pl-4 outline-none border-[2px] border-third rounded-xl"
                  type="text"
                  placeholder="Aa"
                />
                <span
                  onClick={() => setShowEmoji(!showEmoji)}
                  className="absolute inline-block top-[50%] right-3 text-2xl translate-y-[-50%] cursor-pointer"
                >
                  <MdOutlineEmojiEmotions />
                </span>
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
              ) : (
                <span>
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

export default LayoutTest;
