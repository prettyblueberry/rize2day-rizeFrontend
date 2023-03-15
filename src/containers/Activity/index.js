import React, { useEffect, useState, useRef } from "react";
import cn from "classnames";
import Filters from "./Filters";
import { changeNotifyList } from "app/reducers/notify.reducers";
import { config } from "app/config";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { selectNotifyList } from "app/reducers/notify.reducers";
import { selectCurrentUser } from "app/reducers/auth.reducers";
import axios from "axios";

const _breadcrumbs = [
  // {
  //   title: "Profile",
  //   url: "/profile",
  // },
  // {
  //   title: "Activity",
  // },
];

const items = [
  {
    title: "Something went wrong",
    description: "Can't display activity card. Try again later",
    date: "2 days ago",
    image: "/images/content/activity-pic-1.jpg",
    icon: "/images/content/flag.svg",
    color: "#EF466F",
  },
];

const filters = [
  "Sales",
  "Listings",
  "Bids",
  "Burns",
  "Followings",
  "Likes",
  "Purchase",
  "Transfers",
];

const navLinks = ["My activity", "Following", "All activity"];

const Activity = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [visible, setVisible] = useState(0);
  const notifiesList = useAppSelector(selectNotifyList);
  const currentUsr = useAppSelector(selectCurrentUser);
  const userRef = useRef();

  const [breadcrumbs, setBreadCrumbs] = useState(_breadcrumbs);
  const navigate = useNavigate();

  // useEffect(() => {
  //   var temp = breadcrumbs;
  //   temp[0].url = `/profile/${userRef.current}`;
  //   setBreadCrumbs(temp);
  // }, [currentUsr, breadcrumbs])

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentUsr) {
      userRef.current = currentUsr._id;
      getNotifiesByLimit(50, userRef.current);
    }
  }, [currentUsr]);

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

  const markAllAsRead = (notifyIds, userId) => {
    axios
      .post(
        `${config.baseUrl}notify/markAllAsRead`,
        { notifyIds, userId },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then((result) => {
        console.log("markAllAsRead ===> ", result.data);
        setTimeout(() => {
          getNotifiesByLimit(50, userRef.current);
        }, 2000);
      })
      .catch(() => {});
  };

  const onClickMarkAllAsRead = () => {
    if (notifiesList && notifiesList.length > 0) {
      let idList = [];
      let j;
      for (j = 0; j < notifiesList.length; j++)
        idList.push(notifiesList[j]._id);
      markAllAsRead(idList, userRef.current);
      dispatch(changeNotifyList());
    }
  };

  useEffect(() => {
    var reshapedFilters = [];
    if (selectedFilters && selectedFilters.length > 0) {
      for (var j = 0; j < selectedFilters.length; j++) {
        switch (selectedFilters[j]) {
          default:
            break;
          case "Sales":
            reshapedFilters.push(1);
            break;
          case "Listings":
            reshapedFilters.push(2);
            break;
          case "Bids":
            reshapedFilters.push(3);
            break;
          case "Burns":
            reshapedFilters.push(4);
            break;
          case "Followings":
            reshapedFilters.push(5);
            break;
          case "Likes":
            reshapedFilters.push(6);
            break;
          case "Purchase":
            reshapedFilters.push(7);
            break;
          case "Transfers":
            reshapedFilters.push(8);
            break;
        }
      }
    }
    getNotifiesByLimit(50, userRef.current, reshapedFilters);
  }, [selectedFilters, currentUsr, dispatch]);

  useEffect(() => {
    if (activeIndex === 1) {
      getNotifiesByLimit(50, userRef.current, [5]);
    } else {
      getNotifiesByLimit(50, userRef.current);
    }
  }, [activeIndex, dispatch, currentUsr]);

  const goDetail = (url) => {
    navigate(url);
  };

  return (
    <div className="">
      <div className="pt-[80px]">
        <div className="container flex justify-center">
          <div className="flex ">
            <div className="flex-wrap md:min-w-[500px] md:mr-5">
              <div className={"mb-5"}>
                {navLinks &&
                  navLinks.length > 0 &&
                  navLinks.map((x, index) => (
                    <button
                      className={` px-4 py-2 ${
                        index === activeIndex
                          ? " bg-green-400 text-white rounded-xl p-1"
                          : "text-green-400"
                      }`}
                      onClick={() => setActiveIndex(index)}
                      key={index}
                    >
                      {x}
                    </button>
                  ))}
              </div>
              <div className="max-h-[65vh] overflow-y-auto">
                {notifiesList && notifiesList.length > 0 ? (
                  notifiesList.map((x, index) => (
                    <div
                      className="py-1 flex"
                      key={index}
                      onClick={() => {
                        goDetail(x.url);
                      }}
                    >
                      <div className=" w-8 h-8 sm:w-12 sm:h-12 m-4">
                        <img
                          src={
                            x.imgUrl.toString().includes(".") === true
                              ? `${config.API_URL}uploads/${x.imgUrl}`
                              : `${config.ipfsGateway}${x.imgUrl}`
                          }
                          alt="Notification"
                        />
                      </div>
                      <div className="ml-3 sm:ml-4 space-y-1">
                        <div className="md:text-xl sm:text-md text-gray-900 dark:text-gray-200">
                          {x.subTitle}
                        </div>
                        <div className="md:text-lg sm:text-sm text-gray-500 dark:text-gray-400">
                          {x.description}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-400">
                          {x.date
                            ? moment(x.date).format("YYYY-MM-DD HH:mm:ss")
                            : ""}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <></>
                )}
              </div>
              <div className="my-10 flex justify-center ">
                <button
                  className="button-stroke button-small mobile-show bg-green-400 px-4 py-2 rounded-3xl"
                  onClick={() => onClickMarkAllAsRead()}
                >
                  Mark all as read
                </button>
              </div>
            </div>
            <Filters
              className={"min-w-[350px] p-6 rounded-xl border-2 max-h-[60vh]"}
              filters={filters}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activity;
