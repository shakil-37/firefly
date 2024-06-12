import React from "react";
import { useEffect, useState } from "react";
import {
  MdKeyboardArrowDown,
  MdOutlineEmojiEmotions,
  MdOutlineKeyboardVoice,
} from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import ProfileImage from "./ProfileImage";
import defaultImage from "../images/profile.jpg";
import { FiVideo } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import EmojiPicker from "emoji-picker-react";
import { CiImageOn } from "react-icons/ci";
import { LuSticker } from "react-icons/lu";
import { VscSend } from "react-icons/vsc";
import { IoMdThumbsUp } from "react-icons/io";
import { getDatabase, onValue, push, set, ref } from "firebase/database";
import {
  getDownloadURL,
  uploadBytesResumable,
  ref as sref,
  getStorage,
} from "firebase/storage";
//
const SmallChatBox = (props) => {
  //
  const [rawImage, setRawImage] = useState(null);
  const [messageValue, setMeassageValue] = useState("");
  const [imagePreview, setImagePreview] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const active = useSelector((state) => state.active.active);
  const user = useSelector((state) => state.setUser.user);
  const [image, setImage] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const db = getDatabase();
  const storage = getStorage();
  // handleRemoveMsgImage
  function handleRemoveMsgImage() {
    console.log("remove");
    setImage(null);
    setImagePreview(false);
  }
  // handleEmojiValue
  function handleEmojiValue(e) {
    setMeassageValue((prev) => prev.concat(e.emoji));
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
  //
  function handleMessageValue(e) {
    setMeassageValue(e.target.value);
  }
  //

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
  //
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
  //
  // get single message from db
  useEffect(() => {
    const singleMsgRef = ref(db, "singleMsg/");
    onValue(singleMsgRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (
          (item.val().msgSenderId == user.uid &&
            item.val().msgReceverId == active.id) ||
          (item.val().msgReceverId == user.uid &&
            item.val().msgSenderId == active?.id)
        ) {
          list.push({ ...item.val(), id: item.key });
        }
      });
      setMsgs(list);
    });
  }, [active?.id]);
  //
  return (
    <div className="shadow-md relative w-full h-screen overflow-y-scroll bg-white">
      <div className="z-1 py-2 sticky top-0 left-0 w-full bg-third px-4 flex justify-between items-center">
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

          <div
            onClick={() => props.data((prev) => !prev)}
            className="w-8 h-8 rounded-full hover:border-2 flex justify-center items-center cursor-pointer"
          >
            <span>
              <RxCross2 className="text-2xl" />
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
        <div className="flex items-center gap-x-3 min-w-[10%]">
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
        <div className="flex items-center justify-between w-[70%]">
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
  );
};

export default SmallChatBox;
