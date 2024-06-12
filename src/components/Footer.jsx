// import React from "react";
import { FaGithub } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa";
import { MdOutlineFacebook } from "react-icons/md";

//
const Footer = () => {
  return (
    <section className="bg-third py-4 relative z-10">
      <div className="container mx-auto">
        <h2 className="font-primary font-bold text-lg text-center sm:text-left">
          FireFly
        </h2>
        <div className="mt-3 text-center sm:text-left sm:flex sm:justify-between">
          <div className="mt-2">
            <h3 className="font-semibold font-primary">Developers</h3>
            <ul>
              <li className="font-primary">Git hub</li>
            </ul>
          </div>
          <div className="mt-2">
            <h3 className="font-semibold font-primary">About us</h3>
            <ul>
              <li className="font-primary">About</li>
              <li className="font-primary">Blog</li>
              <li className="font-primary">Service</li>
            </ul>
          </div>
          <div className="mt-2">
            <h3 className="font-semibold font-primary">Features</h3>
            <ul>
              <li className="font-primary">Messaging</li>
              <li className="font-primary">Sharing</li>
              <li className="font-primary">Contact us</li>
            </ul>
          </div>
          <div className="mt-2 text-center">
            <h3 className="font-semibold font-primary">Flow us</h3>
            <ul className="flex gap-x-2 mt-3 justify-center">
              <li className="w-5 h-5 rounded-full flex justify-center items-center bg-white cursor-pointer">
                <FaGithub className="text-2xl" />
              </li>
              <li className="w-5 h-5 rounded-full flex justify-center items-center bg-white">
                <FaLinkedinIn className="text-2xl" />
              </li>
              <li className="w-5 h-5 rounded-full flex justify-center items-center bg-white">
                <MdOutlineFacebook className="text-2xl" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
