import React, { FC, useEffect, useState } from "react";
import NcImage from "shared/NcImage/NcImage";
import { Link, useNavigate } from "react-router-dom";
import images1 from "images/nfts/cat1.webp";

export interface CardCategory5Props {
  className?: string;
  featuredImage?: string;
  name: string;
  index: number;
  count: number;
}

const COLORS = [
  "bg-pink-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-gray-500",
];

const CardCategory5= (props : any
  ) => {
  const navigate = useNavigate();
  const [className, setClassName] = useState("");
  const [name, setName] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [isForMusicPlayer, setIsForMusicPlayer] = useState(false);

  useEffect(() => 
  {
    setClassName(props?.className || "");
    setName(props?.name || "");
    setFeaturedImage(props?.featuredImage || "");
    setIndex(props?.index || 0);
    setCount( props?.count || 0);
    setIsForMusicPlayer(props?.isForMusicPlayer ||  false);
  }, [props])

  return (
    <div
      className={`nc-CardCategory5 flex flex-col cursor-pointer ${className}`}
      data-nc-id="CardCategory5"
      onClick={() => {props.isForMusicPlayer === false  && navigate(`/collectionsOfCategory/${name}`) }}
    >
      <div
        className={`flex-shrink-0 relative w-full aspect-w-4 aspect-h-3 h-0 rounded-2xl overflow-hidden group`}
      >
        <NcImage
          src={featuredImage}
          className="object-cover w-full h-full rounded-2xl"
        />
        <span className="absolute inset-0 transition-opacity bg-black opacity-0 group-hover:opacity-100 bg-opacity-10"></span>
      </div>
      <div className="flex items-center mt-4">
        {/* <div className={`w-10 h-10 rounded-full ${COLORS[index]}`}></div> */}
        <div className="ml-3">
          <h2
            className={`text-base sm:text-lg text-neutral-900 dark:text-neutral-100 font-medium truncate`}
          >
            {name}
          </h2>
          <span
            className={`block mt-1 text-sm text-neutral-6000 dark:text-neutral-400`}
          >
            {count} NFTs
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardCategory5;
