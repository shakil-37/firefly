import { useDispatch, useSelector } from "react-redux";
import { MdModeEditOutline } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { useState, createRef } from "react";
import defaultImage from "../images/profile.jpg";
import { Cropper } from "react-cropper";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import { setUser } from "../Redux/slices/userSlice";
import { ThreeDots } from "react-loader-spinner";
import "cropperjs/dist/cropper.css";
import { setAuth } from "../helper/session/authSession";
import { RxCross2 } from "react-icons/rx";
// import "./Demo.css";
const EditProfile = () => {
  //
  const cropperRef = createRef();
  const [image, setImage] = useState(defaultImage);
  const [btnLoading, setBtnLoading] = useState(false);
  const [showBio, setShowBio] = useState(false);
  const storage = getStorage();
  const auth = getAuth();
  const user = useSelector((state) => state.setUser.user);
  const storageRef = ref(storage, auth.currentUser?.uid || user?.uid);
  const [showUpload, setShowUpload] = useState(false);
  const dispatch = useDispatch();
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  //
  const onChange = (e) => {
    e.preventDefault();
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
  };
  // handleProfileImageUpload
  const getCropData = async () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setBtnLoading(true);
      const data = cropperRef.current?.cropper.getCroppedCanvas().toDataURL();
      await uploadString(storageRef, data, "data_url").then((snapshot) => {
        getDownloadURL(ref(storageRef))
          .then((url) => {
            updateProfile(auth.currentUser, {
              photoURL: url,
            }).then(() => {
              const updateUser = {};
              updateUser.name = auth.currentUser.displayName;
              updateUser.email = auth.currentUser.email;
              updateUser.photoURL = auth.currentUser.photoURL;
              updateUser.uid = auth.currentUser.uid;
              localStorage.setItem("user", JSON.stringify(updateUser));
              dispatch(setUser(updateUser));
              toast.success("Upload successfully");
              setBtnLoading(false);
            });
          })
          .then(() => {
            setImage(null);
            setShowUpload(false);
            setTimeout(() => {
              window.location.reload(true);
            }, 2000);
          })
          .catch((error) => {
            toast.error("Something went wrong");
          });
      });
    }
  };
  //handleBioValue
  function handleBioValue(e) {
    setBio(e.target.value);
  }
  // handleProfileUpdate

  //  handleDescription
  function handleDescription(e) {
    e.preventDefault();
    const newUser = { ...user, bio: bio };
    setAuth(newUser);
    dispatch(setUser(newUser));
    toast.success("Bio added");
  }
  // handleName
  function handleName(e) {
    setName(e.target.value);
  }
  // handleProfileUpdate
  function handleProfileUpdate(e) {
    e.preventDefault();
    updateProfile(auth.currentUser, {
      displayName: name,
    })
      .then(() => {
        // Profile updated!
        // ...
        const newUser = {};
        newUser.uid = auth.currentUser.uid;
        newUser.name = auth.currentUser.displayName;
        newUser.phoneNumber = auth.currentUser.phoneNumber;
        newUser.email = auth.currentUser.email;
        newUser.createdAt = auth.currentUser.metadata.createdAt;
        newUser.creationTime = auth.currentUser.metadata.creationTime;
        newUser.lastSignInTime = auth.currentUser.metadata.lastSignInTime;
        newUser.lastLoginAt = auth.currentUser.metadata.lastLoginAt;
        newUser.bio = user.bio;
        setAuth(newUser);
        dispatch(setUser(newUser));
        toast.success("Update Successfully");
      })
      .catch((error) => {
        // An error occurred
        // ...
        toast.error("Something went wrong");
      });
  }
  //
  return (
    <section className="py-3 px-2">
      <h2 className="font-semibold font-primary text-xl">Edit Profile</h2>
      <div className="mt-5 h-20 w-20  mx-auto rounded-full relative">
        <div className="h-20 w-20 overflow-hidden border-2 border-solid border-third rounded-full">
          <div
            onClick={() => document.getElementById("my_modal_5").showModal()}
            className="absolute right-0 top-[54px] w-6 h-6 bg-third rounded-full flex justify-center items-center cursor-pointer"
          >
            <MdModeEditOutline />
          </div>
          <img
            className="h-full w-full"
            src={user.photoURL || defaultImage}
            alt="profile"
          />
        </div>

        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-primary text-lg font-semibold text-center">
              Make an awesome profile pick from
              <span className="text-first ml-2">any</span> photo
            </h3>
            <hr className="text-third mt-3" />
            {showUpload ? (
              <div className="mt-5">
                <label htmlFor="file">
                  <p className="block font-primary font-bold cursor-pointer text-[20px] text-center">
                    Choose profile
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
                    className="w-full py-2 bg-third mt-5 rounded-md font-primary font-semibold text-black text-lg transition duration-100 hover:bg-opacity-[0.5]"
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
            )}

            <div className="modal-action">
              <form method="dialog">
                <button className="bg-third mt-2 h-10 w-10 hover:bg-opacity-[0.5] rounded-full flex justify-center items-center transition duration-100 cursor-pointer">
                  <RxCross2 className="text-2xl" />
                </button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
      <h3 className="mt-3 text-center capitalize font-semibold font-primary">
        {user.name}
      </h3>
      <hr className="text-third my-3" />
      {showBio ? (
        <form onSubmit={handleDescription}>
          <label htmlFor="description" className="font-medium font-primary">
            Intro
          </label>
          <textarea
            defaultValue={user.bio}
            onChange={(e) => handleBioValue(e)}
            maxLength={50}
            className="px-2 py-2 w-full rounded-md border-[2px] border-solid border-third outline-none font-primary resize-none"
            name="bio"
            id="bio"
          ></textarea>
          <button
            className="mt-2 rounded-md py-1 bg-third font-primary font-medium w-full text-center text-lg hover:bg-opacity-[0.5]"
            type="submit"
          >
            Save
          </button>
        </form>
      ) : (
        <button
          className="w-full bg-third py-1 rounded-md font-semibold font-primary"
          onClick={() => setShowBio(true)}
        >
          Add bio
        </button>
      )}
      <form className="mt-5" onSubmit={handleProfileUpdate}>
        <div>
          <label
            htmlFor="name"
            className="text-black font-primary font-medium opacity-[0.5]"
          >
            Name
          </label>
          <input
            required
            defaultValue={user.name}
            onChange={handleName}
            type="text"
            name="name"
            id="name"
            className="mt-[5px] px-1 py-1 w-full rounded-md border-[2px] border-solid border-third outline-none font-primary font-normal capitalize"
          />
        </div>

        <button
          className="mt-3 w-full bg-third py-1 font-primary rounded-md text-black font-medium text-lg hover:bg-opacity-[0.5]"
          type="submit"
        >
          Update
        </button>
      </form>
    </section>
  );
};

export default EditProfile;
