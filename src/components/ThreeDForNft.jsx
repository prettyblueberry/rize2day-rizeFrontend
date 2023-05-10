import { useState } from "react";
import { useAppSelector } from "app/hooks";
import { ErrorBoundary } from "react-error-boundary";
import { selectCurrentMediaRunning } from "app/mediaRunning/mediaRunning";
import { BiFullscreen } from "react-icons/bi";
import { IconButton } from "@mui/material";
import NcModal from "shared/NcModal/NcModal";
import ReactLoading from 'react-loading';
import bgImg from '../images/3dbg.jpg';

const NFT3Canvas = ({
  nftId,
  className = "absolute inset-0 z-20 flex items-center justify-center bg-neutral-700 rounded-3xl overflow-hidden",
  src = "./",
}) => {
  const [show, setShow] = useState(false);
  const currentMediaRunning = useAppSelector(selectCurrentMediaRunning);
  const IS_PLAY =
    currentMediaRunning.nftId === nftId &&
    currentMediaRunning.state === "playing";

  if (!IS_PLAY) return <></>;

  const renderContent = (newClass = "", content = true) => {
    return (
      <div
        className={`${className} ${newClass} ${IS_PLAY ? "" : "opacity-0 z-[-1]"
          }`}
      >
        <ErrorBoundary
          FallbackComponent={({ error }) => (
            <div>
              <p className="text-white">Can't open the file</p>
            </div>
          )}
        >
          {content && (
            <model-viewer
              src={src}
              skybox-image={bgImg}
              camera-controls
              shadow-intensity="1"
              autoplay
              ar
              ar-modes="webxr scene-viewer quick-look"
              ar-status="not-presenting"
              interaction-prompt="none"
              alt="An animated 3D model of a robot"
              style={{ width: '100%', height: '100%' }}
            >
              <div className="model-viewer-loader" slot="poster">
                <ReactLoading type="bubbles" color="#fff" />
              </div>
            </model-viewer>
          )}
        </ErrorBoundary>
      </div>
    );
  };

  return (
    <>
      {renderContent("", !show)}
      <IconButton
        className="!absolute right-3 top-3 z-20 !bg-black/50"
        onClick={() => setShow(true)}
      >
        <BiFullscreen size={23} />
      </IconButton>
      <NcModal
        isOpenProp={show}
        onCloseModal={() => setShow(false)}
        contentPaddingClass="w-full h-full py-4 px-6 md:py-5"
        contentExtraClass="max-w-4xl w-full aspect-[4/3]"
        renderContent={() => renderContent("w-full h-full relative")}
        renderTrigger={() => null}
        isHeader={false}
      />
    </>
  );
};
export default NFT3Canvas;