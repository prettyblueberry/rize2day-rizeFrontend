import { useEffect, useState } from "react";
import CardAuthorBox from "components/CardAuthorBox/CardAuthorBox";
import CardAuthorBox2 from "components/CardAuthorBox2/CardAuthorBox2";
import CardAuthorBox3 from "components/CardAuthorBox3/CardAuthorBox3";
import CardAuthorBox4 from "components/CardAuthorBox4/CardAuthorBox4";
import Heading from "components/Heading/Heading";
import NavItem2 from "components/NavItem2";
import React, { FC } from "react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import Nav from "shared/Nav/Nav";
import SortOrderFilter from "./SortOrderFilter";
import axios from "axios";
import { io } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from "app/hooks";
import { config } from "app/config";
import { changePopular, selectPopularUsers } from "app/reducers/user.reducers";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "app/reducers/auth.reducers";
import { changeFollow, changeFollowingList, changeFollowList } from "app/reducers/flollow.reducers";
import { toast } from "react-toastify";
import { isEmpty } from "app/methods";

const socket = io(`${config.socketUrl}`);

export interface SectionGridAuthorBoxProps {
  className?: string;
  sectionStyle?: "style1" | "style2";
  gridClassName?: string;
  boxCard?: "box1" | "box2" | "box3" | "box4";
  data?: any[];
}

const sortOrder = ["All", "Last 24 hours", "Last 7 days", "Last 30 days"];
const dateOptions = [{ value: 0, text: "All" }, { value: 1, text: "Last 24 hours" }, { value: 2, text: "Last 7 days" }, { value: 3, text: "Last 30 days" }];
const directionOptions = ["Sellers", "Buyers"];

const SectionGridAuthorBox: FC<SectionGridAuthorBoxProps> = ({
  className = "",
  boxCard = "box3",
  sectionStyle = "style1",
  gridClassName = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  data = Array.from("11111111"),
}) => {

  const [tabActive, setTabActive] = React.useState("Popular");
  const popular = useAppSelector(selectPopularUsers);
  const auth = useSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  const [date, setDate] = useState(sortOrder[0]);
  const [direction, setDirection] = useState(directionOptions[0]);
  const [items, setItems] = useState([]);

  const getPopularUserList = (time: any, limit: any) => {
    // time : timeframe, 0: all, 1: today, 2: this month, 3: 3 months, 4: year

    axios.post(`${config.API_URL}api/users/get_popular_user_list`, { limit: limit, time: time }, {
      headers:
      {
        "x-access-token": localStorage.getItem("jwtToken")
      }
    }).then((result) => {
      dispatch(changePopular(result.data.data))
    }).catch((error) => {
      // console.log("error:", error);
    })
  }

  useEffect(() => {
    getPopularUserList(dateOptions.find(item => item.text === date), 20);
  }, [date]);

  useEffect(() => {
    socket.on("UpdateStatus", data => {
      getPopularUserList(dateOptions.find(item => item.text === date), 20);
    });
  }, [])

  useEffect(() => {
    setUserList();
  }, [popular, direction]);

  const setUserList = () => {
    if (popular) {
      if (direction === "Sellers") {
        setItems((popular as any).seller);
      } else {
        setItems((popular as any).buyer);
      }
    }
  }

  const toggleFollow = (my_id: string, target_id: string) => {

    axios.post(`${config.API_URL}api/follow/toggle_follow`, { my_id, target_id }, {
      headers:
      {
        "x-access-token": localStorage.getItem("jwtToken")
      }
    }).then((result) => {
      dispatch(changeFollow(true));
    }).catch(() => {
      dispatch(changeFollow(false));
    });
  }

  const onToggleFollow = (index: number) => {
    if (auth && items) {
      toggleFollow(auth._id || "", (items[index] as any)?._id || "");
    }
  }

  const isFollowed = (item: any) => {
    if (!item || !item.follows) {
      return false;
    } else if (auth?._id) {
      var index = item.follows.findIndex((element: any) => {
        return element.toLowerCase() == auth?._id ? (auth as any)._id.toLowerCase() : "";
      });
      if (index != -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  const getFollowList = async (user_id: string, limit: number) => {
    if (isEmpty(user_id)) return;
    await axios.post(`${config.API_URL}api/follow/get_follows`,
      { limit: limit, my_id: user_id }, {
      headers:
      {
        "x-access-token": localStorage.getItem("jwtToken")
      }
    })
      .then((result) => {
        dispatch(changeFollowList(result.data.data || []));
      }).catch(() => {
      });
  }

  const getFollowingList = async (user_id: string, limit: number) => {
    if (isEmpty(user_id)) return;
    await axios.post(`${config.API_URL}api/follow/get_followings`,
      { limit: limit, my_id: user_id }, {
      headers:
      {
        "x-access-token": localStorage.getItem("jwtToken")
      }
    })
      .then((result) => {
        dispatch(changeFollowingList((result.data && result.data.data) ? result.data.data : []));
      }).catch(() => {
      });
  }

  const updateFollowings = () => {
    if (isEmpty(auth?._id || "")) return;
    getFollowList(auth?._id || "", 10)
    getFollowingList(auth?._id || "", 10)
  }

  const toggleFollowing = (targetId: string) => {
    if (isEmpty(targetId) || isEmpty(auth?._id)) {
      toast.warn("Please log in first.");
      return;
    }
    toggleFollow(auth?._id || "", targetId)
  }

  const renderCard = (x: any, index: number) => {

    return (
      <CardAuthorBox3 key={index} onUpdate={updateFollowings} onUnfollow={toggleFollowing} showingCardForPupularUsers={true}
        item={x} />
    )

  };

  const renderHeading1 = () => {
    return (
      <div className="flex flex-col justify-between mb-12 lg:mb-16 sm:flex-row">
        <Heading
          rightPopoverText="Creators"
          options={directionOptions}
          value={direction}
          setValue={setDirection}
          className="text-neutral-900 dark:text-neutral-50"
        >
          Top
        </Heading>
        <div className="mt-4 sm:mt-0">
          <SortOrderFilter
            value={date}
            setValue={setDate}
            options={sortOrder}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      className={`nc-SectionGridAuthorBox relative ${className}`}
      data-nc-id="SectionGridAuthorBox"
    >
      {renderHeading1()}
      <div className={`grid gap-4 md:gap-7 ${gridClassName}`}>
        {
          (items && items.length && items.length > 0) ?
            items.map((x, index) => renderCard(x, index))
            :
            data.map((x, index) => renderCard(x, index))
        }
      </div>
      {/* <div className="flex flex-col items-center justify-center mt-16 space-y-3 sm:flex-row sm:space-y-0 sm:space-x-5">
        <ButtonSecondary>Show me more </ButtonSecondary>
        <ButtonPrimary>Become a author</ButtonPrimary>
      </div> */}
    </div>
  );
};

export default SectionGridAuthorBox;
