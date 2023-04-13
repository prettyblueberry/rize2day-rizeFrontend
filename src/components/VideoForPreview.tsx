import { FC, useEffect, useState } from "react";
import { useAppSelector } from "app/hooks";
import { selectCurrentMediaRunning } from "app/mediaRunning/mediaRunning";
import { BiFullscreen } from "react-icons/bi";
import { IconButton } from "@mui/material";
import NcModal from "shared/NcModal/NcModal";

interface VideoForNftProps {
  src?: string;
  className?: string;
  nftId: string;
}

const VideoForPreview: FC<VideoForNftProps> = ({
  nftId,
  className = "absolute inset-0 z-20 flex items-center justify-center bg-neutral-700 rounded-3xl overflow-hidden",
  src = "./nft.mp4",
}) => {
  const renderContent = (newClass = "") => {
    return (
      <div
        className={`${className} ${newClass} `}
        title="Play"
        dangerouslySetInnerHTML={{
          __html: `<video className="w-full h-full" playsinline autoplay loop muted >
                    <source src=${src} type="video/mp4" />
                    our browser does not support the video tag.
                  </video>`,
        }}
      />
    );
  };

  return <>{renderContent()}</>;
};

export default VideoForPreview;
