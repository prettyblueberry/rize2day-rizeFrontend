import React, { FC, Fragment, useEffect, useState, useReducer } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import NcImage from "shared/NcImage/NcImage";
import CardNFT from "components/CardNFT";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import SocialsList from "shared/SocialsList/SocialsList";
import FollowButton from "components/FollowButton";
import VerifyIcon from "components/VerifyIcon";
import { Tab } from "@headlessui/react";
import CardAuthorBox3 from "components/CardAuthorBox3/CardAuthorBox3";
import EffectListBox, { NFT_EFFECT } from "components/EffectListBox";
import { useAppDispatch, useAppSelector } from "app/hooks";
import {
  changeDetailedUserInfo,
  selectCurrentUser,
  changeOtherUserInfo,
} from "app/reducers/auth.reducers";
import {
  changeFollow,
  changeFollowList,
  changeFollowingList,
  changeIsExists
} from "app/reducers/flollow.reducers";
import { FILE_TYPE, config } from "app/config";
import facebook from "images/socials/facebook.svg";
import twitter from "images/socials/twitter.svg";
import telegram from "images/socials/telegram.svg";
import { SocialType } from "shared/SocialsShare/SocialsShare";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import { isEmpty } from "app/methods";
import { changeItemsListOfAUser } from "app/reducers/nft.reducers";
import { changeCollectionList } from "app/reducers/collection.reducers";

import { toast } from "react-toastify";
import { io } from "socket.io-client";
import CopyButton from "components/CopyButton/CopyButton";
import CardNFTMusic from "components/CardNFTMusic";
import CardNFTVideo from "components/CardNFTVideo";
import CardNFT3D from "components/CardNFT3D";
import { UserData } from "app/reducers/auth.reducers";
import CollectionCard from "components/CollectionCard";
import styles from "../Collections/Profile.module.sass";
import { PROFILE_TABS } from "app/config";

var socket = io(`${config.socketUrl}`);

export interface AuthorPageProps {
  className?: string;
}

export interface UserItemFetchingParams {
  start?: number,
  last?: number,
  activeindex?: number
}

const AuthorPage: FC<AuthorPageProps> = ({ className = "" }) => {

  const currentUsr = useAppSelector(selectCurrentUser);
  const [userSocials, setUerSocials] = useState(Array<SocialType>);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isliked, setIsLiked] = useState(false);
  const [activeIndex, setActiveIndex] = useState(PROFILE_TABS.CREATED);
  const [collectedItems, setCollectedItems] = useState([]);
  const [createdItems, setCreatedItems] = useState([]);
  const [likedItems, setLikedItems] = useState([]);
  const [detailedPL, setDetailedPlayList] = useState(Array<any>);
  const { userId } = useParams();  //taget_id in making follow
  const [start, setStart] = useState(0);
  const [last, setLast] = useState(1000);
  const [followingAuthors, setFollowingAuthors] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [collections, setCollections] = useState([]);
  const [detailedUserInfo, setDetailedUserInfo] = useState<UserData>();
  const [effect, setEffect] = useState(NFT_EFFECT.NO_EFFECT)


  useEffect(() => {
    var socs = [];
    if (detailedUserInfo?.facebook) socs.push({
      name: "Facebook",
      icon: facebook,
      href: detailedUserInfo?.facebook
    })
    if (detailedUserInfo?.telegram) socs.push({
      name: "Telegram",
      icon: telegram,
      href: detailedUserInfo?.telegram
    })
    if (detailedUserInfo?.twitter) socs.push({
      name: "Twitter",
      icon: twitter,
      href: detailedUserInfo?.twitter
    })
    setUerSocials(socs);
  }, [detailedUserInfo]);

  let [categories] = useState([
    "Collectibles",
    "Created",
    "Liked",
    "Following",
    "Followers",
    "Collections"
  ]);

  const getIsExists = (user_id: string, target_id: string) => {
    if (isEmpty(user_id) || isEmpty(target_id)) return;
    axios.post(`${config.API_URL}api/follow/get_isExists`,
      { user_id, target_id }, {
      headers:
      {
        "x-access-token": localStorage.getItem("jwtToken")
      }
    })
      .then((result) => {
        dispatch(changeIsExists(result.data.data));
        setIsLiked(result.data.data);
      }).catch(() => {

      });
  }

  const toggleFollow = async (my_id: string, target_id: string) => {
    if (isEmpty(my_id) || isEmpty(target_id)) return;
    await axios.post(`${config.API_URL}api/follow/toggle_follow`, { my_id, target_id }, {
      headers:
      {
        "x-access-token": localStorage.getItem("jwtToken")
      }
    }).then((result) => {
      dispatch(changeFollow({ follow_status: true }))
    }).catch(() => {
      dispatch(changeFollow({ follow_status: false }))
    });
  }

  const getDetailedUserInfo = async (userId: string, isForMine = true) => {
    if (isEmpty(userId)) return;
    await axios.post(`${config.API_URL}api/users/findOne`, { userId }, {
      headers:
      {
        "x-access-token": localStorage.getItem("jwtToken")
      }
    }).then((result) => {
      if (isForMine === true) {
        dispatch(changeDetailedUserInfo(result.data.data || []));
      }
      else {
        dispatch(changeOtherUserInfo(result.data.data || []));
      }
      setDetailedUserInfo(result.data.data || {});
    }).catch(() => {
      console.log("Get detailed userInfo failed.");
    });
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
        console.log("UPDATE_FOLLOW_LIST : ", result.data.data);
        setFollowers(result.data.data || []);
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
        console.log("UPDATE_FOLLOWing_LIST : ", result.data.data);
        setFollowingAuthors((result.data && result.data.data) ? result.data.data : []);
        dispatch(changeFollowingList((result.data && result.data.data) ? result.data.data : []));
      }).catch(() => {
      });
  }

  const getItemsOfUserByConditions = (params: UserItemFetchingParams, userId: string) => {
    if (isEmpty(userId)) return;
    axios.post(`${config.API_URL}api/item/get_items_of_user`,
      { ...params, userId: userId }, {
      headers:
      {
        "x-access-token": localStorage.getItem("jwtToken")
      }
    }).then((result) => {
      console.log(">>>>>>>>>> ActiveIndex >>>>", activeIndex, result.data.data)
      if (activeIndex === PROFILE_TABS.COLLECTIBLES) setCollectedItems((result.data?.data) ? result.data.data : []);
      if (activeIndex === PROFILE_TABS.CREATED) setCreatedItems((result.data?.data) ? result.data.data : []);
      if (activeIndex === PROFILE_TABS.LIKED) setLikedItems((result.data?.data) ? result.data.data : []);
      dispatch(changeItemsListOfAUser((result.data?.data) ? result.data.data : []));
    }).catch((err) => {
      console.log("get_items_of_user : ", err)
    });
  }

  const getUserDetailedPlayHistory = async (userId: string) => {
    if (isEmpty(userId)) return;
    let tempPlayList = [] as Array<any>;
    await axios.post(`${config.API_URL}api/users/findOne`, { userId }, {
      headers:
      {
        "x-access-token": localStorage.getItem("jwtToken")
      }
    }).then((result) => {
      let simplePL = result.data.data.playList || [];
      console.log("simplePL = ", simplePL);
      tempPlayList = simplePL;
      setDetailedPlayList(tempPlayList);
    }).catch((err) => { });

  }

  const getCollections = async (limit, currentUserId) => {
    await axios.post(`${config.API_URL}api/collection/getUserCollections`, { limit: limit, userId: currentUserId }, {
      headers:
      {
        "x-access-token": localStorage.getItem("jwtToken")
      }
    }).then((result) => {
      setCollections(result.data.data);
      dispatch(changeCollectionList(result.data.data));
    }).catch(() => {

    });
  }

  useEffect(() => {
    getDetailedUserInfo(userId || "", (userId || "") === (currentUsr?._id || ""));
    getFollowList(userId || "", 10);
    getFollowingList(userId || "", 10);
    getIsExists(currentUsr?._id || "", userId || "");
  }, [userId])

  useEffect(() => {
    socket.on("UpdateStatus", (data: any) => {
      console.log(data);
      getDetailedUserInfo(userId || "", (userId || "") === (currentUsr?._id || ""));
      getFollowList(userId || "", 10);
      getFollowingList(userId || "", 10);
      getIsExists(currentUsr?._id || "", userId || "");
    });
  }, []);

  useEffect(() => {
    console.log("activeIndex = ", activeIndex);
    let params = { start: start, last: last, activeindex: activeIndex };
    if (activeIndex >= PROFILE_TABS.COLLECTIBLES && activeIndex <= PROFILE_TABS.LIKED && userId !== undefined) {
      getItemsOfUserByConditions(params, userId ? userId : "");
    }
    if (activeIndex === PROFILE_TABS.FOLLOWING) {
      getFollowList(userId || "", 10)
      setTimeout(() => {
        getFollowList(userId || "", 10)
      }, 1000)
    }
    if (activeIndex === PROFILE_TABS.FOLLOWERS) {
      getFollowingList(userId || "", 10)
      setTimeout(() => {
        getFollowList(userId || "", 10)
      }, 1000)
    }
    if (activeIndex === PROFILE_TABS.COLLECTIONS) {
      getCollections(90, userId || "");
    }
  }, [activeIndex, userId])

  const updateFollowings = () => {
    if (isEmpty(userId)) return;
    getFollowList(userId || "", 10)
    getFollowingList(userId || "", 10)
  }

  const toggleFollowing = (targetId: string) => {
    if (isEmpty(targetId) || isEmpty(currentUsr?._id)) {
      toast.warn("Please log in first.");
      return;
    }
    toggleFollow(currentUsr?._id || "", targetId)
  }

  const updateFollows = () => {
    if (isEmpty(userId)) return;
    getFollowList(userId || "", 10)
    getFollowingList(userId || "", 10)
  }

  const isVideoItem = (item: any) => {
    return item?.musicURL?.toLowerCase().includes("mp4") ? true : false;
  }

  const handleMessage = () => {
    if (!isEmpty(currentUsr)) {
      navigate(`/message/${userId}`)
    }
  }

  const onSelectEffect = (v: any) => {
    setEffect(v)
  }

  return (
    <div className={`nc-AuthorPage  ${className}`} data-nc-id="AuthorPage">
      <Helmet>
        <title>Creator || Rize2Day</title>
      </Helmet>

      <div className="w-full">
        <div className="container -mt-2 lg:-mt-3">
          <div className="relative bg-white dark:bg-[#191818] dark:border dark:border-neutral-600 p-5 lg:p-8 rounded-3xl md:rounded-[40px] shadow-xl flex flex-col md:flex-row">
            <div className="flex-shrink-0 w-32 mt-12 lg:w-44 sm:mt-0">
              <NcImage
                src={
                  `${config.API_URL}uploads/${detailedUserInfo?.avatar}` || ""
                }
                containerClassName="aspect-w-1 aspect-h-1 rounded-3xl overflow-hidden"
              />
            </div>
            <div className="flex-grow pt-5 md:pt-1 md:ml-6 xl:ml-14">
              <div className="max-w-screen-sm ">
                <h2 className="inline-flex items-center text-2xl font-semibold sm:text-3xl lg:text-4xl">
                  <span>{detailedUserInfo?.username || ""}</span>
                  <VerifyIcon
                    className="ml-2"
                    iconClass="w-6 h-6 sm:w-7 sm:h-7 xl:w-8 xl:h-8"
                  />
                </h2>
                {
                  detailedUserInfo?.address?.toLowerCase() === currentUsr?.address?.toLowerCase() &&
                  <div className="flex items-center text-sm font-medium space-x-2.5 mt-2.5 text-green-600 cursor-pointer">
                    <span className="text-neutral-700 dark:text-neutral-300">
                      {detailedUserInfo?.address || " "}
                    </span>
                    <CopyButton data={currentUsr?.address} />
                  </div>
                }
                <span className="block max-h-[100px] mt-4 text-sm text-neutral-500 dark:text-neutral-400 overflow-y-auto">
                  {detailedUserInfo?.userBio || ""}
                </span>
              </div>
              <div className="mt-4 ">
                <SocialsList socials={userSocials} itemClass="block w-7 h-7" />
              </div>
            </div>
            <div className="absolute flex flex-row-reverse justify-end md:static left-5 top-4 sm:left-auto sm:top-5 sm:right-5 gap-5">
              {/* <NftMoreDropdown
                actions={[
                  {
                    id: "report",
                    name: "Report abuse",
                    icon: "las la-flag",
                  },
                ]}
                containerClassName="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 dark:bg-neutral-800 cursor-pointer"
              /> */}
              {/* <ButtonDropDownShare
                className="flex items-center justify-center w-8 h-8 mx-2 rounded-full cursor-pointer md:w-10 md:h-10 bg-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 dark:bg-neutral-800"
                panelMenusClass="origin-top-right !-right-5 !w-40 sm:!w-52"
              /> */}
              {!isEmpty(currentUsr) && currentUsr?._id !== detailedUserInfo?._id && (
                <FollowButton
                  isFollowing={isliked || false}
                  fontSize="text-sm md:text-base font-medium"
                  sizeClass="px-4 py-1 md:py-2.5 h-8 md:!h-10 sm:px-6 lg:px-8"
                  onTogglefollow={toggleFollowing}
                  afterExcute={getIsExists}
                />
              )}
              {!isEmpty(currentUsr) && currentUsr?._id !== detailedUserInfo?._id && (
                <ButtonPrimary
                  className="relative z-10"
                  fontSize="text-sm font-medium"
                  sizeClass="px-4 py-1 md:py-2.5 h-8 md:!h-10 sm:px-6 lg:px-8"
                  onClick={handleMessage}
                >
                  Send Message
                </ButtonPrimary>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-16 space-y-16 lg:pb-28 lg:pt-20 lg:space-y-28">

        <main>
          <Tab.Group>
            <div className="flex flex-col justify-between lg:flex-row ">
              <Tab.List className="flex pb-10 space-x-0 overflow-x-auto sm:space-x-2">
                {
                  categories.map((item, index) => (
                    <Tab key={item} as={Fragment} >
                      {({ selected }) => (
                        <button
                          className={`flex-shrink-0 block font-medium px-4 py-2 text-sm sm:px-6 sm:py-2.5 capitalize rounded-full focus:outline-none ${index === activeIndex
                            ? "bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900"
                            : "text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-100 hover:text-neutral-900 hover:bg-neutral-100/70 dark:hover:bg-neutral-800"
                            } `}
                          onClick={() => { setActiveIndex(Number(index)) }}
                        >
                          {item}
                        </button>
                      )}
                    </Tab>
                  ))
                }
              </Tab.List>
              <div className="flex items-end justify-end mt-5 lg:mt-0">
                <EffectListBox onSelected={onSelectEffect} />
              </div>
            </div>
            <Tab.Panels>
              {
                activeIndex === PROFILE_TABS.COLLECTIBLES ? (
                  <>
                    <div className="grid mt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 lg:mt-10">
                      {collectedItems && collectedItems.map((x, index) => (
                        x.fileType > 0 ?
                          x.fileType === FILE_TYPE.IMAGE ?
                            <CardNFT className={"w-[300px]"} item={x} key={index} hideHeart={true} effect={effect} />
                            :
                            x.fileType == FILE_TYPE.AUDIO ?
                              <CardNFTMusic className={"w-[300px]"} item={x} key={index} hideHeart={true} effect={effect} />
                              :
                              x.fileTYpe === FILE_TYPE.VIDEO ?
                                <CardNFTVideo className={"w-[300px]"} item={x} key={index} hideHeart={true} effect={effect} />
                                :
                                <CardNFT3D className={"w-[300px]"} item={x} key={index} hideHeart={true} effect={effect} />
                          : <></>
                      ))}
                    </div>
                    {/* <div className="flex flex-col mt-12 space-y-5 lg:mt-16 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
                  <Pagination />
                  <ButtonPrimary loading>Show me more</ButtonPrimary>
                </div> */}
                  </>
                )
                  :
                  activeIndex === PROFILE_TABS.CREATED ? (
                    <>
                      <div className="grid mt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 lg:mt-10">
                        {
                          createdItems && createdItems.map((x, index) => (
                            x.fileType > 0 ?
                              x.fileType === FILE_TYPE.IMAGE ?
                                <CardNFT className={"w-[300px]"} item={x} key={index} effect={effect} />
                                :
                                x.fileType === FILE_TYPE.AUDIO ?
                                  <CardNFTMusic className={"w-[300px]"} item={x} key={index} effect={effect} />
                                  :
                                  x.fileType === FILE_TYPE.VIDEO ?
                                    <CardNFTVideo className={"w-[300px]"} item={x} key={index} effect={effect} />
                                    :
                                    <CardNFT3D className={"w-[300px]"} item={x} key={index} effect={effect} />
                              : <div key={index}></div>
                          ))
                        }
                      </div>
                      {/* <div className="flex flex-col mt-12 space-y-5 lg:mt-16 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
                  <Pagination />
                  <ButtonPrimary loading>Show me more</ButtonPrimary>
                </div> */}
                    </>
                  )
                    :
                    activeIndex === PROFILE_TABS.LIKED ? (
                      <>
                        <div className="grid mt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 lg:mt-10">
                          {likedItems && likedItems.map((x, index) => (
                            x.fileType > 0 ?
                              x.fileType === FILE_TYPE.IMAGE ?
                                <CardNFT className={"w-[300px]"} item={x} key={index} effect={effect} hideHeart={true} />
                                :
                                x.fileType === FILE_TYPE.AUDIO ?
                                  <CardNFTMusic className={"w-[300px]"} item={x} key={index} effect={effect} hideHeart={true} />
                                  :
                                  x.fileType === FILE_TYPE.VIDEO ?
                                    <CardNFTVideo className={"w-[300px]"} item={x} key={index} effect={effect} hideHeart={true} />
                                    :
                                    <CardNFT3D className={"w-[300px]"} item={x} key={index} effect={effect} hideHeart={true} />
                              : <div key={index}></div>
                          ))}
                        </div>
                        {/* <div className="flex flex-col mt-12 space-y-5 lg:mt-16 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
                  <Pagination />
                  <ButtonPrimary loading>Show me more</ButtonPrimary>
                </div> */}
                      </>
                    )
                      :
                      activeIndex === PROFILE_TABS.FOLLOWING ? (
                        <>
                          <div className="grid gap-8 mt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:mt-10">
                            {followingAuthors && followingAuthors.map((x, index) => (
                              <CardAuthorBox3 following={true} key={index} item={x} onUpdate={updateFollowings} onUnfollow={toggleFollowing} effect={effect} />
                            ))}
                          </div>
                          {/* <div className="flex flex-col mt-12 space-y-5 lg:mt-16 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
                  <Pagination />
                  <ButtonPrimary loading>Show me more</ButtonPrimary>
                </div> */}
                        </>
                      )
                        :
                        activeIndex === PROFILE_TABS.FOLLOWERS ? (
                          <>
                            <div className="grid gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-8 lg:mt-10">
                              {followers && followers.map((x, index) => (
                                <CardAuthorBox3 following={false} key={index} item={x} effect={effect} />
                              ))}
                            </div>
                            {/* <div className="flex flex-col mt-12 space-y-5 lg:mt-16 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
                  <Pagination />
                  <ButtonPrimary loading>Show me more</ButtonPrimary>
                </div> */}
                          </>
                        )
                          : activeIndex === PROFILE_TABS.COLLECTIONS ? (
                            <>
                              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 " >
                                {

                                  (collections && collections.length > 0) ? collections.map((x, index) => (
                                    <CollectionCard className={styles.card} collection={x} key={index} isEditable={false} />
                                  )) : <></>
                                }
                              </div>
                              {/* <div className="grid gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-8 lg:mt-10">
                                {detailedPL && detailedPL.map((x, index) => (
                                  <p key={index} >
                                    {x.toString()}
                                  </p>
                                ))}
                              </div> */}
                              {/* <div className="flex flex-col mt-12 space-y-5 lg:mt-16 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
                  <Pagination />
                  <ButtonPrimary loading>Show me more</ButtonPrimary>
                </div> */}
                            </>
                          )
                            :
                            <></>
              }
            </Tab.Panels>
          </Tab.Group>
        </main>

        {/* <SectionBecomeAnAuthor /> */}
      </div>
    </div>
  );
};

export default AuthorPage;
