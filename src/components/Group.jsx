import { GoSearch } from "react-icons/go";
import { MdGroups, MdOutlineEmojiEmotions } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import defaultImage from "../images/profile.jpg";
import { useSelector } from "react-redux";
import EmojiPicker from "emoji-picker-react";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { toast } from "react-toastify";
import Carousel from "react-multi-carousel";
import PostDateConvert from "../utils/PostDateConvert";
import { TbDotsVertical } from "react-icons/tb";
import { useEffect, useState } from "react";
//
const Group = () => {
  //
  const [showEmoji, setShowEmoji] = useState(false);
  const user = useSelector((state) => state.setUser.user);
  const [groupPostValue, setGroupPostValue] = useState("");
  const [myGroup, setMyGroup] = useState([]);
  const [friendsGroup, setFriendsGroup] = useState([]);
  const db = getDatabase();

  //
  // handle group post value
  function handleGroupPostValue(e) {
    setGroupPostValue(e.target.value);
  }

  // handle emoji
  function handleEmojiValue(e) {
    setGroupPostValue((prev) => prev.concat(e.emoji));
  }
  // handleCreatGroup
  function handleCreatGroup(e) {
    e.preventDefault();
    set(push(ref(db, "groups/")), {
      groupName: groupPostValue,
      groupAdminName: user.name,
      groupAdminId: user.uid,
      groupCreatedAt: Date.now(),
    }).then(() => {
      toast.success("creat succesfully");
      setGroupPostValue("");
    });
  }
  // get friends group
  useEffect(() => {
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
    const groupRef = ref(db, "groups/");
    const list = [];
    onValue(groupRef, (snapshot) => {
      snapshot.forEach((group) => {
        const groupAdmin = group.val().groupAdminId;
        friendsData.map((friend) => {
          if (friend.match(groupAdmin)) {
            list.push(group.val());
          }
        });
      });
    });
    setFriendsGroup(list);
  }, []);
  //get my group
  useEffect(() => {
    const list = [];
    onValue(ref(db, "groups/"), (snapshot) => {
      snapshot.forEach((group) => {
        if (group.val().groupAdminId == user.uid) {
          list.push({ ...group.val(), id: group.key });
        }
      });
    });
    setMyGroup(list);
  }, []);
  //
  // handleGroupSearchValue
  function handleGroupSearchValue(e) {
    const searchText = e.target.value;
    const list = [];
    onValue(ref(db, "groups/"), (snapshot) => {
      snapshot.forEach((group) => {
        if (group.val().groupAdminId == user.uid) {
          if (
            group
              .val()
              .groupName.toLowerCase()
              .includes(searchText.toLowerCase())
          ) {
            list.push(group.val());
          }
        }
      });
    });
    setMyGroup(list);
  }
  //
  return (
    <section className="h-screen overflow-y-scroll relative">
      <div className="py-3 px-2 sticky top-0 left-0 w-full bg-third z-10">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold font-primary text-xl">Group</h1>
          <MdGroups className="text-2xl" />
        </div>
        <div className="mt-5 relative">
          <div className="absolute top-[50%] left-2 translate-y-[-50%]">
            <GoSearch className="text-lg" />
          </div>
          <label htmlFor="search">
            <input
              onChange={handleGroupSearchValue}
              className="pl-10 py-2  w-full h-full rounded-md outline-none font-primary pr-3"
              type="search"
              placeholder="Search"
            />
          </label>
        </div>
      </div>
      <div className="text-center">
        <label
          htmlFor="my_modal_6"
          className="cursor-pointer py-[6px] text-lg font-primary font-medium inline-block w-full h-full"
        >
          Create new group
        </label>
        <input type="checkbox" id="my_modal_6" className="modal-toggle" />
        <div className="modal" role="dialog">
          <div className="modal-box">
            <h3 className="font-primary text-lg font-semibold text-center">
              Creat your own group
            </h3>
            <hr className="text-third mt-3" />
            <div className="flex items-center mt-3 justify-center">
              <div className="h-[80px] w-[80px] overflow-hidden rounded-full border-2 border-solid border-third">
                <img src={user.photoURL || defaultImage} alt="profile" />
              </div>
              <div className="ml-3">
                <h2 className="font-semibold font-primary capitalize">
                  {user.name}
                </h2>
              </div>
            </div>
            <form onSubmit={handleCreatGroup} className="mt-5">
              <label htmlFor="text">
                <input
                  required
                  value={groupPostValue}
                  name="groupPostValue"
                  id="groupPostValue"
                  onChange={handleGroupPostValue}
                  className="rounded-md w-full py-3 px-4 border-third outline-none border-2 mb-3"
                  type="text"
                  placeholder="Group name"
                />
              </label>

              {showEmoji && (
                <div className="text-center">
                  <EmojiPicker
                    reactionsDefaultOpen={true}
                    onEmojiClick={(e) => handleEmojiValue(e)}
                    width={"100%"}
                    height={"400px"}
                  />
                </div>
              )}
              <div className="mt-2 rounded-[8px] border-2 border-solid border-third flex items-center justify-between px-4 py-3">
                <div>
                  <h3 className="font-primary font-semibold">
                    Add to your group
                  </h3>
                </div>
                <div>
                  <ul className="flex">
                    <li>
                      <MdOutlineEmojiEmotions
                        onClick={() => setShowEmoji(!showEmoji)}
                        className="text-2xl cursor-pointer"
                      />
                    </li>
                  </ul>
                </div>
              </div>
              <button
                type="submit"
                className="py-2 bg-third transition duration-100 hover:bg-opacity-[0.5] font-primary font-semibold text-lg rounded-md w-full mt-2"
              >
                Creat
              </button>
            </form>

            <div className="modal-action">
              <label
                htmlFor="my_modal_6"
                className="bg-third mt-2 h-10 w-10 hover:bg-opacity-[0.5] rounded-full flex justify-center items-center transition duration-100 cursor-pointer"
              >
                <RxCross2 className="text-2xl" />
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 px-2">
        <Carousel
          additionalTransfrom={0}
          arrows
          autoPlaySpeed={3000}
          centerMode={false}
          className=""
          containerClass="container-with-dots"
          dotListClass=""
          draggable
          focusOnSelect={false}
          infinite
          itemClass=""
          keyBoardControl
          minimumTouchDrag={80}
          pauseOnHover
          renderArrowsWhenDisabled={false}
          renderButtonGroupOutside={false}
          renderDotsOutside={false}
          responsive={{
            desktop: {
              breakpoint: {
                max: 3000,
                min: 1024,
              },
              items: 3,
              partialVisibilityGutter: 40,
            },
            mobile: {
              breakpoint: {
                max: 464,
                min: 0,
              },
              items: 1,
              partialVisibilityGutter: 30,
            },
            tablet: {
              breakpoint: {
                max: 1024,
                min: 464,
              },
              items: 2,
              partialVisibilityGutter: 30,
            },
          }}
          rewind={false}
          rewindWithAnimation={false}
          rtl={false}
          shouldResetAutoplay
          showDots={false}
          sliderClass=""
          slidesToSlide={1}
          swipeable
        >
          {friendsGroup.map((group, i) => {
            return (
              <div key={i} className="border-2 border-third rounded-md ml-1">
                <h3 className="font-primary font-semibold">{group.groupName}</h3>
                <h5 className="font-primary capitalize">{group.groupAdminName}</h5>
                <PostDateConvert createdDate={group.groupCreatedAt} />
              </div>
            );
          })}
        </Carousel>
      </div>
      <div className="mt-2 px-2">
        {myGroup.map((group, i) => {
          return (
            <div key={i} className="rounded-md border-2 border-third mb-1 px-2 py-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-primary capitalize font-semibold">{group.groupName}</h3>
                  <h5 className="capitalize font-primary font-normal">{group.groupAdminName}</h5>
                  <PostDateConvert createdDate={group.groupCreatedAt} />
                </div>
                <div>
                  <TbDotsVertical />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Group;
