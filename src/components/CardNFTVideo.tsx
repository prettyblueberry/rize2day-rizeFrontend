import React, { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "shared/Avatar/Avatar";
import NcImage from "shared/NcImage/NcImage";
import { nftsImgs } from "contains/fakeData";
import LikeButton from "./LikeButton";
import Prices from "./Prices";
import ButtonPlayMusicRunningContainer from "containers/ButtonPlayMusicRunningContainer";
import { nanoid } from "@reduxjs/toolkit";
import VideoForNft from "./VideoForNft";
import { useAppSelector } from "app/hooks";
import axios from "axios";
import CardFlip from "react-card-flip";
import { NFT_EFFECT } from "./EffectListBox";
import TileEffect from "./TileEffect/TileEffect";
import { selectCurrentUser } from "app/reducers/auth.reducers";
import { config } from "app/config";
import { isEmpty } from "app/methods";
import { useNavigate } from "react-router-dom";
import ItemTypeVideoIcon from "./ItemTypeVideoIcon";
import { AiOutlineMessage } from "react-icons/ai";
import { toast } from "react-toastify";
import defaultAvatar from "images/default_avatar.png";

const CardNFTVideo = (props: any) => {
  const [DEMO_NFT_ID] = React.useState(nanoid());

  const [nftItem, setNftItem] = useState(props?.item || {});
  const [hideFav, setHideFav] = useState(props?.hideHeart || false);
  const navigate = useNavigate();
  const currentUsr = useAppSelector(selectCurrentUser);
  const [isLiked, setIsLiked] = useState(false);
  const [isFlipped, setFlipped] = useState(false);

  useEffect(() => {
    setNftItem(props?.item);
    setHideFav(props?.hideHeart);
    checkIsLiked();
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
            { id: nftItem?._id || "" },
            {
              headers: {
                "x-access-token": localStorage.getItem("jwtToken"),
              },
            }
          )
          .then((result) => {
            setNftItem(result.data.data);
            checkIsLiked();
          })
          .catch(() => {});
      });
  };

  const toggleFav = () => {
    setFavItem(nftItem._id, currentUsr?._id || "");
  };

  const checkIsLiked = () => {
    if (nftItem && currentUsr) {
      if (!nftItem.likes) {
        setIsLiked(false);
      }

      var index = nftItem?.likes?.findIndex((element: any) => {
        if (element == currentUsr._id) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      });

      if (index === -1) {
        setIsLiked(false);
      } else {
        setIsLiked(true);
      }
    }
  };

  const plusPlayCount = async () => {
    await axios
      .post(
        `${config.API_URL}api/playhistory/createPlayHistory`,
        { itemId: nftItem?._id || "", userId: currentUsr?._id || "" },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then((result) => {})
      .catch(() => {});
  };

  const addToPlayList = async () => {
    await axios
      .post(
        `${config.API_URL}api/users/addItem2PL`,
        { itemId: nftItem?._id || "", userId: currentUsr?._id || "" },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then((result) => {
        if (result.data.code === 0) {
          toast.success("You've successfully add an item to playlist.");
        } else {
          toast.warn(result.data.message);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const renderAvatars = () => {
    return (
      <div className="hidden -space-x-1 sm:flex ">
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

  const renderIcon = (state?: "playing" | "loading") => {
    if (!state) {
      return (
        <svg className="ml-0.5 w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M18.25 12L5.75 5.75V18.25L18.25 12Z"
          ></path>
        </svg>
      );
    }

    return (
      <svg className=" w-9 h-9" fill="none" viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M15.25 6.75V17.25"
        ></path>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M8.75 6.75V17.25"
        ></path>
      </svg>
    );
  };

  const renderListenButtonDefault = (state?: "playing" | "loading") => {
    return (
      <div
        className={`w-14 h-14 flex items-center justify-center rounded-full  cursor-pointer ${
          state === "playing"
            ? "bg-neutral-900/40 text-primary-50"
            : "bg-neutral-50/80 text-primary-500"
        }`}
      >
        {renderIcon(state)}
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

  const renderView = () => (
    <div
      className={`nc-CardNFTMusic z-10 w-full m-auto relative flex flex-col group [ nc-box-has-hover nc-dark-box-bg-has-hover ] ${props?.className}`}
      data-nc-id="CardNFTVideo"
    >
      <div className="relative flex-shrink-0 ">
        <VideoForNft
          src={
            nftItem?.musicURL
              ? `${config.ipfsGateway}${nftItem?.musicURL || ""}?stream=true`
              : undefined
          }
          nftId={nftItem?._id || DEMO_NFT_ID}
        />

        <div
          className=""
          onClick={() => {
            nftItem?._id
              ? navigate(`/nft-detail/${nftItem?._id}`)
              : navigate("/nft-detail");
          }}
        >
          <NcImage
            containerClassName="block aspect-w-12 aspect-h-10 w-full h-0 rounded-3xl overflow-hidden z-0"
            src={
              nftItem?.logoURL
                ? `${config.API_URL}uploads/${nftItem?.logoURL}`
                : props?.featuredImage
            }
            className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-300 ease-in-out cursor-pointer will-change-transform"
          />
        </div>
        <ItemTypeVideoIcon className="absolute top-3 left-3 z-10 w-8 md:w-10 !h-9" />
        <div className="flex flex-row absolute top-3 right-3 z-10 !h-10 bg-black/50 px-3.5 items-center justify-center rounded-full text-white">
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
        <div
          className={`absolute z-10 bottom-3 right-3 bg-black/50 px-3.5 h-10 flex items-center justify-center rounded-full text-white `}
        >
          {nftItem?.playCount || 0}
        </div>
        <ButtonPlayMusicRunningContainer
          className="absolute z-20 bottom-3 left-3"
          nftId={nftItem?._id || DEMO_NFT_ID}
          renderDefaultBtn={() => renderListenButtonDefault()}
          renderPlayingBtn={() => renderListenButtonDefault("playing")}
          renderLoadingBtn={() => renderListenButtonDefault("loading")}
          increaseFunc={plusPlayCount}
        />
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
            {(nftItem as any)?.name || ""}
          </h2>
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
                      ? `${config.API_URL}uploads/${
                          (nftItem as any)?.owner.avatar
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
        </div>
        <div className="w-2d4 w-full border-b border-neutral-100 dark:border-neutral-600"></div>

        <div className="flex justify-between items-end mt-3.5">
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
            price={
              (nftItem as any)?.isSale == 2
                ? `${
                    (nftItem as any)?.bids && (nftItem as any)?.bids.length > 0
                      ? (nftItem as any)?.bids[
                          (nftItem as any)?.bids.length - 1
                        ].price
                        ? (nftItem as any)?.bids[
                            (nftItem as any)?.bids.length - 1
                          ].price
                        : 0
                      : (nftItem as any)?.price
                  } 
                  RIZE 
                  `
                : (nftItem as any)?.isSale == 1
                ? `${(nftItem as any)?.price || 0} 
                    RIZE
                  `
                : "Not Listed"
            }
          />
          {/* <span className="block text-xs font-normal tracking-wide text-neutral-500 dark:text-neutral-400">
            {nftItem?.stockAmount ? nftItem.stockAmount : 1} in stock
          </span> */}
          {/* <div className="text-right">
            <span className="block text-xs font-normal tracking-wide text-neutral-500 dark:text-neutral-400">
              Remaining time
            </span>
            <span className="block font-semibold mt-0.5">3h : 15m : 20s</span>
          </div> */}
        </div>
      </div>
    </div>
  );

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
              className={`nc-CardNFT z-10 relative flex flex-col group !border-0 [ nc-box-has-hover nc-dark-box-bg-has-hover ] ${props?.className}`}
              data-nc-id="CardNFT"
            >
              <div className="flex flex-col text-neutral-500 dark:text-neutral-400 px-10 py-5">
                <div className="flex flex-col gap-1 mb-4">
                  <span>Collection:</span>
                  <div className="flex flex-row gap-4 items-center">
                    <Avatar
                      imgUrl={`${config.API_URL}uploads/${
                        (nftItem as any)?.collection_id?.logoURL
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
                      imgUrl={`${config.API_URL}uploads/${
                        (nftItem as any)?.owner?.avatar
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
                      imgUrl={`${config.API_URL}uploads/${
                        (nftItem as any)?.creator?.avatar
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

export default CardNFTVideo;
