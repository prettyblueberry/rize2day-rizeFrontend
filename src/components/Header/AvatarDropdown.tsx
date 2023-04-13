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
                onClick={_toogleDarkMode}
                className="flex items-center p-2 -m-3 transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
              >
                <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                  {!isDarkMode ? (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.03009 12.42C2.39009 17.57 6.76009 21.76 11.9901 21.99C15.6801 22.15 18.9801 20.43 20.9601 17.72C21.7801 16.61 21.3401 15.87 19.9701 16.12C19.3001 16.24 18.6101 16.29 17.8901 16.26C13.0001 16.06 9.00009 11.97 8.98009 7.13996C8.97009 5.83996 9.24009 4.60996 9.73009 3.48996C10.2701 2.24996 9.62009 1.65996 8.37009 2.18996C4.41009 3.85996 1.70009 7.84996 2.03009 12.42Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 18.5C15.5899 18.5 18.5 15.5899 18.5 12C18.5 8.41015 15.5899 5.5 12 5.5C8.41015 5.5 5.5 8.41015 5.5 12C5.5 15.5899 8.41015 18.5 12 18.5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19.14 19.14L19.01 19.01M19.01 4.99L19.14 4.86L19.01 4.99ZM4.86 19.14L4.99 19.01L4.86 19.14ZM12 2.08V2V2.08ZM12 22V21.92V22ZM2.08 12H2H2.08ZM22 12H21.92H22ZM4.99 4.99L4.86 4.86L4.99 4.99Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium ">{isDarkMode ? "Light Mode" : "Dark Mode"}</p>
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
