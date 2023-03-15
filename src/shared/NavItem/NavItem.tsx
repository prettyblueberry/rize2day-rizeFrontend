import React, { FC, ReactNode } from "react";
import twFocusClass from "utils/twFocusClass";

export interface NavItemProps {
  className?: string;
  radius?: string;
  onClick?: () => void;
  isActive?: boolean;
  renderX?: ReactNode;
  children?: React.ReactNode;
}

const NavItem: FC<NavItemProps> = ({
  className = "px-4 py-2 text-sm sm:text-sm sm:px-5 sm:py-2.5 capitalize",
  radius = "rounded-full",
  children,
  onClick = () => { },
  isActive = false,
  renderX,
}) => {
  return (
    <li className="nc-NavItem relative" data-nc-id="NavItem">
      {renderX && renderX}
      <button
        className={`block !leading-none font-medium whitespace-nowrap ${className} ${radius} ${isActive
          ? "bg-green-400 text-green-900 "
          : "text-green-400 hover:text-green-800 dark:hover:text-green-300 hover:bg-neutral-100/75 dark:hover:bg-neutral-800"
          } ${twFocusClass()}`}
        onClick={() => {
          onClick && onClick();
        }}
      >
        {children}
      </button>
    </li>
  );
};

export default NavItem;
