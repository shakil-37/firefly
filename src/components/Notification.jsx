import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { useEffect, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import Carousel from "react-multi-carousel";
import { useSelector } from "react-redux";
import ProfileImage from "./ProfileImage";
import { RxCross2 } from "react-icons/rx";
import PostDateConvert from "../utils/PostDateConvert";
import { useNavigate } from "react-router-dom";

//
const Notification = () => {
  //
  const [friendRequestsNotification, setFriendRequestsNotification] = useState(
    []
  );
  const user = useSelector((state) => state.setUser.user);
  const db = getDatabase();
  const [postNotification, setPostNotification] = useState([]);
  const navigate = useNavigate();

  // get friend request data
  useEffect(() => {
    const list = [];
    onValue(ref(db, "request/"), (snapshot) => {
      snapshot.forEach((request) => {
        if (request.val().receverId == user.uid) {
          list.push({ ...request.val(), id: request.key });
        }
      });
    });
    setFriendRequestsNotification(list);
  }, []);
  // handleDeleteRequest
  function handleDeleteRequest(request) {
    remove(ref(db, "request/" + request.id));
  }
  // handleAddFriend
  function handleAddFriend(request) {
    const {
      receverEmail,
      receverId,
      receverName,
      senderId,
      senderName,
      senderEmail,
    } = request;
    set(push(ref(db, "friends/")), {
      receverEmail: receverEmail,
      receverId: receverId,
      receverName: receverName,
      senderId: senderId,
      senderName: senderName,
      senderEmail: senderEmail,
    });

    remove(ref(db, "request/" + request.id));
  }
  // handle post notification
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
    setPostNotification(postsData);
  }, []);
  //

  return (
    <section className="h-screen overflow-y-scroll relative">
      <div className="py-3 px-2 sticky top-0 left-0 w-full z-10 bg-white">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold font-primary text-xl">Notification</h1>
          <IoMdNotificationsOutline className="text-2xl" />
        </div>
      </div>
      {friendRequestsNotification.length > 0 && (
        <div className="mt-2 px-[10px]">
          <h2 className="mt-1 mb-2 font-primary font-semibold">
            Friend request
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
            {friendRequestsNotification.map((request, i) => {
              return (
                <div
                  key={i}
                  className="border-2 border-solid border-third rounded-md ml-1 relative"
                >
                  <div
                    onClick={() => handleDeleteRequest(request)}
                    className="absolute top-[2px] right-[3px] h-7 w-7 flex justify-center items-center rounded-full bg-third transition duration-100 hover:opacity-[0.5] cursor-pointer"
                  >
                    <RxCross2 className="text-lg" />
                  </div>
                  <div className="h-[70px] w-full overflow-hidden">
                    <ProfileImage id={request.senderId} />
                  </div>
                  <div className="py-1 px-1">
                    <h3 className="font-medium font-primary capitalize mt-2 text-center">
                      {request.senderName}
                    </h3>
                    <button
                      onClick={() => handleAddFriend(request)}
                      className="py-[2px] font-medium w-full rounded-md bg-third transition duration-100 hover:bg-opacity-[0.5]"
                    >
                      Yes
                    </button>
                  </div>
                </div>
              );
            })}
          </Carousel>
        </div>
      )}

      <div className="mt-2 px-2">
        {postNotification.map((post, i) => {
          return (
            <div
              onClick={() => navigate("/")}
              key={i}
              className="transition duration-100 hover:bg-third rounded-md cursor-pointer py-1"
            >
              <div className="flex items-center">
                <div className="h-[50px] w-[50px] rounded-full overflow-hidden border-2 border-third">
                  <ProfileImage id={post.creatorId} />
                </div>
                <div className="ml-3">
                  <h3 className="font-primary font-semibold">
                    {post.creatorName}
                  </h3>
                  <p className="font-primary font-medium">Add a new post</p>
                  <PostDateConvert createdDate={post.createdDate} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Notification;
