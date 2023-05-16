import React from "react";
import Logo from "shared/Logo/Logo";
import { Link } from "react-router-dom";
import SocialsList1 from "shared/SocialsList1/SocialsList1";
import { CustomLink } from "data/types";
import Label from "components/Label/Label";
import Input from "shared/Input/Input";
import ButtonPrimary from "shared/Button/ButtonPrimary";

export interface WidgetFooterMenu {
  id: string;
  title: string;
  menus: CustomLink[];
}

const widgetMenus: WidgetFooterMenu[] = [
  {
    id: "5",
    title: "Getting started",
    menus: [
      { href: "#", label: "Installation" },
      { href: "#", label: "Release Notes" },
      { href: "#", label: "Upgrade Guide" },
      { href: "#", label: "Browser Support" },
      { href: "#", label: "Editor Support" },
      { href: "#", label: "Dark Mode" },
    ],
  },
  {
    id: "1",
    title: "Explore",
    menus: [
      { href: "#", label: "Design features" },
      { href: "#", label: "Prototyping" },
      { href: "#", label: "Design systems" },
      { href: "#", label: "Pricing" },
      { href: "#", label: "Customers" },
      { href: "#", label: "Security" },
    ],
  },
  {
    id: "2",
    title: "Resources",
    menus: [
      { href: "#", label: "Best practices" },
      { href: "#", label: "Support" },
      { href: "#", label: "Developers" },
      { href: "#", label: "Learn design" },
      { href: "#", label: "What's new" },
      { href: "#", label: "Releases" },
    ],
  },
  {
    id: "4",
    title: "Community",
    menus: [
      { href: "#", label: "Discussion Forums" },
      { href: "#", label: "Code of Conduct" },
      { href: "#", label: "Community Resources" },
      { href: "#", label: "Contributing" },
      { href: "#", label: "Concurrent Mode" },
      { href: "#", label: "API Reference" },
    ],
  },
];

const Footer: React.FC = () => {
  const renderWidgetMenuItem = (menu: WidgetFooterMenu, index: number) => {
    return (
      <div key={index} className="text-sm">
        <h2 className="font-semibold text-neutral-700 dark:text-neutral-200">
          {menu.title}
        </h2>
        <ul className="mt-5 space-y-4">
          {menu.menus.map((item, index) => (
            <li key={index}>
              <a
                key={index}
                className="text-neutral-6000 dark:text-neutral-300 hover:text-black dark:hover:text-white"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="nc-Footer relative dark:bg-[#131313] pt-0 pb-4">
      <div className="px-4">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-center md:justify-between pb-4 border-b border-neutral-200 dark:border-neutral-600">
          <div className="flex flex-col">
            <div className="flex items-end pt-6 pb-4 gap-4">
              <Logo className="w-40" />
              <p className="text-gray-700 h-full">Gather,&nbsp;&nbsp;Create,&nbsp;&nbsp;Evolve</p>
            </div>
            <div className="flex">
              <Link
                to={"/"}
                className="inset-0 -ml-2 py-2 px-4 dark:text-white text-neutral-900 text-sm transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                Dashboard
              </Link>
              <a
                target="_blank"
                href={"https://stake-coreum.rize2day.com/"}
                className="inset-0 py-2 px-4 dark:text-white text-neutral-900 text-sm transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                Stake Coreum
              </a>
              <Link
                to={"/"}
                className="inset-0 py-2 px-4 dark:text-white text-neutral-900 text-sm transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                Bridge
              </Link>
            </div>
            <SocialsList1 className="flex items-center gap-3 sm:gap-5 md:gap-8 lg:gap-8 pt-4" />
          </div>
          <div className="flex">
            <div className="mt-2">
              <Label>Join our newsletter</Label>
              <div className="mt-1.5 flex gap-4">
                <Input
                  className="!border-[#33FF00]"
                  placeholder="Enter your Email"
                  sizeClass="h-11 px-4 h-[45px]"
                />
                <ButtonPrimary className="rounded-xl h-[45px]" >Send</ButtonPrimary>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between py-2 items-center">
          <p className="mb-0">2023 Rize. All rights reserved</p>
          <div className="flex gap-2">
            <a
              target="_blank"
              href={"https://app.termly.io/document/terms-and-conditions/8654259c-7bb6-4800-bfad-813417b2c74c"}
              className="inset-0 py-2 px-4 dark:text-white text-neutral-900 text-sm transition cursor-pointer duration-150 ease-in-out rounded-lg"
            >
              Terms
            </a>
            <a
              target="_blank"
              href={"https://app.termly.io/document/privacy-policy/ba02f494-1ec5-4fde-a984-c32853f78c91"}
              className="inset-0 py-2 px-4 dark:text-white text-neutral-900 text-sm transition cursor-pointer duration-150 ease-in-out rounded-lg"
            >
              Privacy Policy
            </a>
          </div>
        </div>
        {/* {widgetMenus.map(renderWidgetMenuItem)} */}
      </div>
    </div>
  );
};

export default Footer;
