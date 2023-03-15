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

const VideoForNft: FC<VideoForNftProps> = ({
  nftId,
  className = "absolute inset-0 z-20 flex items-center justify-center bg-neutral-700 rounded-3xl overflow-hidden",
  src = "./nft.mp4",
}) => {
  const currentMediaRunning = useAppSelector(selectCurrentMediaRunning);
  const [show, setShow] = useState(false);

  useEffect(() => {
    console.log("VideoForNft() src ==> ", src);
  }, [src]);

  const IS_PLAY =
    currentMediaRunning.nftId === nftId &&
    currentMediaRunning.state === "playing";

  if (!IS_PLAY) {
    return null;
  }

  const renderContent = (newClass = "", controls = true) => {
    return (
      <div
        className={`${className} ${newClass} ${
          IS_PLAY ? "" : "opacity-0 z-[-1]"
        }`}
        title="Play"
        dangerouslySetInnerHTML={{
          __html: `<video className="w-full h-full" playsinline autoplay loop ${
            controls && "controls"
          }>
                    <source src=${src} type="video/mp4" />
                    our browser does not support the video tag.
                  </video>`,
        }}
      />
    );
  };

  return (
    <>
      {renderContent()}
      <IconButton
        className="!absolute right-3 top-3 z-20 !bg-black/50"
        onClick={() => setShow(true)}
      >
        <BiFullscreen size={23} />
      </IconButton>
      <NcModal
        isOpenProp={show}
        onCloseModal={() => setShow(false)}
        contentExtraClass="max-w-5xl"
        renderContent={() => renderContent("w-full relative", true)}
        renderTrigger={() => null}
        isHeader={false}
      />
    </>
  );
};

export default VideoForNft;
