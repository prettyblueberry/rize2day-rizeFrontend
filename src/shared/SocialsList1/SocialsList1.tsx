import { SocialType } from "shared/SocialsShare/SocialsShare";
import React, { FC } from "react";
import facebook from "images/socials/facebook.svg";
import vimeo from "images/socials/vimeo.svg";
import twitter from "images/socials/twitter.svg";
import telegram from "images/socials/telegram.svg";
import youtube from "images/socials/youtube.svg";
import { BsTwitter, BsYoutube } from "react-icons/bs";
import { FaTelegramPlane, FaDiscord } from "react-icons/fa";

export interface SocialsList1Props {
  className?: string;
}

const socials: SocialType[] = [
  // { name: "Facebook", icon: facebook, href: "#" },
  // { name: "Vimeo", icon: vimeo, href: "#" },
  { name: "Twitter", icon: <BsTwitter color={'#21c689'} />, href: "#" },
  { name: "Telegram", icon: <FaTelegramPlane color={'#21c689'} />, href: "#" },
  { name: "Discord", icon: <FaDiscord color={'#21c689'} />, href: "#" },
  { name: "Youtube", icon: <BsYoutube color={'#21c689'} />, href: "#" },
];

const SocialsList1: FC<SocialsList1Props> = ({ className = "space-y-3" }) => {
  const renderItem = (item: SocialType, index: number) => {
    return (
      <a
        href={item.href}
        className="flex items-center opacity-70 text-2xl text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white leading-none space-x-2 group"
        key={index}
      >
        <div className="inline-flex items-center justify-center rounded-[50%] w-12 h-12 bg-[#2b4142] hover:bg-[#354d4e]">
          {/* <img className="opacity-80" src={item.icon} alt="" /> */}
          {item.icon}
        </div>
        {/* <span className="hidden lg:block text-md">{item.name}</span> */}
      </a>
    );
  };

  return (
    <div className={`nc-SocialsList1 ${className}`} data-nc-id="SocialsList1">
      {socials.map(renderItem)}
    </div>
  );
};

export default SocialsList1;
