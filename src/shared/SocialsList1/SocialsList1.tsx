import { SocialType } from "shared/SocialsShare/SocialsShare";
import React, { FC } from "react";
// import facebook from "images/socials/facebook.svg";
// import vimeo from "images/socials/vimeo.svg";
// import twitter from "images/socials/twitter.svg";
// import telegram from "images/socials/telegram.svg";
// import youtube from "images/socials/youtube.svg";
import { FiFacebook, FiYoutube } from 'react-icons/fi';
import { TbBrandTelegram, TbBrandTwitter } from 'react-icons/tb';
import { RiVimeoLine } from 'react-icons/ri';
import { RxDiscordLogo } from 'react-icons/rx';

export interface SocialsList1Props {
  className?: string;
}

const socials: SocialType[] = [
  { name: "Facebook", icon: <FiFacebook color={'#33FF00'} />, href: "#" },
  { name: "Vimeo", icon: <RiVimeoLine color={'#33FF00'} />, href: "#" },
  { name: "Youtube", icon: <FiYoutube color={'#33FF00'} />, href: "#" },
  { name: "Twitter", icon: <TbBrandTwitter color={'#33FF00'} />, href: "#" },
  { name: "Telegram", icon: <TbBrandTelegram color={'#33FF00'} />, href: "#" },
  { name: "Discord", icon: <RxDiscordLogo color={'#33FF00'} />, href: "#" },
  // { name: "Twitter", icon: <BsTwitter color={'#33FF00'} />, href: "#" },
  // { name: "Telegram", icon: <FaTelegramPlane color={'#33FF00'} />, href: "#" },
  // { name: "Discord", icon: <FaDiscord color={'#33FF00'} />, href: "#" },
  // { name: "Youtube", icon: <BsYoutube color={'#33FF00'} />, href: "#" },
];

const SocialsList1: FC<SocialsList1Props> = ({ className = "space-y-3" }) => {
  const renderItem = (item: SocialType, index: number) => {
    return (
      <a
        href={item.href}
        className="flex items-center opacity-70 text-2xl text-[#33FF00] leading-none space-x-2 group"
        key={index}
      >
        <div className="inline-flex items-center justify-center w-6 h-6 bg-transparent">
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
