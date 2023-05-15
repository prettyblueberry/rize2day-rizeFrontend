import React, { FC, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import Avatar from "shared/Avatar/Avatar";
import NcImage from "shared/NcImage/NcImage";
import { AiOutlineMessage } from "react-icons/ai";
import { defaultImage, nftsImgs } from "contains/fakeData";
import ItemTypeImageIcon from "./ItemTypeImageIcon";
import CartButton from "./CartButton";
import LikeButton from "./LikeButton";
import Prices from "./Prices";
import { ClockIcon } from "@heroicons/react/outline";
import NetworkLogo from "./NetworkLogo";
import {
  selectCurrentNetworkSymbol,
  selectCurrentUser,
} from "app/reducers/auth.reducers";
import CardFlip from "react-card-flip";
import { useAppSelector } from "app/hooks";
import { isEmpty } from "app/methods";
import axios from "axios";
import { toast } from "react-toastify";
import { ACTIVE_CHAINS, config, PLATFORM_NETWORKS } from "app/config.js";
import { NFT_EFFECT } from "./EffectListBox";
import TileEffect from "./TileEffect/TileEffect";
import { getSystemTime } from "utils/utils";
import defaultAvatar from "images/default_avatar.png";
import { useDispatch } from "react-redux";
import { isSupportedEVMNetwork } from "InteractWithSmartContract/interact";
import PricesUnit from "./PricesUnit";

export interface CardNFTProps {
  className?: string;
  isLiked?: boolean;
  item?: any;
  hideHeart?: boolean;
  effect?: NFT_EFFECT;
  isHome?: boolean;
}

const CardNFT: FC<CardNFTProps> = (props: any) => {
  const currentNetworkSymbol = useAppSelector(selectCurrentNetworkSymbol);
  const currentUsr = useAppSelector(selectCurrentUser);
  const [className, setClassName] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [nftItem, setNftItem] = useState({});
  const [hideFav, setHideFav] = useState(props?.hideHeart || false);
  const [isFlipped, setFlipped] = useState(false);
  const [timeLeft, setTimeLeft] = useState({});
  const [sysTime, setSysTime] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const curTime = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    setHideFav(props?.hideHeart);
    if (props.className) setClassName(props.className);
    if (props.isLiked) setIsLiked(props.isLiked);
    if (props.item) {
      setNftItem(props.item);
      checkIsLiked(props.item);
    }

    (async () => {
      const res = await getSystemTime();
      setSysTime(res);
    })();
  }, [props]);

  const setFavItem = (target_id: string, user_id: string) => {
    if (isEmpty(target_id) || isEmpty(user_id)) return;
    axios
      .post(
        `${config.API_URL}api/users/set_fav_item`,
        { target_id: target_id, user_id: user_id },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then((result) => {
        axios
          .post(
            `${config.API_URL}api/item/get_detail`,
            { id: (nftItem as any)?._id || "" },
            {
              headers: {
                "x-access-token": localStorage.getItem("jwtToken"),
              },
            }
          )
          .then((result) => {
            setNftItem(result.data.data);
            checkIsLiked(result.data.data);
          })
          .catch(() => { });
      });
  };

  const toggleFav = () => {
    setFavItem((nftItem as any)._id, currentUsr?._id || "");
  };

  const checkIsLiked = (item) => {
    if (item && currentUsr) {
      if (!(item as any).likes) {
        setIsLiked(false);
      }
      var index = (item as any).likes.findIndex(
        (element: any) => element === currentUsr._id
      );

      if (index === -1) {
        setIsLiked(false);
      } else {
        setIsLiked(true);
      }
    }
  };

  const renderAvatars = () => {
    return (
      <div className="flex -space-x-1 ">
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-900"
          sizeClass="h-5 w-5 text-sm"
        />
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-900"
          sizeClass="h-5 w-5 text-sm"
        />
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-900"
          sizeClass="h-5 w-5 text-sm"
        />
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-900"
          sizeClass="h-5 w-5 text-sm"
        />
      </div>
    );
  };

  const handleMessage = (msg: any) => {
    let id = msg?._id ? msg._id : msg;
    if (currentUsr && currentUsr._id && currentUsr?._id !== id) {
      navigate("/message/" + id);
    } else {
      toast.warn("A NFT you select is yours");
    }
  };

  const calculateTimeLeft = (created: number, period: number) => {
    let difference = created * 1000 + period * 1000 - curTime.current++ * 1000;
    let time = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference >= 0) {
      time = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    setTimeLeft(time);
    setRefresh(!refresh);
    return difference;
  };

  useEffect(() => {
    let intVal: string | number | NodeJS.Timeout;
    if (sysTime > 0) {
      curTime.current = sysTime;
      calculateTimeLeft(
        (nftItem as any)?.auctionStarted,
        (nftItem as any)?.auctionPeriod
      );
      intVal = setInterval(() => {
        const time_left = calculateTimeLeft(
          (nftItem as any)?.auctionStarted,
          (nftItem as any)?.auctionPeriod
        );
        if (time_left <= 0) {
          curTime.current = 0;
          setAuctionEnded(true);
          clearInterval(intVal);
        }
      }, 1000);
    }

    return () => clearInterval(intVal);
  }, [sysTime]);

  const renderView = () => {
    return (
      <div
        className={`nc-CardNFT z-10 m-auto relative flex flex-col group [ nc-box-has-hover nc-dark-box-bg-has-hover ] ${props?.isHome ? "!border-[#22c55e]" : ""
          } ${className}`}
        data-nc-id="CardNFT"
      >
        <div className="relative flex-shrink-0 ">
          <div>
            <NcImage
              containerClassName="flex aspect-w-12 aspect-h-10 w-full h-0 rounded-3xl overflow-hidden z-0"
              src={`${config.ipfsGateway}${(nftItem as any)?.logoURL}`}
              onClick={() => {
                (nftItem as any)?._id
                  ? navigate(`/nft-detail/${(nftItem as any)?._id}`)
                  : navigate("/nft-detail");
              }}
              className="object-cover cursor-pointer w-full max-h-[250px] rounded-3xl overflow-hidden  group-hover:scale-[1.03] transition-transform duration-300 ease-in-out will-change-transform"
            />
          </div>
          <ItemTypeImageIcon className="absolute top-3 left-3 !w-9 !h-9" />
          <div className="flex flex-row absolute top-3 right-3 z-10 !h-10 bg-black/50 px-3.5 items-center justify-center rounded-full text-white">
            <CartButton nftId={(nftItem as any)?._id} />
            <div onClick={() => handleMessage((nftItem as any)?.owner)}>
              <AiOutlineMessage
                className="flex items-center justify-center cursor-pointer rounded-full text-white"
                size={21}
              />
            </div>
            {!hideFav && (
              <LikeButton
                liked={isLiked}
                count={
                  (nftItem as any)?.likes ? (nftItem as any).likes.length : 0
                }
                toggleFav={toggleFav}
              />
            )}
          </div>
          <div className="absolute top-3 inset-x-3 flex"></div>
        </div>

        <div className="p-4 py-5 space-y-3">
          <div className="flex justify-between">
            <h2
              className={`text-lg font-medium`}
              onClick={() => {
                (nftItem as any)?._id
                  ? navigate(`/nft-detail/${(nftItem as any)?._id}`)
                  : navigate("/nft-detail");
              }}
            >
              {((nftItem as any)?.name || "").toString().length > 15
                ? ((nftItem as any)?.name || "").toString().substring(0, 15) +
                "..."
                : ((nftItem as any)?.name || "").toString()}
            </h2>
            <div className="flex justify-between gap-2">
              <div>
                {!isEmpty((nftItem as any).owner) && (
                  <div
                    onClick={() =>
                      navigate(
                        `/page-author/${(nftItem as any)?.owner?._id || "1"}`
                      )
                    }
                  >
                    <Avatar
                      imgUrl={
                        (nftItem as any)?.owner?.avatar
                          ? `${config.API_URL}uploads/${(nftItem as any)?.owner.avatar
                          }`
                          : defaultAvatar
                      }
                      sizeClass="w-8 h-8 sm:w-8 sm:h-8"
                    />
                  </div>
                )}
              </div>
              {/* <span className="text-neutral-700 dark:text-neutral-400 text-xs">
                {(nftItem as any)?.stockAmount ? (nftItem as any).stockAmount : 1} in stock
              </span> */}
              <NetworkLogo
                networkSymbol={
                  (nftItem as any)?.networkSymbol || PLATFORM_NETWORKS.COREUM
                }
                className=""
              />
            </div>
          </div>
          {!props?.isHome && (
            <div className="w-2d4 w-full border-b border-neutral-100 dark:border-neutral-600"></div>
          )}
          {!props?.isHome && (
            <div
              className="flex justify-between items-end cursor-pointer"
              onClick={() => {
                (nftItem as any)?._id
                  ? navigate(`/nft-detail/${(nftItem as any)?._id}`)
                  : navigate("/nft-detail");
              }}
            >
              <Prices
                labelTextClassName="bg-white dark:bg-[#191818] dark:group-hover:bg-[#202020] group-hover:bg-neutral-50"
                labelText={
                  (nftItem as any)?.isSale == 2
                    ? (nftItem as any)?.bids && (nftItem as any).bids.length > 0
                      ? "Current Bid"
                      : "Start price"
                    : (nftItem as any)?.isSale == 1
                      ? "Sale Price"
                      : "Price"
                }
                item={nftItem}
              />
              {(nftItem as any)?.isSale == 2 && (
                <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                  <ClockIcon className="w-4 h-4" />
                  {auctionEnded ? (
                    <span className="ml-1 mt-0.5">Expried</span>
                  ) : (
                    <span className="ml-1 mt-0.5">
                      {(timeLeft as any)?.days || 0} :{" "}
                      {(timeLeft as any)?.hours || 0} :{" "}
                      {(timeLeft as any)?.minutes || 0} :{" "}
                      {(timeLeft as any)?.seconds || 0}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      {props?.effect?.code === NFT_EFFECT.WRAP_VIEW ? (
        <TileEffect>{renderView()}</TileEffect>
      ) : props?.effect?.code === NFT_EFFECT.CARD_FLIP ? (
        <div className="relative">
          <div
            onClick={() => {
              (nftItem as any)?._id
                ? navigate(`/nft-detail/${(nftItem as any)?._id}`)
                : navigate("/nft-detail");
            }}
          >
            <div
              className="absolute top-0 aspect-w-12 aspect-h-10 w-full h-0 z-50"
              onMouseEnter={() => setFlipped(true)}
              onMouseLeave={() => setFlipped(false)}
            ></div>
          </div>
          <CardFlip isFlipped={isFlipped}>
            {renderView()}
            <div
              className={`nc-CardNFT z-10 relative flex flex-col group !border-0 [ nc-box-has-hover nc-dark-box-bg-has-hover ] ${className}`}
              data-nc-id="CardNFT"
            >
              <div className="flex flex-col text-neutral-500 dark:text-neutral-400 px-10 py-5">
                <div className="flex flex-col gap-1 mb-4">
                  <span>Collection:</span>
                  <div className="flex flex-row gap-4 items-center">
                    <Avatar
                      imgUrl={`${config.API_URL}uploads/${(nftItem as any)?.collection_id?.logoURL
                        }`}
                      sizeClass="w-8 h-8 sm:w-9 sm:h-9"
                    />
                    <span>{(nftItem as any)?.collection_id?.name}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 mb-4">
                  <span>Owner:</span>
                  <div className="flex flex-row gap-4 items-center">
                    <Avatar
                      imgUrl={`${config.API_URL}uploads/${(nftItem as any)?.owner?.avatar
                        }`}
                      sizeClass="w-8 h-8 sm:w-9 sm:h-9"
                    />
                    <span>{(nftItem as any)?.owner?.username}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 mb-4">
                  <span>Creator:</span>
                  <div className="flex flex-row gap-4 items-center">
                    <Avatar
                      imgUrl={`${config.API_URL}uploads/${(nftItem as any)?.creator?.avatar
                        }`}
                      sizeClass="w-8 h-8 sm:w-9 sm:h-9"
                    />
                    <span>{(nftItem as any)?.creator?.username}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardFlip>
        </div>
      ) : (
        renderView()
      )}
    </div>
  );
};

export default CardNFT;
