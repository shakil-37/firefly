import { useState } from "react";
import defaultImage from "../images/profile.jpg";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
// import { toast } from "react-toastify";

//
const ProfileImage = (props) => {
  //
  const [image, setImage] = useState("#");
  const id = props.id;
  const storage = getStorage();
  getDownloadURL(ref(storage, id))
    .then((url) => {
      setImage(url);
      // console.log(url);
      // `url` is the download URL for 'images/stars.jpg'
      // // This can be downloaded directly:
      // const xhr = new XMLHttpRequest();
      // xhr.responseType = 'blob';
      // xhr.onload = (event) => {
      //   const blob = xhr.response;
      // };
      // xhr.open('GET', url);
      // xhr.send();
      // // Or inserted into an <img> element
      // const img = document.getElementById('myimg');
      // img.setAttribute('src', url);
    })
    .catch((error) => {
   
      setImage(defaultImage)
      // window.location.reload(true);
      // Handle any errors
    });
  //
  return (
    <div className="h-full w-full">
      <img src={image} alt="profile" />
    </div>
  );
};

export default ProfileImage;
