import { Popover, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState, useRef } from "react";
import Avatar from "shared/Avatar/Avatar";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { config } from "app/config";
import { socket } from "App";
import { useNavigate } from "react-router";
import moment from "moment";
import {
  changeNotifyList,
  selectNotifyList,
} from "app/reducers/notify.reducers";
import { selectCurrentUser } from "app/reducers/auth.reducers";
import { useAppDispatch } from "app/hooks";
import { useAppSelector } from "app/hooks";

const NotifyDropdown = () => {
  const [visible, setVisible] = useState(false);
  const notifiesList = useAppSelector(selectNotifyList);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const [hasNew, setHasNew] = useState(false);
  const [randomKey, setRandomKey] = useState(1);
  const userRef = useRef();

  useEffect(() => {
    if ((user as any)._id) {
      console.log("user._id ===> ", user._id);
      userRef.current = (user as any)._id;
      getNotifiesByLimit(50, userRef.current);
    }
  }, [user]);

  useEffect(() => {
    if (notifiesList) {
      var temp = false;
      for (var i = 0; i < notifiesList.length; i++) {
        if (notifiesList[i].is_new === true) {
          temp = true;
          break;
        }
      }
      setHasNew(temp);
      setRandomKey(Math.random());
    }
  }, [notifiesList]);

  useEffect(() => {
    socket.on("UpdateStatus", (data) => {
      console.log("NotifyFetching ===> ", data);
      console.log("userId ===> ", userRef.current);
      console.log("UpdateStatus ===> ", data);
      if (userRef.current) {
        console.log("update notifies list");
        getNotifiesByLimit(50, userRef.current);
      }
    });
  }, []);

  const getNotifiesByLimit = (limit, userId, filter = []) => {
    axios
      .post(
        `${config.baseUrl}notify/getlist`,
        { limit, userId, filter },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then((result) => {
        console.log(
          "[getNotifiesByLimit action ] result.data.data  = ",
          result.data.data
        );

        dispatch(changeNotifyList(result.data.data));
      })
      .catch(() => {});
  };

  const goDetail = (url) => {
    navigate(url);
  };

  return (
    <div className="">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                ${open ? "" : "text-opacity-90"}
                 group  p-3 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full inline-flex items-center text-base font-medium hover:text-opacity-100
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 relative`}
            >
              {notifiesList && notifiesList.length > 0 && (
                <span className="w-2 h-2 bg-green-400 absolute top-2 right-2 rounded-full"></span>
              )}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 6.43994V9.76994"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                />
                <path
                  d="M12.02 2C8.34002 2 5.36002 4.98 5.36002 8.66V10.76C5.36002 11.44 5.08002 12.46 4.73002 13.04L3.46002 15.16C2.68002 16.47 3.22002 17.93 4.66002 18.41C9.44002 20 14.61 20 19.39 18.41C20.74 17.96 21.32 16.38 20.59 15.16L19.32 13.04C18.97 12.46 18.69 11.43 18.69 10.76V8.66C18.68 5 15.68 2 12.02 2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                />
                <path
                  d="M15.33 18.8201C15.33 20.6501 13.83 22.1501 12 22.1501C11.09 22.1501 10.25 21.7701 9.65004 21.1701C9.05004 20.5701 8.67004 19.7301 8.67004 18.8201"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                />
              </svg>
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
              <Popover.Panel className="absolute z-10 w-screen max-w-xs sm:max-w-sm px-4 mt-3 -right-28 sm:right-0 sm:px-0">
                <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative grid gap-8 bg-white dark:bg-neutral-800 p-7">
                    <h3 className="text-xl font-semibold">Notifications</h3>
                    {notifiesList &&
                      notifiesList.length > 0 &&
                      notifiesList.slice(0, 4).map((item, index) => (
                        <div
                          key={index}
                          onClick={() => goDetail(item.url)}
                          className="flex p-2 pr-8 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 relative"
                        >
                          <Avatar
                            sizeClass="w-8 h-8 sm:w-12 sm:h-12"
                            imgUrl={
                              item.imgUrl.toString().includes(".") === true
                                ? `${config.API_URL}uploads/${item.imgUrl}`
                                : `${config.ipfsGateway}${item.imgUrl}`
                            }
                          />
                          <div className="ml-3 sm:ml-4 space-y-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                              {item.subTitle}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              {item.description}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-400">
                              {item.date
                                ? moment(item.date).format(
                                    "YYYY-MM-DD HH:mm:ss"
                                  )
                                : ""}
                            </p>
                          </div>
                          <span className="absolute right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-green-400"></span>
                        </div>
                      ))}
                  </div>
                  {notifiesList && notifiesList.length > 0 ? (
                    <div
                      className={`button bg-white dark:bg-neutral-800 text-center pb-5 hover:text-green-400 cursor-pointer`}
                      onClick={() => {
                        navigate("/activity");
                      }}
                    >
                      See all
                    </div>
                  ) : (
                    <div
                      className={`button bg-white dark:bg-neutral-800 text-center pb-5 hover:text-green-400 `}
                    >
                      No notifiation
                    </div>
                  )}
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};

export default NotifyDropdown;
