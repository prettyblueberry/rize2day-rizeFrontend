import { Fragment, useState, useEffect } from "react";
import { Popover, Transition } from "@headlessui/react";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import userIcon from "images/icons/user-icon.svg";
import defaultAvatar from "images/default_avatar.png";
import Avatar from "shared/Avatar/Avatar";
import { config } from "app/config.js";
import { AiOutlineUser, AiOutlineMessage, AiFillEye } from 'react-icons/ai';
import { FiActivity, FiSettings, FiLogOut, FiHelpCircle } from 'react-icons/fi';
import { MdOutlineCreateNewFolder } from 'react-icons/md';
import { useSigningClient } from "app/cosmwasm";
import { isEmpty } from "app/methods";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { changeAuthor, changeChainId, changeGlobalProvider, changeWalletAddress, changeWalletStatus, selectCurrentUser } from "app/reducers/auth.reducers";
import Tutorial from "components/Settings/setting";


export default function AvatarDropdown() {
  const { loadClient, connectWallet, disconnect, walletAddress }: any = useSigningClient();

  const dispatch = useAppDispatch();
  const globalUser = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();
  const [tutorial, setTutorial] = useState(false);

  useEffect(() => {
    loadWeb3();
  }, []);

  const loadWeb3 = async () => {
    await loadClient();

    let account = localStorage.getItem('address');
    if (account) {
      await connectWallet();
    }
  }

  const compressWalletAddr = (defultAddr: string) => {
    if (!isEmpty(defultAddr)) return defultAddr.substring(0, 11) + "..." + defultAddr.substring(defultAddr.length - 4, defultAddr.length);
    return ""
  }

  const onClickLogout = async () => {
    localStorage.removeItem("jwtToken");
    dispatch(changeAuthor({}));
    dispatch(changeWalletAddress(""));
    dispatch(changeChainId(0));
    dispatch(changeGlobalProvider({}));

    await disconnect();
    dispatch(changeWalletStatus(false));
    dispatch({ type: "LOGIN_OUT" });
    localStorage.removeItem("address");

    navigate("/page-search");
  }

  return (
    <div className="AvatarDropdown">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <IconButton sx={{
                border: '4px solid #33FF00'
              }}>
                <img src={userIcon} />
              </IconButton>
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
              <Popover.Panel className="absolute z-10 w-screen max-w-[260px] px-4 mt-3 -right-10 sm:right-0 sm:px-0">
                <div className="overflow-hidden shadow-lg rounded-3xl ring-1 ring-black ring-opacity-5">
                  <div className="relative grid grid-cols-1 gap-6 px-6 bg-white dark:bg-neutral-800 py-7">
                    {/* <div className="flex items-center space-x-3">
                      <Avatar imgUrl={!isEmpty(globalUser) && !isEmpty(globalUser?.avatar) ? `${config.API_URL}uploads/${globalUser?.avatar}` : defaultAvatar} sizeClass="w-12 h-12" />

                      <div className="flex-grow">
                        <h4 className="font-semibold">{!isEmpty(globalUser) && !isEmpty(globalUser?.username) ? globalUser?.username : ""}</h4>
                        <p className="text-xs mt-0.5">{!isEmpty(globalUser) && !isEmpty(globalUser?.address) ? compressWalletAddr(globalUser?.address || "") : ""}</p>
                      </div>
                    </div>

                    <div className="w-full border-b border-neutral-200 dark:border-neutral-600" /> */}

                    {/* ------------------ 1 --------------------- */}
                    <div
                      onClick={() => navigate(`/page-author/${globalUser?._id || "1"}`)}
                      className="flex items-center p-2 -m-3 transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    >
                      <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                        <AiOutlineUser size={22} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium ">{"My Profile"}</p>
                      </div>
                    </div>

                    <div
                      onClick={() => navigate(`/message`)}
                      className="flex items-center p-2 -m-3 transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    >
                      <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                        <AiOutlineMessage size={22} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium ">{"Messages"}</p>
                      </div>
                    </div>

                    <div
                      onClick={() => navigate("/collectionList")}
                      className="flex items-center p-2 -m-3 transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    >
                      <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2.67004 18.9501L7.60004 15.6401C8.39004 15.1101 9.53004 15.1701 10.24 15.7801L10.57 16.0701C11.35 16.7401 12.61 16.7401 13.39 16.0701L17.55 12.5001C18.33 11.8301 19.59 11.8301 20.37 12.5001L22 13.9001"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium ">{"My Collections"}</p>
                      </div>
                    </div>

                    <div
                      onClick={() => { }}
                      className="flex items-center p-2 -m-3 transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    >
                      <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                        <AiFillEye size={22} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium ">{"Watchlist"}</p>
                      </div>
                    </div>

                    {/* ------------------ 2 --------------------- */}
                    {/* <div
                      onClick={() => navigate("/account")}
                      className="flex items-center p-2 -m-3 transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    >
                      <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19.2101 15.74L15.67 19.2801C15.53 19.4201 15.4 19.68 15.37 19.87L15.18 21.22C15.11 21.71 15.45 22.05 15.94 21.98L17.29 21.79C17.48 21.76 17.75 21.63 17.88 21.49L21.42 17.95C22.03 17.34 22.32 16.63 21.42 15.73C20.53 14.84 19.8201 15.13 19.2101 15.74Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M18.7001 16.25C19.0001 17.33 19.84 18.17 20.92 18.47"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M3.40991 22C3.40991 18.13 7.25994 15 11.9999 15C13.0399 15 14.0399 15.15 14.9699 15.43"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium ">{"Edit profile"}</p>
                      </div>
                    </div> */}

                    <div
                      onClick={() => navigate(`/createCollection`)}
                      className="flex items-center p-2 -m-3 transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    >
                      <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                        <MdOutlineCreateNewFolder size={22} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium ">{"Create"}</p>
                      </div>
                    </div>

                    <div
                      onClick={() => { }}
                      className="flex items-center p-2 -m-3 transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    >
                      <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                        <FiActivity size={22} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium ">{"Activity Log"}</p>
                      </div>
                    </div>

                    <div
                      onClick={() => setTutorial(true)}
                      className="flex items-center p-2 -m-3 transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    >
                      <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                        <FiHelpCircle size={22} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium ">{"Tutorial"}</p>
                      </div>
                    </div>

                    <div
                      onClick={() => { }}
                      className="flex items-center p-2 -m-3 transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    >
                      <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                        <FiSettings size={22} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium ">{"Settings"}</p>
                      </div>
                    </div>

                    {/* <div className="w-full border-b border-neutral-200 dark:border-neutral-600" />
                    <div

                      className="flex items-center p-2 -m-3 transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    >
                      <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.97 22C17.4928 22 21.97 17.5228 21.97 12C21.97 6.47715 17.4928 2 11.97 2C6.44715 2 1.97 6.47715 1.97 12C1.97 17.5228 6.44715 22 11.97 22Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 16.5C14.4853 16.5 16.5 14.4853 16.5 12C16.5 9.51472 14.4853 7.5 12 7.5C9.51472 7.5 7.5 9.51472 7.5 12C7.5 14.4853 9.51472 16.5 12 16.5Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M4.89999 4.92993L8.43999 8.45993"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M4.89999 19.07L8.43999 15.54"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19.05 19.07L15.51 15.54"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19.05 4.92993L15.51 8.45993"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium ">{"Help"}</p>
                      </div>
                    </div> */}

                    {
                      isEmpty(walletAddress) === false &&
                      <div
                        onClick={() => { onClickLogout() }}
                        className="flex items-center p-2 -m-3 transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                      >
                        <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                          <FiLogOut size={22} />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium ">
                            {
                              "Disconnect"
                            }
                          </p>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
      <Tutorial isModal={tutorial} setModal={setTutorial} />
    </div>
  );
}
