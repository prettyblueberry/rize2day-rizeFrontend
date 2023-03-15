import clsx from 'clsx';
import greenHand from "images/greenhand.svg";
import Particle from 'components/Particles';

const SectionMainHeader = () => {

  return (
    <div className="relative flex flex-col items-center justify-center mt-5 mb-10 min-h-[550px]">
      <div className={clsx("absolute bg-[#33FF00] opacity-30 blur-[100px] w-[300px] h-[300px] rounded-full top-[0px] -left-[120px]")}></div>
      <img className='z-10' src={greenHand} alt="" width={400} />
      <div className="absolute top-0 bottom-0 m-auto flex items-center z-10">
        <p className="text-center text-4xl sm:text-5xl md:text-7xl mb-10">Gather Create Evolve</p>
      </div>
      <div className="w-full h-[100px] bg-[#0d2e1a80]"></div>
      <Particle />
    </div>
  )
}

export default SectionMainHeader;