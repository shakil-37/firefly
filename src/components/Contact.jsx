import { MdPermContactCalendar } from "react-icons/md";
import { GoSearch } from "react-icons/go";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ProfileImage from "./ProfileImage";
import { TbDotsVertical } from "react-icons/tb";
//
const Contact = () => {
  //
  const user = useSelector((state) => state.setUser.user);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendBtn, setFriendBtn] = useState([]);
  const [searchFriendData, setSearchFriendData] = useState([]);
  const db = getDatabase();

  // get all user data
  useEffect(() => {
    const list = [];
    onValue(ref(db, "users/"), (snapshot) => {
      snapshot.forEach((singleUser) => {
        if (singleUser.val().uid !== user.uid) {
          list.push(singleUser.val());
        }
      });
    });
    setUsers(list);
  }, []);
  // handleSendRequest
  function handleSendRequest(recever) {
    const { email, name, uid } = recever;
    set(push(ref(db, "request/")), {
      receverId: uid,
      receverName: name,
      receverEmail: email,
      senderId: user.uid,
      senderName: user.name,
      senderEmail: user.email,
    });
  }
  // get all friendRequest data for handle button
  useEffect(() => {
    const list = [];
    onValue(ref(db, "request/"), (snapshot) => {
      snapshot.forEach((request) => {
        list.push(request.val().receverId + request.val().senderId);
      });
    });
    setRequests(list);
  }, []);
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
  //
  // get all friend for handle for button
  useEffect(() => {
    const list = [];
    onValue(ref(db, "friends/"), (snapshot) => {
      snapshot.forEach((friend) => {
        list.push(friend.val().senderId + friend.val().receverId);
      });
    });
    setFriendBtn(list);
  }, []);
  // handle friend search
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
  //
  return (
    <section className="h-screen overflow-y-scroll relative">
      <div className="py-3 px-2 sticky top-0 left-0 w-full bg-third z-10">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold font-primary text-xl">Contact</h1>
          <MdPermContactCalendar className="text-2xl" />
        </div>
        <div className="mt-5 relative">
          <div className="absolute top-[50%] left-2 translate-y-[-50%]">
            <GoSearch className="text-lg" />
          </div>
          <input
            onChange={handleFriendSearch}
            className="pl-10 py-2  w-full h-full rounded-md outline-none font-primary pr-3"
            type="Search"
            placeholder="Search"
          />
        </div>
      </div>
      <div className="mt-2 px-2">
        <h2 className="mt-1 mb-2 font-primary font-semibold">
          People you know
        </h2>
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
              items: 2,
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
          {users.map((item, i) => {
            return (
              <div
                key={i}
                className="border-2 border-solid border-third rounded-md ml-1"
              >
                <div className="h-[70px] w-full overflow-hidden py-2 px-2 rounded-md">
                  <ProfileImage id={item.uid} />
                </div>
                <div className="py-1 px-1">
                  <h3 className="font-medium font-primary capitalize my-2 text-center">
                    {item.name}
                  </h3>
                  {requests
                    .map((request) => request)
                    .includes(user.uid + item.uid) ||
                  requests
                    .map((request) => request)
                    .includes(item.uid + user.uid) ? (
                    <button className="bg-third py-[2px] rounded-md w-full font-primary font-medium cursor-default">
                      Send
                    </button>
                  ) : friendBtn
                      .map((friend) => friend)
                      .includes(user.uid + item.uid) ||
                    friendBtn
                      .map((friend) => friend)
                      .includes(item.uid + user.uid) ? (
                    <button className="bg-first w-full font-primary font-medium text-white rounded-md cursor-default">Friend</button>
                  ) : (
                    <button
                      onClick={() => handleSendRequest(item)}
                      className="bg-third font-primary w-full font-medium"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </Carousel>
      </div>
      <div className="px-2">
        {friends.map((friend, i) => {
          return (
            <div
              key={i}
              className="rounded-md border-2 border-third mt-1 px-2 py-2 flex justify-between items-center"
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
              <div>
                <TbDotsVertical />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Contact;
