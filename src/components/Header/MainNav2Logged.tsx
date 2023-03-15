import { Fragment, FC, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Logo from "shared/Logo/Logo";
import { Popover, Transition } from "@headlessui/react";
import MenuBar from "shared/MenuBar/MenuBar";
import Message from "shared/Message/Message";
import { IoWalletOutline } from "react-icons/io5";
import AvatarDropdown from "./AvatarDropdown";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { useSigningClient } from "app/cosmwasm";
import axios from "axios";
import jwt_decode from "jwt-decode";
import md5 from "md5";
import { config } from "app/config.js";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "app/hooks";
import {
  changeWalletAddress,
  changeWalletStatus,
  changeAuthor,
} from "app/reducers/auth.reducers";
import {
  selectCurrentUser,
  selectWalletStatus,
} from "app/reducers/auth.reducers";
import { getShortAddress, isEmpty } from "app/methods";
import Settings from "components/Settings";
import NotifyDropdown from "./NotifyDropdown";

export interface MainNav2LoggedProps { }

const MainNav2Logged: FC<MainNav2LoggedProps> = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    client,
    signingClient,
    loadClient,
    connectWallet,
    walletAddress,
  }: any = useSigningClient();
  const [tabActive, setTabActive] = useState(0);
  const user = useAppSelector(selectCurrentUser);
  const walletStatus = useAppSelector(selectWalletStatus);
  const pagesRef = useRef(null);
  const chainRef = useRef(null);
  const [openState1, setOpenState1] = useState(false);
  const [openState2, setOpenState2] = useState(false);

  console.log(">>>>>>>", walletAddress);
  useEffect(() => {
    if (!isEmpty(walletAddress)) {
      dispatch(changeWalletStatus(true));
      const params = { address: "", password: "" };
      params.address = walletAddress;
      params.password = md5(walletAddress);
      Login(params);
    } else {
      dispatch(changeWalletStatus(false));
    }
  }, [walletAddress]);

  const Login = (params: any) => {
    axios({
      method: "post",
      url: `${config.baseUrl}users/login`,
      data: params,
    })
      .then(function (response) {
        if (response.data.code === 0) {
          //set the token to sessionStroage
          const token = response.data.token;
          localStorage.setItem("jwtToken", response.data.token);
          const decoded = jwt_decode(token);
          dispatch(changeWalletAddress(params.address));
          dispatch(changeAuthor((decoded as any)._doc));
          navigate("/");
        } else {
          dispatch(changeWalletAddress(""));
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    (async () => {
      try {
        if (!client) {
          await loadClient();
        }
      } catch (err) {
        setTimeout(() => loadClient(), 1000);
      }
    })();
  }, [client, loadClient]);

  useEffect(() => {
    (async () => {
      try {
        if (!signingClient && localStorage.getItem("address")) {
          await connectWallet();
        }
      } catch (err) {
        setTimeout(() => connectWallet(), 1000);
      }
    })();
  }, [signingClient, connectWallet]);

  const authenticate = async () => {
    await connectWallet();
  };

  let timeout1, timeout2; // NodeJS.Timeout
  const timeoutDuration = 400;

  const toggleMenu = (open, type) => {
    // log the current open state in React (toggle open state)

    // toggle the menu by clicking on buttonRef
    if (type === 'Pages') {
      setOpenState1((prev) => !prev)
      pagesRef?.current?.click() // eslint-disable-line
    } else {
      setOpenState2((prev) => !prev)
      chainRef?.current?.click()
    }
  }

  const onHover = (open, action, type) => {
    if (type === "Pages") {
      if (
        (!open && !openState1 && action === "onMouseEnter") ||
        (open && openState1 && action === "onMouseLeave")
      ) {
        // clear the old timeout, if any
        clearTimeout(timeout1)
        // open the modal after a timeout
        timeout1 = setTimeout(() => toggleMenu(open, type), timeoutDuration)
      }
    } else {
      if (
        (!open && !openState2 && action === "onMouseEnter") ||
        (open && openState2 && action === "onMouseLeave")
      ) {
        // clear the old timeout, if any
        clearTimeout(timeout2)
        // open the modal after a timeout
        timeout2 = setTimeout(() => toggleMenu(open, type), timeoutDuration)
      }
    }
  }

  return (
    <div className={`nc-MainNav2Logged relative z-10 ${"onTop "}`}>
      <div className="px-10 py-4 relative flex justify-between items-center space-x-4 xl:space-x-8">
        <div className="flex justify-start flex-grow items-center space-x-3 sm:space-x-8 lg:space-x-10">
          <Logo className="w-32" />
        </div>
        <div className="hidden lg:flex">
          <Popover className="relative">
            {({ open }) => (
              <div
              // onMouseEnter={() => onHover(open, "onMouseEnter", 'Pages')}
              // onMouseLeave={() => onHover(open, "onMouseLeave", 'Pages')}
              >
                <Popover.Button
                  ref={pagesRef}
                  className={`${open ? "" : "text-opacity-90"} group py-3 px-6 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full inline-flex items-center text-base font-medium hover:text-opacity-100 relative !outline-none`}
                >
                  Pages
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute z-10 w-44 max-w-xs sm:max-w-sm px-6 mt-3 -right-28 top-[40px] sm:right-0 sm:px-0">
                    <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="relative grid gap-2 bg-white dark:bg-neutral-800 px-2 py-5">
                        <Link to={"/"} className="inset-0 py-2 px-4 dark:text-white text-neutral-900 transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700">Marketplace</Link>
                        <Link to={"/"} className="inset-0 py-2 px-4 dark:text-white text-neutral-900 transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700">Lock</Link>
                        <Link to={"/"} className="inset-0 py-2 px-4 dark:text-white text-neutral-900 transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700">Bdige</Link>
                        <Link to={"/"} className="inset-0 py-2 px-4 dark:text-white text-neutral-900 transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700">Vote</Link>
                        <Link to={"/"} className="inset-0 py-2 px-4 dark:text-white text-neutral-900 transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700">LLE</Link>
                        <Link to={"/"} className="inset-0 py-2 px-4 dark:text-white text-neutral-900 transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700">Core Dex</Link>
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </div>
            )}
          </Popover>

          <Popover className="relative">
            {({ open }) => (
              <div
              // onMouseEnter={() => onHover(open, "onMouseEnter", "Chains")}
              // onMouseLeave={() => onHover(open, "onMouseLeave", "Chains")}
              >
                <Popover.Button
                  ref={chainRef}
                  className={`${open ? "" : "text-opacity-90"} group py-3 px-6 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full inline-flex items-center text-base font-medium hover:text-opacity-100 relative !outline-none`}
                >
                  Chains
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute z-10 w-44 max-w-xs sm:max-w-sm px-6 mt-3 -right-28 top-[40px] sm:right-0 sm:px-0">
                    <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="relative grid gap-2 bg-white dark:bg-neutral-800 px-2 py-5">
                        <div className="py-2 px-2 transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 flex gap-2 items-center">
                          <img src="/images/icons/core.png" className="w-[30px] h-[30px]" width={30} height={30} alt=""></img>
                          <span className="dark:text-white text-neutral-900">Coreum</span>
                        </div>
                        <div className="py-2 px-2 transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 flex gap-2 items-center">
                          <img src="/images/icons/eth.png" className="w-[30px] h-[30px]" width={30} height={30} alt=""></img>
                          <span className="dark:text-white text-neutral-900">Ethereum</span>
                        </div>
                        <div className="py-2 px-2 transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 flex gap-2 items-center">
                          <img src="/images/icons/bsc.png" className="w-[30px] h-[30px]" width={30} height={30} alt=""></img>
                          <span className="dark:text-white text-neutral-900">BSC</span>
                        </div>
                        <div className="py-2 px-2 transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 flex gap-2 items-center">
                          <img src="/images/icons/polygon.png" className="w-[30px] h-[30px]" width={30} height={30} alt=""></img>
                          <span className="dark:text-white text-neutral-900">Polygon</span>
                        </div>
                        <div className="py-2 px-2 transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 flex gap-2 items-center">
                          <img src="/images/icons/avax.png" className="w-[30px] h-[30px]" width={30} height={30} alt=""></img>
                          <span className="dark:text-white text-neutral-900">Avalanche</span>
                        </div>
                        <div className="py-2 px-2 transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 flex gap-2 items-center">
                          <img src="/images/icons/near.png" className="w-[30px] h-[30px]" width={30} height={30} alt=""></img>
                          <span className="dark:text-white text-neutral-900">Near</span>
                        </div>
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </div>
            )}
          </Popover>
          <Settings />
        </div>

        <ButtonPrimary
          onClick={() => {
            authenticate();
          }}
          sizeClass="px-4 py-2 sm:px-5"
        >
          <IoWalletOutline size={22} />
          {isEmpty(walletAddress) == false && walletStatus == true ? (
            <span className="pl-2">{getShortAddress(walletAddress)}</span>
          ) : (
            <span className="pl-2">Wallet connect</span>
          )}
        </ButtonPrimary>

        {!isEmpty(walletAddress) && (
          <AvatarDropdown />
        )}

        <div className="flex items-center space-x-3 lg:hidden">
          <MenuBar />
        </div>

        {/* <div className="flex-shrink-0 flex items-center justify-end text-neutral-700 dark:text-neutral-100 space-x-1">
          <div className="hidden items-center xl:flex space-x-2">
            <div>
              <ul className="hidden sm:flex sm:space-x-2 relative w-full overflow-x-auto text-md md:text-base hiddenScrollba cursor-pointer">
                <li
                  className={
                    tabActive === 0
                      ? "text-primary-1000 px-2 sm:px-5  py-2"
                      : "text-primary-1000 px-2 sm:px-5 py-2 hover:text-green-300"
                  }
                  onClick={() => {
                    setTabActive(0);
                    navigate("/");
                  }}
                >
                  <span>Home</span>
                </li>
                <li
                  className={
                    tabActive === 1
                      ? "text-primary-1000 px-2 sm:px-5 py-2"
                      : "text-primary-1000 px-2 sm:px-5 py-2 hover:text-green-300"
                  }
                  onClick={() => {
                    setTabActive(1);
                    navigate("/page-search");
                  }}
                >
                  <span>Marketplace</span>
                </li>
              </ul>
            </div>
            {isEmpty(walletAddress) == false && walletStatus == true ? (
              <ButtonPrimary
                onClick={() => {
                  navigate("/createCollection");
                }}
                sizeClass="px-4 py-2 sm:px-5"
              >
                Create collection
              </ButtonPrimary>
            ) : (
              <ButtonPrimary
                onClick={() => {
                  authenticate();
                }}
                sizeClass="px-4 py-2 sm:px-5"
              >
                <IoWalletOutline size={22} />
                <span className="pl-2">Wallet connect</span>
              </ButtonPrimary>
            )}
            <div className="hidden sm:block h-6 border-l border-neutral-300 dark:border-neutral-6000"></div>
            <div className="flex">
              <Settings />
              <NotifyDropdown />
              {!isEmpty(user) && <Message />}
            </div>
            <div></div>
            <AvatarDropdown />
          </div>
          <div className="flex items-center space-x-3 xl:hidden">
            <NotifyDropdown />
            {!isEmpty(user) && <Message />}
            <AvatarDropdown />
            <MenuBar />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default MainNav2Logged;
