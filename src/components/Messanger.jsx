import { GoSearch } from "react-icons/go";
import { FaRegMessage } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { getDatabase, onValue, ref } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import ProfileImage from "./ProfileImage";
import { setactive } from "../Redux/slices/activeslice";
import SmallChatBox from "./SmallChatBox";
//
const Messanger = () => {
  //
  const [changeMessanger, setChangeMessanger] = useState(false);
  const [showSmallMessanger, setShowSmallMessanger] = useState(false);
  const [width, setWidth] = useState(window.outerWidth);
  const [friends, setFriends] = useState([]);
  const user = useSelector((state) => state.setUser.user);
  const dispatch = useDispatch();
  const db = getDatabase();

  //
  // get all friends
  useEffect(() => {
    const list = [];
    onValue(ref(db, "friends/"), (snapshot) => {
      snapshot.forEach((friend) => {
        if (
          friend.val().senderId == user.uid ||
          friend.val().receverId == user.uid
        ) {
          list.push({ ...friend.val(), id: friend.key });
        }
      });
    });
    setFriends(list);
  }, []);
  // handleFriendSearch

  function handleFriendSearch(e) {
    const searchText = e.target.value;
    const list = [];
    onValue(ref(db, "friends/"), (snapshot) => {
      snapshot.forEach((friend) => {
        if (
          friend.val().senderId == user.uid ||
          friend.val().receverId == user.uid
        ) {
          if (
            friend
              .val()
              .senderName.toLowerCase()
              .includes(searchText.toLowerCase())
          )
            list.push({ ...friend.val(), id: friend.key });
          // list.push({ ...friend.val(), id: friend.key });
        }
      });
    });
    setFriends(list);
  }

  // handle active
  function handleActive(friend) {
    //
    if (width < 1024) {
      setShowSmallMessanger(true);
    } else if (width > 1024) {
      setShowSmallMessanger(false);
    }
    //
    if (friend.receverId == user.uid) {
      localStorage.setItem(
        "active",
        JSON.stringify({
          status: "Active",
          id: friend.senderId,
          name: friend.senderName,
        })
      );
      dispatch(
        setactive({
          status: "Active",
          id: friend.senderId,
          name: friend.senderName,
        })
      );
    } else {
      localStorage.setItem(
        "active",
        JSON.stringify({
          status: "Active",
          id: friend.receverId,
          name: friend.receverName,
        })
      );
      dispatch(
        setactive({
          status: "Active",
          id: friend.receverId,
          name: friend.receverName,
        })
      );
    }
  }
  // handle window width
  useEffect(() => {
    const handleResize = () => setWidth(window.outerWidth);
    window.addEventListener("resize", handleResize);
    // Cleanup function to remove the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  //
  // show and hide messanger components
  useEffect(() => {
    if (width < 1024) {
      setChangeMessanger(true);
    } else {
      setChangeMessanger(false);
    }
  }, [width]);
  //
  if (changeMessanger) {
    return (
      <div className="relative">
        {showSmallMessanger && <SmallChatBox data={setShowSmallMessanger} />}
        {
          showSmallMessanger?"":
          <section className="h-screen overflow-y-scroll relative">
          <div className="py-3 px-2 sticky top-0 left-0 w-full bg-third z-10">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold font-primary text-xl">Messanger</h1>
              <FaRegMessage className="text-2xl" />
            </div>
            <div className="mt-5 relative">
              <div className="absolute top-[50%] left-2 translate-y-[-50%]">
                <GoSearch className="text-lg" />
              </div>
              <label htmlFor="search">
                <input
                  onChange={handleFriendSearch}
                  className="pl-10 py-2  w-full h-full rounded-md outline-none font-primary pr-3"
                  type="search"
                  placeholder="Search"
                />
              </label>
            </div>
          </div>
          <div className="mt-2">
            {friends.map((friend, i) => {
              return (
                <div
                  onClick={() => handleActive(friend)}
                  key={i}
                  className="px-2 py-2 flex justify-between items-center rounded-md transition duration-100 hover:bg-third cursor-pointer"
                >
                  <div className="flex items-center">
                    <div className="w-[50px] h-[50px] rounded-full overflow-hidden border-2 border-third">
                      <ProfileImage
                        id={
                          friend.senderId == user.uid
                            ? friend.receverId
                            : friend.senderId
                        }
                      />
                    </div>
                    <div className="ml-2">
                      {friend.senderId == user.uid ? (
                        <h3 className="font-primary font-semibold capitalize">
                          {friend.receverName}
                        </h3>
                      ) : (
                        <h3 className="font-primary font-semibold capitalize">
                          {friend.senderName}
                        </h3>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        }
       
      </div>
    );
  } else {
    return (
      <section className="h-screen overflow-y-scroll relative">
        <div className="py-3 px-2 sticky top-0 left-0 w-full bg-third z-10">
          <div className="flex justify-between items-center">
            <h1 className="font-semibold font-primary text-xl">Messanger</h1>
            <FaRegMessage className="text-2xl" />
          </div>
          <div className="mt-5 relative">
            <div className="absolute top-[50%] left-2 translate-y-[-50%]">
              <GoSearch className="text-lg" />
            </div>
            <label htmlFor="search">
              <input
                onChange={handleFriendSearch}
                className="pl-10 py-2  w-full h-full rounded-md outline-none font-primary pr-3"
                type="search"
                placeholder="Search"
              />
            </label>
          </div>
        </div>
        <div className="mt-2">
          {friends.map((friend, i) => {
            return (
              <div
                onClick={() => handleActive(friend)}
                key={i}
                className="px-2 py-2 flex justify-between items-center rounded-md transition duration-100 hover:bg-third cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="w-[50px] h-[50px] rounded-full overflow-hidden border-2 border-third">
                    <ProfileImage
                      id={
                        friend.senderId == user.uid
                          ? friend.receverId
                          : friend.senderId
                      }
                    />
                  </div>
                  <div className="ml-2">
                    {friend.senderId == user.uid ? (
                      <h3 className="font-primary font-semibold capitalize">
                        {friend.receverName}
                      </h3>
                    ) : (
                      <h3 className="font-primary font-semibold capitalize">
                        {friend.senderName}
                      </h3>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }
};

export default Messanger;
