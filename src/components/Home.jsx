// import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createRef, useEffect, useState } from "react";
import { GoSearch } from "react-icons/go";
import defaultImage from "../images/profile.jpg";
import ProfileImage from "./ProfileImage";
import { useSelector } from "react-redux";
import { Cropper } from "react-cropper";
import EmojiPicker from "emoji-picker-react";
import { IoMdTime } from "react-icons/io";
import { IoMdThumbsUp } from "react-icons/io";
import { FaRegCommentDots } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { TiTag } from "react-icons/ti";
import { getDatabase, set, ref, onValue, push } from "firebase/database";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import { TbDotsVertical } from "react-icons/tb";
import PostDateConvert from "../utils/PostDateConvert";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
//
const Home = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [image, setImage] = useState(defaultImage);
  const [showEmoji, setShowEmoji] = useState(false);
  const [postValue, setPostValue] = useState("");
  const [postsData, setPostData] = useState([]);
  const cropperRef = createRef();
  const user = useSelector((state) => state.setUser.user);
  const db = getDatabase();
  //
  // const onChange = (e) => {
  //   e.preventDefault();
  //   let files;
  //   if (e.dataTransfer) {
  //     files = e.dataTransfer.files;
  //   } else if (e.target) {
  //     files = e.target.files;
  //   }
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     setImage(reader.result);
  //   };
  //   reader.readAsDataURL(files[0]);
  // };
  const datas = [
    { id: 1, name: "shakil", age: 22 },
    { id: 2, name: "upoma", age: 21 },
    { id: 3, name: "inni", age: 20 },
    { id: 4, name: "sumaiya", age: 21 },
    { id: 5, name: "samiya", age: 18 },
    { id: 6, name: "safayat", age: 88 },
    { id: 7, name: "momo", age: 22 },
  ];
  // handlePostValue
  function handlePostValue(e) {
    setPostValue(e.target.value);
  }
  // handle emoji value
  function handleEmojiValue(e) {
    setPostValue((prev) => prev.concat(e.emoji));
  }
  // handleCreatPost
  function handleCreatPost(e) {
    e.preventDefault();
    set(push(ref(db, "posts/")), {
      status: postValue,
      creatorName: user.name,
      creatorId: user.uid,
      createdDate: Date.now(),
      // email: email,
      // profile_picture : imageUrl
    }).then(() => {
      toast.success("post succesfully");
      setPostValue("");
    });
  }
  // get post data
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
    setPostData(postsData);
  }, []);
  // const auth = getAuth();
  // const [image, setImage] = useState("");
  // console.log(image);
  // //
  // useEffect(() => {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       // User is signed in, see docs for a list of available properties
  //       // https://firebase.google.com/docs/reference/js/auth.user
  //       setImage(user.photoURL);
  //       // ...
  //     } else {
  //       // User is signed out
  //       // ...
  //       console.log(user);
  //     }
  //   });
  // }, []);

  // const user = useSelector((state) => state.setUser.user);
  // console.log(user);
  // const userdata = useSelector((state) => state.setUser.user);
  // const navigate = useNavigate();
  // userchaking start
  // useEffect(() => {
  //   if (!userdata) {
  //     navigate("/login");
  //   }
  // });
  // userchaking end

  return (
    <section className="overflow-y-scroll h-screen relative">
      <div className="pt-3 pb-2 px-1 z-10 sticky top-0 left-0 w-full bg-third">
        <h1 className="font-semibold font-primary text-xl">Fire Fly</h1>
        <div className="relative mt-3">
          <div className="absolute top-[50%] left-2 translate-y-[-50%]">
            <GoSearch className="text-lg" />
          </div>
          <input
            className="w-full py-[6px] rounded-md border-[2px] border-solid border-third outline-none font-primary font-medium pr-2 pl-10"
            placeholder="Search firefly"
            type="search"
          />
        </div>
      </div>
      <div className="text-center">
        <label
          htmlFor="my_modal_6"
          className="cursor-pointer py-[6px] text-lg font-primary font-medium inline-block w-full h-full"
        >
          Create Story
        </label>
        <input type="checkbox" id="my_modal_6" className="modal-toggle" />
        <div className="modal" role="dialog">
          <div className="modal-box">
            <h3 className="font-primary text-lg font-semibold text-center">
              Add your photo on your timeline
            </h3>
            <hr className="text-third mt-3" />
            {/* {showUpload ? (
              <div className="mt-5">
                <label htmlFor="file">
                  <p className="block font-primary font-bold cursor-pointer text-[20px] text-center">
                    Choose photo
                  </p>
                </label>
                <input
                  className="hidden"
                  type="file"
                  id="file"
                  onChange={onChange}
                />
                <div className="mt-5 h-[150px] w-[150px] overflow-hidden  border-solid border-2 border-third  mx-auto">
                  <Cropper
                    ref={cropperRef}
                    style={{ height: "100%", width: "100%" }}
                    zoomTo={0.1}
                    initialAspectRatio={1}
                    preview=".img-preview"
                    src={image}
                    viewMode={1}
                    minCropBoxHeight={10}
                    minCropBoxWidth={10}
                    background={false}
                    responsive={true}
                    autoCropArea={1}
                    checkOrientation={false}
                    guides={true}
                  />
                </div>

                {btnLoading ? (
                  <button className="flex justify-center items-center w-full font-primary rounded-md bg-third py-2 mt-5">
                    <ThreeDots
                      visible={true}
                      height="25"
                      width="80"
                      color="#00B876"
                      radius="9"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  </button>
                ) : (
                  <button
                    className="w-full py-2  bg-third mt-5 rounded-md font-primary font-semibold text-black text-lg"
                    onClick={getCropData}
                  >
                    Upload
                  </button>
                )}
              </div>
            ) : (
              <div className="w-full flex justify-center mt-10">
                <div className="w-20 h-20 rounded-full border-[3px] border-dotted  border-first flex justify-center items-center">
                  <div
                    onClick={() => setShowUpload(true)}
                    className="h-[70px] w-[70px] bg-first opacity-[0.5] rounded-full flex justify-center items-center cursor-pointer"
                  >
                    <label htmlFor="file">
                      <FiPlus className="text-2xl text-black cursor-pointer" />
                    </label>
                  </div>
                </div>
              </div>
            )} */}

            <h1>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsa,
              suscipit culpa quibusdam veniam tenetur iste illo quae dolorem
              mollitia pariatur.
            </h1>
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
      <div className="mt-2">
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
          {datas.map((item, i) => {
            return (
              <div key={i} className="shadow text-center ml-2 bg-third relative px-2 py-2">
                <div className="h-8 w-8 rounded-full overflow-hidden bg-white">Img</div>
                
              </div>
            );
          })}
        </Carousel>
      </div>
      <div className="rounded-md pl-1 pr-1 py-1 mt-3 flex justify-between items-center">
        <div className="relative flex justify-center items-center">
          <div className="w-[50px] h-[50px] rounded-full overflow-hidden border-2 border-solid border-third">
            <img src={user.photoURL || defaultImage} alt="profile" />
          </div>
        </div>
        <div className="w-full h-full ml-2">
          <input
            className="w-full py-1 outline-none bg-third pl-2 rounded-2xl transition duration-100 hover:bg-opacity-[0.4]"
            readOnly
            placeholder="Whats on your mind"
            type="text"
            onClick={() => document.getElementById("my_modal_5").showModal()}
          />
          <dialog
            id="my_modal_5"
            className="modal modal-bottom sm:modal-middle"
          >
            <div className="modal-box">
              <h3 className="font-semibold font-primary text-lg text-center">
                Create post
              </h3>
              <hr className="mt-3 text-third" />

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
              <form onSubmit={handleCreatPost} className="mt-5">
                <textarea
                  required
                  value={postValue}
                  onChange={handlePostValue}
                  placeholder="Whats on your mind"
                  className="resize-none w-full min-h-[70px] outline-none rounded-md px-3 py-3"
                  name="postValue"
                  id="postValue"
                ></textarea>
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
                      Add to your post
                    </h3>
                  </div>
                  <div>
                    <ul className="flex gap-x-3">
                      <li>
                        <CiImageOn className="text-2xl" />
                      </li>

                      <li>
                        <MdOutlineEmojiEmotions
                          onClick={() => setShowEmoji(!showEmoji)}
                          className="text-2xl cursor-pointer"
                        />
                      </li>
                      <li>
                        <CiLocationOn className="text-2xl" />
                      </li>
                      <li>
                        <TiTag className="text-2xl" />
                      </li>
                    </ul>
                  </div>
                </div>
                <button
                  type="submit"
                  className="py-2 bg-third transition duration-100 hover:bg-opacity-[0.5] font-primary font-semibold text-lg rounded-md w-full mt-2"
                >
                  Post
                </button>
              </form>

              {/*  */}
              <div className="modal-action">
                <form method="dialog">
                  <button className="bg-third mt-2 h-10 w-10 hover:bg-opacity-[0.5] rounded-full flex justify-center items-center transition duration-100">
                    <RxCross2 className="text-2xl" />
                  </button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
      <div>
        {postsData.map((post, i) => {
          return (
            <div
              key={i}
              className="px-2 py-2 rounded-md border-2 border-solid border-third mt-1"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-[50px] h-[50px] rounded-full overflow-hidden border-2 border-solid border-third">
                    <ProfileImage id={post.creatorId} />
                  </div>
                  <div className="ml-2">
                    <h3 className="font-primary font-semibold capitalize">
                      {post.creatorName}
                    </h3>
                    <div className="flex items-center">
                      <PostDateConvert createdDate={post.createdDate} />
                      <IoMdTime className="ml-2 inline-block" />
                    </div>
                  </div>
                </div>
                <div>
                  <TbDotsVertical />
                </div>
              </div>
              <div className="mt-2 flex items-center justify-center">
                <h2 className="font-medium text-lg font-primary">
                  {post.status}
                </h2>
              </div>
              <hr className="text-third mt-2" />
              <ul className="flex mt-2">
                <li className="hover:bg-third hover:bg-opacity-[0.5] transition duration-100 w-[50%] text-center">
                  <IoMdThumbsUp className="inline-block text-xl" />
                </li>
                <li className="hover:bg-third hover:bg-opacity-[0.5] transition duration-100 w-[50%] text-center">
                  <FaRegCommentDots className="inline-block text-xl" />
                </li>
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Home;
