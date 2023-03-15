import React, { FC, useEffect } from "react";
import Logo from "shared/Logo/Logo";
import MenuBar from "shared/MenuBar/MenuBar";
import SwitchDarkMode from "shared/SwitchDarkMode/SwitchDarkMode";
import Input from "shared/Input/Input";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import Navigation from "shared/Navigation/Navigation";
import { useSigningClient } from "app/cosmwasm";
import axios from "axios";
import { toast } from 'react-toastify';
import jwt_decode from "jwt-decode";
import md5 from "md5";
import { config } from "app/config.js"
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { isEmpty } from "app/methods";

export interface MainNav2Props { }

const MainNav2: FC<MainNav2Props> = () => {
  const { loadClient, connectWallet, disconnect, walletAddress }: any = useSigningClient();

  return (
    <div className={`nc-MainNav2 relative z-10 ${"onTop "}`}>
      <div className="container py-2 relative flex justify-between items-center space-x-4 xl:space-x-8">
        <div className="flex justify-start flex-grow items-center space-x-3 sm:space-x-8 lg:space-x-10">
          <Logo />
          <ul className="mainmenu flex cursor-pointer">
            <li className="font-medium text-neutral-700 dark:text-neutral-100 px-2 "
              onClick={() => {  }}
            >
              Home
            </li>
            <li className="font-medium text-neutral-700 dark:text-neutral-100 px-2"
              onClick={() => {  }}
            >
              Marketplace
            </li>
            <li className="font-medium text-neutral-700 dark:text-neutral-100 px-2"
              onClick={() => {  }}
            >
              Airdrop
            </li>
          </ul>
        </div>
        <div className="flex-shrink-0 flex items-center justify-end text-neutral-700 dark:text-neutral-100 space-x-1">
          <div className="hidden items-center xl:flex space-x-2">
            <div></div>
            {walletAddress ? (
              <ButtonPrimary
                onClick={() => {  }}
                sizeClass="px-4 py-2 sm:px-5"
              >
                Create
              </ButtonPrimary>
            ) : (
              <ButtonPrimary
                onClick={() => {  }}
                sizeClass="px-4 py-2 sm:px-5"
              >
                Wallet connect
              </ButtonPrimary>
            )}
            <div className="hidden sm:block h-10 border-l border-neutral-300 dark:border-neutral-6000"></div>
            <SwitchDarkMode />
            <ButtonPrimary
              href={"/page-upload-item"}
              sizeClass="px-4 py-2 sm:px-5"
            >
              Create
            </ButtonPrimary>
            <ButtonSecondary
              href={"/connect-wallet"}
              sizeClass="px-4 py-2 sm:px-5"
            >
              Connect Wallet
            </ButtonSecondary>
          </div>
          <div className="flex items-center space-x-1.5 xl:hidden">
            <ButtonPrimary
              href={"/page-upload-item"}
              sizeClass="px-4 py-2 sm:px-5"
            >
              Create
            </ButtonPrimary>
            <MenuBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNav2;
