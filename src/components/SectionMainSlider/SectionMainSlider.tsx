import clsx from 'clsx';
import Marquee3D from "components/Marquee3D"
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { useNavigate } from "react-router-dom";

const SectionMainSlider = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="relative flex flex-col items-center justify-center mt-5 mb-10">
        <p className="text-5xl font-semibold mb-4 text-neutral-900 dark:text-white">Rize Limited NFTs</p>
        <p className="text-base w-1/2 text-center mb-6 text-neutral-900 dark:text-white">A limited collection of 100 Stelliforms; 3D meditative sculptures that contain unique
          form, movement, and material compositions. Fully interoperable and XR ready.</p>
        <ButtonPrimary onClick={() => navigate('page-search')}>VIEW ALL NFTS</ButtonPrimary>
      </div>
      <div className={clsx("absolute bg-[#33FF00] opacity-30 blur-[100px] w-[300px] h-[300px] rounded-full -top-[100px] -left-[100px]")}></div>
      <Marquee3D />
    </>
  )
}

export default SectionMainSlider;