import { useRef, useState, Suspense } from "react";
import { useAppSelector } from "app/hooks";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls, useProgress, Html } from "@react-three/drei";
import { ErrorBoundary } from "react-error-boundary";
import { selectCurrentMediaRunning } from "app/mediaRunning/mediaRunning";
import { BiFullscreen } from "react-icons/bi";
import { IconButton } from "@mui/material";
import NcModal from "shared/NcModal/NcModal";
import * as THREE from "three";

const Loader = () => {
  const { active, progress, errors, item, loaded, total } = useProgress();

  console.log("progress ===> ", progress);

  return (
    <Html className="text-black" center>
      {progress} % loaded
    </Html>
  );
};

const ThreeDForNft = ({ src = "" }) => {
  let nscene;
  const mixerRef = useRef();

  useFrame((_, delta) => {
    mixerRef.current.update(delta);
  });

  const { scene, animations } = useLoader(GLTFLoader, src);
  nscene = scene;
  const mixer = new THREE.AnimationMixer(scene);
  mixerRef.current = mixer;
  animations.forEach((clip) => {
    const action = mixer.clipAction(clip);
    action.play();
  });

  return (
    <>
      <ambientLight intensity={0.6} color={"0xffffff"} />
      <pointLight position={[10, 10, 10]} />

      <Suspense fallback={<Loader />}>
        <primitive object={nscene} />
      </Suspense>

      <OrbitControls />
    </>
  );
};

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
        className={`${className} ${newClass} ${
          IS_PLAY ? "" : "opacity-0 z-[-1]"
        }`}
      >
        <ErrorBoundary
          FallbackComponent={({ error }) => (
            <div>
              <p className="text-white">Can't open the file</p>
            </div>
          )}
        >
          <Canvas
            camera={{
              position: [0, 0, 2],
              fov: 55,
            }}
            className={`${className}`}
          >
            {content && <ThreeDForNft src={src} />}
          </Canvas>
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