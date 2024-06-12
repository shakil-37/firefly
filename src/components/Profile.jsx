import { useState } from "react";
import { TbDotsVertical } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import defaultImage from "../images/profile.jpg";
import { useSelector } from "react-redux";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from "@chakra-ui/react";
//
const Profile = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.setUser.user);
  const joinDate = new Date(user.creationTime).toLocaleDateString();
  const [profileDot, setProfileDot] = useState(false);
  // console.log(user.bio?);

  //
  return (
    <section className="py-3 px-2">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold font-primary text-xl">My Profile</h2>
        <div className="relative bg-third px-1 py-1 rounded-md">
          <TbDotsVertical
            onClick={() => setProfileDot(!profileDot)}
            className="text-xl cursor-pointer"
          />
          {profileDot && (
            <div className="bg-third py-2 absolute bottom-[-68px] left-[-80px] rounded">
              <ul>
                <li
                  onClick={() => navigate("/profile-edit")}
                  className="font-primary font-medium bg-third transition duration-100 hover:bg-white px-2 cursor-pointer"
                >
                  Edit Profile
                </li>
                <li className="font-primary font-medium bg-third transition duration-100 hover:bg-white px-2 cursor-pointer flex justify-between items-center">
                  <p>Status</p>
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider round"></span>
                  </label>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="mt-5">
        <div className="w-20 h-20 rounded-full overflow-hidden mx-auto border-2 border-solid border-third">
          <img src={user.photoURL || defaultImage} alt="profile" />
        </div>
        <h2 className="text-center mt-3 capitalize font-semibold font-primary">
          {user.name}
        </h2>
        {/* <p>active er kaj ta baki thaklo</p> */}
        <hr className="text-third my-3" />
        <Accordion className="shadow">
          <AccordionItem>
            <h2>
              <AccordionButton className="bg-third py-1 px-2">
                <Box
                  className="font-medium font-primary text-lg"
                  as="span"
                  flex="1"
                  textAlign="left"
                >
                  Bio
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} className="px-2 py-3">
              <h6 className="font-primary text-black font-medium text-lg">
                {user.bio ? user?.bio : "Add your bio"}
              </h6>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <h2>
              <AccordionButton className="bg-third py-1 px-2">
                <Box
                  className="font-medium font-primary text-lg"
                  as="span"
                  flex="1"
                  textAlign="left"
                >
                  About
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} className="px-2 py-3">
              <h6 className="font-primary font-normal text-lg text-black text-opacity-[0.4]">
                Name
              </h6>
              <h3 className="font-primary font-normal text-lg capitalize">
                {user.name}
              </h3>
              <h6 className="font-primary font-normal text-black text-opacity-[0.4] text-lg">
                Email
              </h6>
              <h3 className="font-primary font-normal text-lg">
                {user.email}
              </h3>
              <h6 className="font-primary text-black text-opacity-[0.4] text-lg">
                Join
              </h6>
              <h3 className="font-primary font-normal text-lg">{joinDate}</h3>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default Profile;
