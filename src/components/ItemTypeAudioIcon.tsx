import React from "react";
import { AiOutlineAudio } from 'react-icons/ai';

export interface ItemType3DIconProps {
  className?: string;
}

const ItemType3DIcon: React.FC<ItemType3DIconProps> = ({
  className = "w-8 h-8 md:w-10 md:h-10",
}) => {
  return (
    <div
      className={`bg-black/50  flex items-center justify-center rounded-full text-white ${className}`}
    >
      <AiOutlineAudio size={22} />
    </div>
  );
};

export default ItemType3DIcon;
