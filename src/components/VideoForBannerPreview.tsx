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
  containStrict?: boolean;
}

const VideoForBannerPreview: FC<VideoForNftProps> = ({
  nftId,
  className = "absolute inset-0 z-20 flex items-center justify-center bg-neutral-700 rounded-3xl overflow-hidden",
  src = "./nft.mp4",
  containStrict = false,
}) => {
  const renderContent = (newClass = "") => {
    return (
      <div
        className={`${className} ${newClass} `}
        title="Play"
        dangerouslySetInnerHTML={{
          __html: containStrict
            ? `<video class=" h-full " playsinline autoplay loop muted style="contain:strict">
                    <source src=${src} type="video/mp4" />
                    our browser does not support the video tag.
                  </video>`
            : `<video class=" h-full " playsinline autoplay loop muted>
                  <source src=${src} type="video/mp4" />
                  our browser does not support the video tag.
                </video>`,
        }}
      />
    );
  };

  return <>{renderContent()}</>;
};

export default VideoForBannerPreview;
