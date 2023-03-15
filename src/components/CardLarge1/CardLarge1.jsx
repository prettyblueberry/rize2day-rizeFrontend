import React, { FC, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import NextPrev from "shared/NextPrev/NextPrev";
import NcImage from "shared/NcImage/NcImage";
import Avatar from "shared/Avatar/Avatar";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import LikeButton from "components/LikeButton";
import ItemTypeVideoIcon from "components/ItemTypeVideoIcon";
import { nftsLargeImgs } from "contains/fakeData";
import TimeCountDown from "./TimeCountDown";
import collectionPng from "images/nfts/collection.png";
import VerifyIcon from "components/VerifyIcon";
import { useNavigate } from "react-router-dom";
import { config } from "app/config";
import { useAppSelector } from "app/hooks";
import { selectDetailOfAnItem, selectCOREPrice } from "app/reducers/nft.reducers";
import { selectCurrentChainId, selectCurrentUser, selectCurrentWallet, selectGlobalProvider, selectWalletStatus } from "app/reducers/auth.reducers";
import { isEmpty } from "app/methods";
import { toast } from "react-toastify";
// import { acceptOrEndBid, destroySale, getBalanceOf, placeBid } from "InteractWithSmartContract/interact";
import NcModal from "shared/NcModal/NcModal";
import Bid from "../../containers/NftDetailPage/Bid";
import Accept from "../../containers/NftDetailPage/Accept";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import NextPrev from "shared/NextPrev/NextPrev";
import axios from "axios";
import { getSystemTime } from "utils/utils";

const CardLarge1 = ({
  className = "",
  isShowing = true,
  onClickNext = () => { },
  onClickPrev = () => { },
  featuredImgUrl = nftsLargeImgs[0],
  item
}) => {
  const [visibleModalAccept, setVisibleModalAccept] = useState(false);
  const [visibleModalBid, setVisibleModalBid] = useState(false);
  const [consideringItem, setConsideringItem] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const currentUsr = useAppSelector(selectCurrentUser);
  const globalCOREPrice = useAppSelector(selectCOREPrice);
  const [processing, setProcessing] = useState(false);
  const globalAccount = useAppSelector(selectCurrentWallet);
  const globalChainId = useAppSelector(selectCurrentChainId);
  const walletStatus = useAppSelector(selectWalletStatus);
  const globalProvider = useAppSelector(selectGlobalProvider);
  const [timeLeft, setTimeLeft] = useState({});
  const [sysTime, setSysTime] = useState(0);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const curTime = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    setConsideringItem(item || {});
    (async () => {
      const res = await getSystemTime();
      setSysTime(res);
    })()
  }, [item])

  const randomTitle = [
    "Walking On Air ",
    "Amazing Nature",
    "Beautiful NFT",
    "Lovely NFT",
    "Wolf Face #1",
  ];

  const checkWalletAddrAndChainId = async () => {
    if (isEmpty(currentUsr) === true) {
      toast.warn("You have to sign in before doing a trading.");
      return false;
    }
    if (walletStatus === false) {
      toast.warn("Please connect and unlock your wallet.");
      return false;
    }
    if (globalAccount && currentUsr && currentUsr.address && globalAccount.toLowerCase() !== currentUsr.address.toLowerCase()) {
      toast.warn("Wallet addresses are not equal. Please check current wallet to your registered wallet.");
      return false;
    }
    return true;
  }

  const isVideo = (item) => {
    return item?.musicURL?.toLowerCase().includes("mp4") ? true : false;
  }

  const getLeftDuration = (created, period, curTime) => {

    var createdTime = (new Date(created)).getTime();
    var diff = createdTime + period * 24 * 3600 * 1000 - curTime;
    return diff = diff / 1000;
  }

  const onBid = async (bidPrice) => {
    setVisibleModalBid(false);

    setProcessing(true);
    let checkResut = await checkWalletAddrAndChainId();
    if (!checkResut) {
      setProcessing(false);
      return;
    }

    if (getLeftDuration((consideringItem)?.auctionStarted, (consideringItem)?.auctionPeriod, Date.now()) <= 12) {
      setTimeout(() => {
        setProcessing(false);
      }, 15000)
    }
    // let result = await placeBid(new Web3(globalProvider), currentUsr?.address, (consideringItem)?._id, Number(bidPrice), (consideringItem)?.chainId || 1);
    // if((result).success === true) toast.success((result).message);
    // else toast.error((result).message);    
    setProcessing(false);
  }

  const removeSale = async () => {
    if ((consideringItem)?.owner?._id !== currentUsr?._id) {
      toast.warn("You are not the owner of this nft.");
      return;
    }

    if ((consideringItem)?.bids.length > 0 && (consideringItem)?.isSale === 2) {
      toast.warn("You cannot remove it from sale because you had one or more bid(s) already.");
      return;
    }

    setProcessing(true);
    let checkResut = await checkWalletAddrAndChainId();
    if (!checkResut) {
      setProcessing(false);
      return;
    }

    // let iHaveit;
    // iHaveit = await getBalanceOf(new Web3(globalProvider), currentUsr?.address, (consideringItem)?._id, (consideringItem)?.chainId || 1);
    // if (iHaveit === 1) {
    //   setProcessing(false);
    //   toast.warn("Your NFT is not on sale.");
    //   return;
    // }
    // if (iHaveit && (iHaveit).message) {
    //   toast.warn(`${(iHaveit).message}`);
    //   return;
    // }
    // let result = await destroySale(new Web3(globalProvider), currentUsr?.address, (consideringItem)?._id, (consideringItem)?.chainId || 1);
    // if((result).success === true) toast.success((result).message);
    // else toast.error((result).message);    
    setProcessing(false);
  }

  const onAccept = async () => {
    setVisibleModalAccept(false);

    setProcessing(true);
    let checkResut = await checkWalletAddrAndChainId();
    if (!checkResut) {
      setProcessing(false);
      return;
    }

    // let result = await acceptOrEndBid(new Web3(globalProvider), currentUsr?.address, (consideringItem)?._id, (consideringItem)?.chainId || 1);
    // if((result).success === true) toast.success((result).message);
    // else toast.error((result).message);    
    setProcessing(false);
  }

  const setFavItem = async (target_id, user_id) => {
    if (isEmpty(target_id) || isEmpty(user_id)) return;
    await axios.post(`${config.API_URL}api/users/set_fav_item`, { target_id: target_id, user_id: user_id }, {
      headers:
      {
        "x-access-token": localStorage.getItem("jwtToken")
      }
    }).then(async (result) => {
      await axios.post(`${config.API_URL}api/item/get_detail`, { id: (consideringItem)?._id || "" }, {
        headers:
        {
          "x-access-token": localStorage.getItem("jwtToken")
        }
      }).then((result) => {
        checkIsLiked();
        setRefresh(!refresh);
      }).catch(() => {
      });
    });
  }

  const toggleFav = () => {
    setFavItem((consideringItem)?._id, currentUsr?._id || "");
  }

  const checkIsLiked = () => {
    if ((consideringItem) && currentUsr) {
      if (!(consideringItem).likes) {
        setIsLiked(false);
      }

      var isIn = (consideringItem)?.likes?.includes(currentUsr._id) || false;

      setIsLiked(isIn);
    }
  }

  const calculateTimeLeft = (created, period) => {
    let difference = created * 1000 + period * 1000 - (curTime.current++) * 1000;
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
    let intVal = 0;
    if (sysTime > 0) {
      curTime.current = sysTime;
      calculateTimeLeft((consideringItem)?.auctionStarted, (consideringItem)?.auctionPeriod);
      intVal = setInterval(() => {
        const time_left = calculateTimeLeft((consideringItem)?.auctionStarted, (consideringItem)?.auctionPeriod)
        if (time_left <= 0) {
          curTime.current = 0;
          setAuctionEnded(true);
          clearInterval(intVal);
        }
      }, 1000)
    }

    return () => clearInterval(intVal)
  }, [sysTime]);

  return (
    <div
      className={`nc-CardLarge1 nc-CardLarge1--hasAnimation relative flex flex-col-reverse lg:flex-row justify-end ${className}`}
    >
      <div className="z-10 w-full lg:mt-0 sm:px-5 lg:px-0 lg:max-w-lg lg:m-auto">
        <div className="p-4 space-y-3 bg-white shadow-lg nc-CardLarge1__left sm:p-8 xl:py-14 md:px-10 bg-transparent rounded-3xl sm:space-y-8 ">
          <h2 className="text-2xl font-semibold lg:text-3xl 2xl:text-5xl ">
            <div onClick={() => { navigate(`/nft-detail/${(consideringItem)?._id || ""}`) }} title="Walking On Air">
              {(consideringItem)?.name || ""}
            </div>
          </h2>

          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-12">
            <div className="flex items-center" onClick={() => navigate(`/page-author/${(consideringItem)?.creator?._id || ""}`)} >
              <div className="flex-shrink-0 w-10 h-10">
                <Avatar sizeClass="w-10 h-10"
                  imgUrl={(consideringItem)?.creator?.avatar ? `${config.API_URL}uploads/${(consideringItem)?.creator.avatar}` : undefined}
                />
              </div>
              <div className="ml-3">
                <div className="text-xs dark:text-neutral-400">Creator</div>
                <div className="flex items-center text-sm font-semibold">
                  <span>{(consideringItem)?.creator?.username || ""}</span>
                  <VerifyIcon />
                </div>
              </div>
            </div>
            <div className="flex items-center" onClick={() => navigate(`/collectionItems/${(consideringItem)?.collection_id?._id || ""}`)}>
              <div className="flex-shrink-0 w-10 h-10">
                {
                  <Avatar sizeClass="w-10 h-10"
                    imgUrl={`${config.API_URL}uploads/${(consideringItem)?.collection_id?.logoURL || ""}`}
                  />
                }
              </div>
              <div className="ml-3">
                <div className="text-xs dark:text-neutral-400">Collection</div>
                <div className="text-sm font-semibold ">{(consideringItem)?.collection_id?.name}</div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="relative flex flex-col items-baseline p-6 border-2 border-green-500 sm:flex-row rounded-xl">
              <span className="block absolute bottom-full translate-y-1.5 py-1 px-1.5 bg-white dark:bg-[#191818] text-sm text-neutral-500 dark:text-neutral-400 ring ring-offset-0 ring-white dark:ring-neutral-900">
                {
                  (consideringItem)?.isSale == 2 ?
                    (consideringItem)?.bids && (consideringItem).bids.length > 0 ?
                      "Current Bid"
                      :
                      "Start price"
                    :
                    (consideringItem)?.isSale == 1 ?
                      "Sale Price"
                      :
                      "Price"
                }
              </span>
              <span className="text-3xl font-semibold text-green-500 xl:text-4xl">
                {
                  (consideringItem)?.isSale == 2 ?
                    `${(consideringItem).bids && (consideringItem).bids.length > 0 ?
                      (consideringItem).bids[(consideringItem).bids.length - 1].price ?
                        (consideringItem).bids[(consideringItem).bids.length - 1].price : 0
                      :
                      (consideringItem)?.price} RIZE`
                    :
                    `${(consideringItem)?.price || 0} RIZE`
                }
              </span>
              <span className="text-lg text-neutral-400 sm:ml-3.5">
                {
                  (consideringItem)?.isSale == 2 ?
                    `( ≈ $ ${(consideringItem).bids && (consideringItem).bids.length > 0 ?
                      (consideringItem).bids[(consideringItem).bids.length - 1].price ?
                        ((consideringItem).bids[(consideringItem).bids.length - 1].price * globalCOREPrice)?.toFixed(2) : 0
                      :
                      ((consideringItem)?.price * globalCOREPrice)?.toFixed(2) || 0} )`
                    :
                    `( ≈ $ ${((consideringItem)?.price * globalCOREPrice)?.toFixed(2) || 0})`
                }
              </span>
            </div>
          </div>

          {
            (consideringItem)?.isSale === 2 &&
            <div className="space-y-5">
              <div className="flex items-center space-x-2 text-neutral-500 dark:text-neutral-400 ">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.75 13.25C20.75 18.08 16.83 22 12 22C7.17 22 3.25 18.08 3.25 13.25C3.25 8.42 7.17 4.5 12 4.5C16.83 4.5 20.75 8.42 20.75 13.25Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 8V13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 2H15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="mt-1 leading-none">{auctionEnded ? 'Auction period has expired' : 'Auction ending in:'} </span>
              </div>
              {!auctionEnded && (
                <div className="flex space-x-5 sm:space-x-10">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-semibold sm:text-3xl">
                      {(timeLeft)?.days || 0}
                    </span>
                    <span className="sm:text-lg text-neutral-500 dark:text-neutral-400">
                      Days
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-semibold sm:text-3xl">
                      {(timeLeft)?.hours || 0}
                    </span>
                    <span className="sm:text-lg text-neutral-500 dark:text-neutral-400">
                      hours
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-semibold sm:text-3xl">
                      {(timeLeft)?.minutes || 0}
                    </span>
                    <span className="sm:text-lg text-neutral-500 dark:text-neutral-400">
                      mins
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-semibold sm:text-3xl">
                      {(timeLeft)?.seconds || 0}
                    </span>
                    <span className="sm:text-lg text-neutral-500">secs</span>
                  </div>
                </div>
              )}
            </div>
          }

          <div className="w h-[1px] bg-neutral-100 dark:bg-neutral-700"></div>

          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
            {
              (consideringItem) && currentUsr && (consideringItem).isSale === 2 && (consideringItem).owner && (consideringItem).owner._id !== currentUsr._id ?
                <ButtonPrimary
                  onClick={() => setVisibleModalBid(true)}
                >
                  Place a bid
                </ButtonPrimary> : <></>
            }
            {
              (consideringItem) && currentUsr && (consideringItem).isSale === 2 && (consideringItem).owner && (consideringItem).owner._id === currentUsr._id ?
                (consideringItem).bids.length > 0 ?
                  <ButtonPrimary
                    onClick={() => setVisibleModalAccept(true)}
                  >
                    Accept
                  </ButtonPrimary>
                  :
                  <ButtonPrimary
                    onClick={() => removeSale()}
                  >
                    Remove from sale
                  </ButtonPrimary>
                : <></>
            }
            <ButtonSecondary onClick={() => { navigate(`/nft-detail/${(consideringItem)?._id}`) }} className="flex-1">
              View item
            </ButtonSecondary>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[400px] xl:w-[500px] lg:m-auto relative ">
        <div className="nc-CardLarge1__right cursor-pointer">
          <div onClick={() => { navigate(`/nft-detail/${(consideringItem)?._id || ""}`) }} >
            <NcImage
              containerClassName="aspect-w-1 aspect-h-1 relative"
              className="absolute inset-0 object-cover rounded-3xl sm:rounded-[40px] border-4 sm:border-[14px] border-white dark:border-neutral-800"
              src={(consideringItem)?.logoURL ? `${config.API_URL}uploads/${(consideringItem)?.logoURL}` : ""}
              alt={"title"}
            />
          </div>
          {
            isVideo((consideringItem)) === true &&
            <ItemTypeVideoIcon className="absolute w-8 h-8 md:w-10 md:h-10 left-3 bottom-3 sm:left-7 sm:bottom-[140px] " />
          }
          <LikeButton liked={isLiked} count={(consideringItem)?.likes ? (consideringItem).likes.length : 0} toggleFav={toggleFav} className="absolute right-3 top-3 sm:right-7 sm:top-7" />
        </div>
        <div className="pt-4 sm:pt-8 sm:px-10 flex justify-center">
          <NextPrev
            btnClassName="w-11 h-11 text-xl"
            onClickNext={onClickNext}
            onClickPrev={onClickPrev}
          />
        </div>
      </div>

      <NcModal
        isOpenProp={visibleModalBid}
        onCloseModal={() => setVisibleModalBid(false)}
        contentExtraClass="max-w-lg"
        renderContent={() => (
          <Bid nft={(consideringItem)} onOk={onBid} onCancel={() => setVisibleModalBid(false)} />
        )}
        renderTrigger={() => { }}
        modalTitle="Place a Bid"
      />

      <NcModal
        isOpenProp={visibleModalAccept}
        onCloseModal={() => setVisibleModalAccept(false)}
        contentExtraClass="max-w-lg"
        renderContent={() => (
          <Accept onOk={onAccept} onCancel={() => { setVisibleModalAccept(false) }} nft={(consideringItem)} />
        )}
        renderTrigger={() => { }}
        modalTitle="Accept Sale"
      />


      {<Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={processing}
      >
        <CircularProgress color="inherit" />
      </Backdrop>}

    </div>
  );
};

export default CardLarge1;
