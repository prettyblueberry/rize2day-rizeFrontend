import React, { FC, useEffect, useState, useRef } from "react";
import Avatar from "shared/Avatar/Avatar";
import Badge from "shared/Badge/Badge";
import ButtonPrimary from "shared/Button/ButtonPrimary";
// import ButtonSecondary from "shared/Button/ButtonSecondary";
import NcImage from "shared/NcImage/NcImage";
import LikeSaveBtns from "./LikeSaveBtns";
import BackgroundSection from "components/BackgroundSection/BackgroundSection";
import SectionSliderCategories from "components/SectionSliderCategories/SectionSliderCategories";
import VerifyIcon from "components/VerifyIcon";
import { nftsLargeImgs } from "contains/fakeData";
import axios from "axios";
import TabDetail from "./TabDetail";
// import collectionPng from "images/nfts/collection.png";
import ItemTypeVideoIcon from "components/ItemTypeVideoIcon";
import ItemType3DIcon from "components/ItemType3DIcon";
import LikeButton from "components/LikeButton";
import AccordionInfo from "./AccordionInfo";
import SectionBecomeAnAuthor from "components/SectionBecomeAnAuthor/SectionBecomeAnAuthor";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { config, CATEGORIES } from "app/config";
import {
  changeItemDetail,
  changeItemOwnHistory,
  selectDetailOfAnItem,
  selectCOREPrice,
  selectOwnHistoryOfAnItem,
} from "app/reducers/nft.reducers";
import { useNavigate, useParams } from "react-router-dom";
import { isEmpty } from "app/methods";
import {
  selectCurrentChainId,
  selectCurrentUser,
  selectCurrentWallet,
  selectGlobalProvider,
  selectWalletStatus,
} from "app/reducers/auth.reducers";
import Modal from "../../components/Modal";
import Bid from "./Bid";
import Checkout from "./Checkout";
import Accept from "./Accept";
import PutSale from "./PutSale";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
// import ItemTypeSelect from "components/HeroSearchForm/ItemTypeSelect";
import { io } from "socket.io-client";
// import { acceptOrEndBid, buyNow, destroySale, setApproveForAll, getBalanceOf, placeBid, singleMintOnSale } from "InteractWithSmartContract/interact";
import { toast } from "react-toastify";
import AudioForNft from "components/AudioForNft";
import VideoForNft from "components/VideoForNft";
import ThreeDForNft from "components/ThreeDForNft";
import { nanoid } from "@reduxjs/toolkit";
import { BiFullscreen, BiExitFullscreen } from "react-icons/bi";
import { IconButton } from "@mui/material";
import ButtonPlayMusicRunningContainer from "containers/ButtonPlayMusicRunningContainer";
import { Helmet } from "react-helmet";
import { useSigningClient } from "app/cosmwasm";
import { socket } from "App";
import { getLongAddress } from "app/methods";
import { getSystemTime } from "utils/utils";
import NcModal from "shared/NcModal/NcModal";
import { FILE_TYPE } from "app/config";
import Clock from "./Clock/Clock";

import ButtonSecondary from "shared/Button/ButtonSecondary";

export interface NftDetailPageProps {
  className?: string;
  isPreviewMode?: boolean;
}

const NftDetailPage: FC<NftDetailPageProps> = ({
  className = "",
  isPreviewMode,
}) => {
  const [visibleModalPurchase, setVisibleModalPurchase] = useState(false);
  const [visibleModalBid, setVisibleModalBid] = useState(false);
  const [visibleModalAccept, setVisibleModalAccept] = useState(false);
  const [visibleModalSale, setVisibleModalSale] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedPlName, setSelectedPLName] = useState("");
  const { tokenId } = useParams();
  const [DEMO_NFT_ID] = useState(nanoid());
  const globalProvider = useAppSelector(selectGlobalProvider);
  const globalDetailNFT = useAppSelector(selectDetailOfAnItem);
  const globalOwnHitoryOfNFT = useAppSelector(selectOwnHistoryOfAnItem);
  const currentUsr = useAppSelector(selectCurrentUser);
  const walletStatus = useAppSelector(selectWalletStatus);
  const globalAccount = useAppSelector(selectCurrentWallet);
  const globalChainId = useAppSelector(selectCurrentChainId);
  const globalCOREPrice = useAppSelector(selectCOREPrice);
  const [sysTime, setSysTime] = useState(0);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    listNFT,
    cancelSaleNFT,
    sendToken,
    acceptSaleNFT,
    balances,
    fetchBalance,
  }: any = useSigningClient();

  useEffect(() => {
    socket.on("UpdateStatus", (data) => {
      if (tokenId) {
        if (data?.type === "BURN_NFT" && data?.data?.itemId === tokenId) {
          navigate(`/collectionItems/${data?.data?.colId}`);
          return;
        }
        if (data.data.itemId == tokenId) {
          getNftDetail(tokenId || "");
        }
      }
    });
    (async () => {
      const res = await getSystemTime();
      setSysTime(res);
    })();
  }, []);

  const getNftDetail = async (id: string) => {
    await axios
      .post(
        `${config.API_URL}api/item/get_detail`,
        { id: id },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then(async (result) => {
        let itemData = result.data.data;
        dispatch(changeItemDetail(itemData || {}));
      })
      .catch(() => { });

    await axios
      .post(
        `${config.API_URL}api/item/get_owner_history`,
        { item_id: id },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then((result) => {
        dispatch(changeItemOwnHistory(result.data.data || []));
      })
      .catch(() => { });
  };

  const plusPlayCount = async () => {
    await axios
      .post(
        `${config.API_URL}api/playhistory/createPlayHistory`,
        {
          itemId: globalDetailNFT?._id || "",
          userId: currentUsr?._id || "635808844de50f7f88494338",
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then((result) => {
        dispatch(changeItemOwnHistory(result.data.data || []));
      })
      .catch(() => { });
  };

  const setFavItem = async (target_id: string, user_id: string) => {
    if (isEmpty(target_id) || isEmpty(user_id)) return;
    await axios
      .post(
        `${config.API_URL}api/users/set_fav_item`,
        { target_id: target_id, user_id: user_id },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then(async (result) => {
        await axios
          .post(
            `${config.API_URL}api/item/get_detail`,
            { id: globalDetailNFT?._id || "" },
            {
              headers: {
                "x-access-token": localStorage.getItem("jwtToken"),
              },
            }
          )
          .then((result) => {
            dispatch(changeItemDetail(result.data.data || {}));
            checkIsLiked();
            setRefresh(!refresh);
          })
          .catch(() => { });
      });
  };

  const toggleFav = () => {
    setFavItem(globalDetailNFT._id, currentUsr?._id);
  };

  const checkIsLiked = () => {
    if (globalDetailNFT && currentUsr) {
      if (!globalDetailNFT.likes) {
        setIsLiked(false);
      }
      var isIn = globalDetailNFT?.likes?.includes(currentUsr._id) || false;
      setIsLiked(isIn);
    }
  };

  useEffect(() => {
    getNftDetail(tokenId || "");
    checkIsLiked();
    fetchBalance();
    socket.on("UpdateStatus", (data) => {
      if (tokenId) {
        console.log("UpdateStatus  data ===> ", data);
        if (data?.type === "BURN_NFT" && data?.data?.itemId === tokenId) {
          navigate(`/collectionItems/${data?.data?.colId}`);
          return;
        }
        getNftDetail(tokenId || "");
      }
    });
  }, [tokenId, currentUsr]);

  const checkWalletAddrAndChainId = async () => {
    if (
      isEmpty(currentUsr) === true ||
      currentUsr?._id === undefined ||
      currentUsr?._id === ""
    ) {
      toast.warn("You have to sign in before doing a trading.");
      return false;
    }
    if (walletStatus === false) {
      toast.warn("Please connect and unlock your wallet.");
      return false;
    }
    if (
      globalAccount &&
      currentUsr &&
      currentUsr.address &&
      globalAccount.toLowerCase() !== currentUsr.address.toLowerCase()
    ) {
      toast.warn(
        "Wallet addresses are not equal. Please check current wallet to your registered wallet."
      );
      return false;
    }
    return true;
  };

  const checkNativeCurrencyAndTokenBalances = async (tokenAmountShouldPay) => {
    if (
      balances[config.COIN_MINIMAL_DENOM] <= 0 ||
      (tokenAmountShouldPay > 0 && balances.cw20 <= tokenAmountShouldPay)
    ) {
      toast.warn("Insufficient TESTCORE or RIZE");
      return false;
    }
    return true;
  };

  const getLeftDuration = (created: number, period: number, time: number) => {
    var diff = created * 1000 + period * 1000 - time;
    return (diff = diff / 1000);
  };

  const onBid = async (bidPrice: number) => {
    setVisibleModalBid(false);

    setProcessing(true);
    let checkResut = await checkWalletAddrAndChainId();
    let balanceCheck = await checkNativeCurrencyAndTokenBalances(bidPrice);
    if (!checkResut || !balanceCheck) {
      setProcessing(false);
      return;
    }

    if (
      getLeftDuration(
        globalDetailNFT?.auctionStarted,
        globalDetailNFT?.auctionPeriod,
        Date.now()
      ) <= 12
    ) {
      toast.info("You can place a bid due to auction end time.");
      setTimeout(() => {
        setProcessing(false);
      }, 15000);
    } else {
      // let result = await placeBid(new Web3(globalProvider), currentUsr?.address, tokenId, Number(bidPrice), globalDetailNFT?.chainId || 1);
      // if((result as any).success === true) toast.success((result as any).message);
      // else toast.error((result as any).message);
      try {
        let txHash = await sendToken(
          currentUsr.address,
          bidPrice,
          globalDetailNFT.tokenId,
          globalDetailNFT.collection_id.address
        );
        if (txHash == -1) {
          toast.error("Blockchian network error.");
        } else {
          axios
            .post(`${config.API_URL}api/item/placeAbid`, {
              itemId: globalDetailNFT._id,
              bidder: currentUsr.address,
              price: bidPrice,
            })
            .then((response) => {
              if (response.data.code == 0) {
                toast.success("Successfully placed a bid.");
                getNftDetail(tokenId || "");
              } else {
                toast.error("Server side error.");
              }
            })
            .catch((error) => {
              console.log(">>>", error);
              toast.error("Server side error.");
            });
        }
      } catch (error) {
        console.log(error);
        toast.error("Transactioin failed.");
      }
    }
    setProcessing(false);
  };

  const cofirmBuy = async () => {
    setVisibleModalPurchase(false);

    setProcessing(true);
    let checkResut = await checkWalletAddrAndChainId();
    let balanceCheck = await checkNativeCurrencyAndTokenBalances(
      globalDetailNFT.price
    );
    if (!checkResut || !balanceCheck) {
      setProcessing(false);
      return;
    }
    // let result = await buyNow(new Web3(globalProvider), currentUsr?.address, tokenId, globalDetailNFT?.price, globalDetailNFT?.chainId || 1);
    // if((result as any).success === true) toast.success((result as any).message + "Check your new item in your profile 'Collectibles' .");
    // else toast.error((result as any).message);
    try {
      let txHash = await sendToken(
        currentUsr.address,
        globalDetailNFT.price,
        globalDetailNFT.tokenId,
        globalDetailNFT.collection_id.address
      );
      if (txHash == -1) {
        toast.error("Blockchian network error.");
      } else {
        axios
          .post(`${config.API_URL}api/item/buynow`, {
            itemId: globalDetailNFT._id,
            buyer: currentUsr.address,
            seller: globalDetailNFT.owner?.address,
            price: globalDetailNFT.price,
          })
          .then((response) => {
            if (response.data.code == 0) {
              toast.success("Successfully bought an item.");
              getNftDetail(tokenId || "");
            } else {
              toast.error("Server side error.");
            }
          })
          .catch((error) => {
            console.log(" >>>> ", error);
            toast.error("Server side error.");
          });
      }
    } catch (error) {
      console.log(error);
      toast.error("Transactioin failed.");
    }
    getNftDetail(tokenId || "");
    setProcessing(false);
  };

  const onPutSale = async (price: number, instant: boolean, period: number) => {
    setVisibleModalSale(false);

    if (Number(price) <= 0 || isNaN(price)) {
      toast.error("Invalid price.");
      return;
    }

    setProcessing(true);
    let checkResut = await checkWalletAddrAndChainId();
    let balanceCheck = await checkNativeCurrencyAndTokenBalances(price);
    if (!checkResut || !balanceCheck) {
      setProcessing(false);
      return;
    }

    var aucperiod = instant === true ? 0 : period * 24 * 3600;

    // let result = await setApproveForAll(new Web3(globalProvider),  currentUsr?.address, (chains as any)[globalDetailNFT?.chainId || 1]?.platformContractAddress || "", globalDetailNFT?.chainId || 1 );
    // if((result as any).success === true) toast.success((result as any).message);
    // if((result as any).success === false) {
    //   toast.error((result as any).message);
    //   setProcessing(false);
    //   return;
    // }
    // result = await singleMintOnSale(new Web3(globalProvider),  currentUsr?.address, tokenId, aucperiod * 24 * 3600 , price, 0, globalDetailNFT?.chainId || 1);
    // if((result as any).success === true) toast.success((result as any).message);
    // else toast.error((result as any).message);
    try {
      let txhash = await listNFT(
        currentUsr.address,
        globalDetailNFT.collection_id.cw721address,
        !instant ? "Auction" : "Fixed",
        !instant
          ? {
            Time: [
              Math.floor(Date.now() / 1000),
              Math.floor(Date.now() / 1000) + Math.floor(aucperiod),
            ],
          }
          : "Fixed",
        price,
        price,
        config.COIN_MINIMAL_DENOM,
        globalDetailNFT.tokenId,
        globalDetailNFT.collection_id.address
      );
      if (txhash != -1) {
        //update db
        await axios
          .post(`${config.API_URL}api/item/updateForSale`, {
            itemId: globalDetailNFT._id,
            period: aucperiod,
            price: price,
          })
          .then((response) => {
            if (response.data.code == 0) {
              toast.success("Succeed put on sale.");
              getSystemTime().then((resp) => setSysTime(resp));
            } else {
              toast.error("Server side error");
            }
            getNftDetail(tokenId || "");
          })
          .catch((error) => {
            toast.error("Server side error");
          });
      } else {
        toast.error("Blockchian network error.");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    setProcessing(false);
  };

  const removeSale = async () => {
    if (globalDetailNFT?.owner?._id !== currentUsr?._id) {
      toast.warn("You are not the owner of this nft.");
      return;
    }

    if (globalDetailNFT?.bids.length > 0 && globalDetailNFT?.isSale === 2) {
      toast.warn(
        "You cannot remove it from sale because you had one or more bid(s) already."
      );
      return;
    }

    setProcessing(true);
    let checkResut = await checkWalletAddrAndChainId();
    let balanceCheck = await checkNativeCurrencyAndTokenBalances(0);
    if (!checkResut || !balanceCheck) {
      setProcessing(false);
      return;
    }

    let iHaveit;
    // iHaveit = await getBalanceOf(new Web3(globalProvider), currentUsr?.address, tokenId, globalDetailNFT?.chainId || 1);
    // if (iHaveit === 1) {
    //   setProcessing(false);
    //   toast.warn("Your NFT is not on sale.");
    //   return;
    // }
    if (iHaveit && (iHaveit as any).message) {
      toast.warn(`${(iHaveit as any).message}`);
      return;
    }
    // let result = await destroySale(new Web3(globalProvider), currentUsr?.address, tokenId, globalDetailNFT?.chainId || 1);
    // if((result as any).success === true) toast.success((result as any).message);
    // else toast.error((result as any).message);
    try {
      let txHash = await cancelSaleNFT(
        currentUsr.address,
        globalDetailNFT.collection_id.address,
        globalDetailNFT.tokenId
      );
      if (txHash == -1) {
        toast.error("Blockchian network error.");
        return;
      } else {
        axios
          .post(`${config.API_URL}api/item/removeFromSale`, {
            itemId: globalDetailNFT._id,
          })
          .then((response) => {
            if (response.data.code == 0)
              toast.success("Succeed in unlisting an item.");
            else toast.error("Server side error");
            getNftDetail(tokenId || "");
          })
          .catch((error) => {
            toast.error("Server side error");
          });
      }
    } catch (error) {
      toast.error(error.message);
    }
    setProcessing(false);
  };

  const onAccept = async () => {
    setVisibleModalAccept(false);

    setProcessing(true);
    let checkResut = await checkWalletAddrAndChainId();
    let balanceCheck = await checkNativeCurrencyAndTokenBalances(0);
    if (!checkResut || !balanceCheck) {
      setProcessing(false);
      return;
    }

    // let result = await acceptOrEndBid(new Web3(globalProvider), currentUsr?.address, tokenId, globalDetailNFT?.chainId || 1);
    // if((result as any).success === true) toast.success((result as any).message);
    // else toast.error((result as any).message);
    try {
      let txHash = await acceptSaleNFT(
        currentUsr.address,
        globalDetailNFT.collection_id.address,
        globalDetailNFT.tokenId
      );
      if (txHash == -1) {
        toast.error("Network connection error.");
      } else {
        axios
          .post(`${config.API_URL}api/item/acceptBid`, {
            itemId: globalDetailNFT._id,
          })
          .then((response) => {
            if (response.data.code == 0) {
              getNftDetail(tokenId || "");
              toast.success("You sold an item.");
            } else toast.error("Server side error.");
          });
      }
    } catch (error) {
      console.log(error);
      toast.error("Transaction failed");
    }
    setProcessing(false);
  };

  const addToPlayList = async (nameOfPL: String) => {
    await axios
      .post(
        `${config.API_URL}api/playlist/createPlayList`,
        {
          itemId: globalDetailNFT?._id || "",
          userId: currentUsr?._id || "",
          name: nameOfPL || "",
        },
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
    setProcessing(false);
    setSelectedPLName("");
  };

  const renderSection1 = () => {
    return (
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        <div className="space-y-5 pb-9">
          <div className="flex items-center justify-between">
            <Badge
              name={
                CATEGORIES.find(
                  (x) => x.value === globalDetailNFT?.collection_id?.category
                )?.text || ""
              }
              color="green"
            />
            <div className="flex gap-3">
              <LikeSaveBtns ownerId={globalDetailNFT?.owner?._id || ""} />
            </div>
          </div>
          <h2 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">
            {globalDetailNFT?.name || ""}
          </h2>

          <div className="flex flex-col space-y-4 text-sm sm:flex-row sm:items-center sm:space-y-0 sm:space-x-8">
            <div
              className="flex items-center cursor-pointer "
              onClick={() =>
                navigate(`/page-author/${globalDetailNFT?.creator?._id || ""}`)
              }
            >
              <Avatar
                imgUrl={
                  globalDetailNFT?.creator?.avatar
                    ? `${config.API_URL}uploads/${globalDetailNFT.creator.avatar}`
                    : undefined
                }
                sizeClass="h-9 w-9"
                radius="rounded-full"
              />
              <span className="ml-2.5 text-neutral-500 dark:text-neutral-400 flex flex-col">
                <span className="text-sm">Creator</span>
                <span className="flex items-center font-medium text-neutral-900 dark:text-neutral-200">
                  <span>{globalDetailNFT?.creator?.username || ""}</span>
                  <VerifyIcon iconClass="w-4 h-4" />
                </span>
              </span>
            </div>
            <div className="hidden h-6 border-l sm:block border-neutral-200 dark:border-neutral-600"></div>
            <div
              className="flex items-center"
              onClick={() =>
                navigate(
                  `/collectionItems/${globalDetailNFT?.collection_id?._id || ""
                  }`
                )
              }
            >
              <Avatar
                imgUrl={`${config.API_URL}uploads/${globalDetailNFT?.collection_id?.logoURL || ""
                  }`}
                sizeClass="h-9 w-9"
                radius="rounded-full"
              />
              <span className="ml-2.5 text-neutral-500 dark:text-neutral-400 flex flex-col">
                <span className="text-sm">Collection</span>
                <span className="flex items-center font-medium text-neutral-900 dark:text-neutral-200">
                  <span>{globalDetailNFT?.collection_id?.name}</span>
                  <VerifyIcon iconClass="w-4 h-4" />
                </span>
              </span>
            </div>
          </div>
        </div>

        {globalDetailNFT?.isSale === 2 && (
          <div className="py-9">
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
                <span className="mt-1 leading-none">
                  {auctionEnded
                    ? "Auction period has expired"
                    : "Auction ending in:"}{" "}
                </span>
              </div>
              {!auctionEnded && (
                <Clock nftItem={globalDetailNFT} sysTime={sysTime} setAuctionEnded={() => setAuctionEnded(true)} />
              )}
            </div>
          </div>
        )}

        <div className="pb-9 pt-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div className="relative flex flex-col items-baseline flex-1 p-6 border-2 border-green-500 sm:flex-row rounded-xl">
              <span className="absolute bottom-full translate-y-1 py-1 px-1.5 bg-white dark:bg-[#191818] text-sm text-neutral-500 dark:text-neutral-400">
                {globalDetailNFT?.isSale == 2
                  ? globalDetailNFT?.bids && globalDetailNFT.bids.length > 0
                    ? "Current Bid"
                    : "Start price"
                  : globalDetailNFT?.isSale == 1
                    ? "Sale Price"
                    : "Price"}
              </span>
              <span className="text-3xl font-semibold text-green-500 xl:text-4xl">
                {globalDetailNFT?.isSale == 2
                  ? `${globalDetailNFT.bids && globalDetailNFT.bids.length > 0
                    ? globalDetailNFT.bids[globalDetailNFT.bids.length - 1]
                      .price
                      ? globalDetailNFT.bids[
                        globalDetailNFT.bids.length - 1
                      ].price
                      : 0
                    : globalDetailNFT?.price
                  } 
                  RIZE
                  `
                  : `${globalDetailNFT?.price || 0} RIZE
                `}
              </span>
              <span className="text-lg text-neutral-400 sm:ml-5">
                {globalDetailNFT?.isSale == 2
                  ? `( ≈ $ ${globalDetailNFT.bids && globalDetailNFT.bids.length > 0
                    ? globalDetailNFT.bids[globalDetailNFT.bids.length - 1]
                      .price
                      ? (
                        globalDetailNFT.bids[
                          globalDetailNFT.bids.length - 1
                        ].price * globalCOREPrice
                      )?.toFixed(2)
                      : 0
                    : (globalDetailNFT?.price * globalCOREPrice)?.toFixed(
                      2
                    ) || 0
                  } )`
                  : `( ≈ $ ${(globalDetailNFT?.price * globalCOREPrice)?.toFixed(2) ||
                  0
                  })`}
              </span>
            </div>

            {/* <span className="mt-2 ml-5 text-sm text-neutral-500 dark:text-neutral-400 sm:mt-0 sm:ml-10">
              [96 in stock]
            </span> */}
          </div>

          <div className="flex flex-col mt-8 space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
            {globalDetailNFT &&
              currentUsr &&
              globalDetailNFT.isSale === 1 &&
              globalDetailNFT.owner &&
              globalDetailNFT.owner._id !== currentUsr._id ? (
              <ButtonPrimary onClick={() => setVisibleModalPurchase(true)}>
                Purchase now
              </ButtonPrimary>
            ) : (
              <></>
            )}
            {globalDetailNFT &&
              currentUsr &&
              globalDetailNFT.isSale === 2 &&
              globalDetailNFT.owner &&
              globalDetailNFT.owner._id !== currentUsr._id &&
              !auctionEnded ? (
              <ButtonPrimary onClick={() => setVisibleModalBid(true)}>
                Place a bid
              </ButtonPrimary>
            ) : (
              <></>
            )}
            {globalDetailNFT &&
              currentUsr &&
              globalDetailNFT.isSale === 2 &&
              globalDetailNFT.owner &&
              globalDetailNFT.owner._id === currentUsr._id ? (
              globalDetailNFT.bids.length > 0 ? (
                <ButtonPrimary onClick={() => setVisibleModalAccept(true)}>
                  Accept
                </ButtonPrimary>
              ) : (
                <ButtonPrimary onClick={() => removeSale()}>
                  Remove from sale
                </ButtonPrimary>
              )
            ) : (
              <></>
            )}
            {globalDetailNFT &&
              currentUsr &&
              globalDetailNFT.owner &&
              globalDetailNFT.owner._id === currentUsr._id &&
              globalDetailNFT.isSale === 0 && (
                <ButtonPrimary onClick={() => setVisibleModalSale(true)}>
                  Put on sale
                </ButtonPrimary>
              )}
            {globalDetailNFT &&
              currentUsr &&
              globalDetailNFT.owner &&
              globalDetailNFT.owner._id === currentUsr._id &&
              globalDetailNFT.isSale === 1 && (
                <ButtonPrimary onClick={() => removeSale()}>
                  Remove from sale
                </ButtonPrimary>
              )}
          </div>
        </div>

        <div className="pt-9">
          <TabDetail nft={globalDetailNFT} ownHistory={globalOwnHitoryOfNFT} />
        </div>
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
  const renderPurchaseModalContent = () => {
    return (
      <Checkout
        onOk={cofirmBuy}
        nft={globalDetailNFT}
        onCancel={() => setVisibleModalPurchase(false)}
      />
    );
  };

  const renderBidModalContent = () => {
    return (
      <Bid
        nft={globalDetailNFT}
        onOk={onBid}
        onCancel={() => setVisibleModalBid(false)}
      />
    );
  };

  const renderAcceptModalContent = () => {
    return (
      <Accept
        onOk={onAccept}
        onCancel={() => {
          setVisibleModalAccept(false);
        }}
        nft={globalDetailNFT}
      />
    );
  };

  const renderSaleModalContent = () => {
    return (
      <PutSale
        onOk={onPutSale}
        nft={globalDetailNFT}
        onCancel={() => setVisibleModalSale(false)}
      />
    );
  };

  const renderTrigger = () => {
    return null;
  };
  const renderListenButtonDefault = (state?: "playing" | "loading") => {
    return (
      <div
        className={`w-14 h-14 flex items-center justify-center rounded-full bg-neutral-50 text-primary-500 cursor-pointer`}
      >
        {renderIcon(state)}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Detail Item || Rize2Day </title>
      </Helmet>
      <div
        className={`nc-NftDetailPage  ${className}`}
        data-nc-id="NftDetailPage"
      >
        <main className="container flex mt-11 ">
          <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-2 md:gap-14">
            <div className="space-y-8 lg:space-y-10">
              <div className="relative">
                <NcImage
                  src={
                    globalDetailNFT.fileType >= FILE_TYPE.AUDIO
                      ? `${config.API_URL}uploads/${globalDetailNFT?.logoURL}`
                      : `${config.ipfsGateway}${globalDetailNFT?.logoURL}`
                  }
                  containerClassName="aspect-w-11 aspect-h-12 rounded-3xl overflow-hidden"
                />
                {globalDetailNFT.fileType === FILE_TYPE.THREED && (
                  <>
                    <ItemType3DIcon className="absolute w-8 h-8 left-3 top-3 md:w-10 md:h-10" />
                    <ThreeDForNft
                      src={
                        globalDetailNFT?.musicURL
                          ? `${config.ipfsGateway}${globalDetailNFT.musicURL}`
                          : undefined
                      }
                      nftId={globalDetailNFT?._id || DEMO_NFT_ID}
                    />
                  </>
                )}
                {globalDetailNFT.fileType === FILE_TYPE.VIDEO && (
                  <>
                    <ItemTypeVideoIcon className="absolute w-8 h-8 left-3 top-3 md:w-10 md:h-10" />
                    <VideoForNft
                      src={
                        globalDetailNFT?.musicURL
                          ? `${config.ipfsGateway}${globalDetailNFT.musicURL}?stream=true`
                          : undefined
                      }
                      nftId={globalDetailNFT?._id || DEMO_NFT_ID}
                    />
                  </>
                )}
                {globalDetailNFT.fileType === FILE_TYPE.AUDIO && (
                  <AudioForNft
                    src={
                      globalDetailNFT?.musicURL
                        ? `${config.ipfsGateway}${globalDetailNFT.musicURL}`
                        : undefined
                    }
                    nftId={globalDetailNFT?._id || DEMO_NFT_ID}
                  />
                )}

                <LikeButton
                  className="absolute right-3 top-3 "
                  liked={isLiked}
                  count={
                    globalDetailNFT?.likes ? globalDetailNFT.likes.length : 0
                  }
                  toggleFav={toggleFav}
                />
                {globalDetailNFT.fileType >= 2 && (
                  <ButtonPlayMusicRunningContainer
                    className="absolute z-20 bottom-3 left-3"
                    nftId={globalDetailNFT?._id || DEMO_NFT_ID}
                    renderDefaultBtn={() => renderListenButtonDefault()}
                    renderPlayingBtn={() =>
                      renderListenButtonDefault("playing")
                    }
                    renderLoadingBtn={() =>
                      renderListenButtonDefault("loading")
                    }
                    increaseFunc={plusPlayCount}
                  />
                )}
                {globalDetailNFT.fileType >= 2 && (
                  <div
                    className={`absolute z-10 bottom-3 right-3 bg-black/50 px-3.5 h-10 flex items-center justify-center rounded-full text-white ${className}`}
                  >
                    {globalDetailNFT?.playCount || 0}
                  </div>
                )}
              </div>

              <AccordionInfo
                description={globalDetailNFT?.description || ""}
                contractAddress={
                  globalDetailNFT?.collection_id?.cw721address || ""
                }
                id={globalDetailNFT?._id || ""}
                logoURL={globalDetailNFT?.logoURL || ""}
                stockAmount={globalDetailNFT?.stockAmount || 1}
                chainId={globalDetailNFT?.chainId || 1}
                tokenId={globalDetailNFT?.tokenId || 0}
              />
            </div>

            <div className="pt-10 border-t-2 lg:pt-0 xl:pl-10 border-neutral-200 dark:border-neutral-600 lg:border-t-0">
              {renderSection1()}
            </div>
          </div>
        </main>

        {!isPreviewMode && (
          <div className="container py-24 lg:py-32">
            <div className="relative py-24 lg:py-28">
              <BackgroundSection />
              <SectionSliderCategories />
            </div>
          </div>
        )}

        <NcModal
          isOpenProp={visibleModalPurchase}
          onCloseModal={() => setVisibleModalPurchase(false)}
          contentExtraClass="max-w-lg"
          renderContent={renderPurchaseModalContent}
          renderTrigger={renderTrigger}
          modalTitle="Purchase NFT Now"
        />

        <NcModal
          isOpenProp={visibleModalBid}
          onCloseModal={() => setVisibleModalBid(false)}
          contentExtraClass="max-w-lg"
          renderContent={renderBidModalContent}
          renderTrigger={renderTrigger}
          modalTitle="Place a Bid"
        />

        <NcModal
          isOpenProp={visibleModalAccept}
          onCloseModal={() => setVisibleModalAccept(false)}
          contentExtraClass="max-w-lg"
          renderContent={renderAcceptModalContent}
          renderTrigger={renderTrigger}
          modalTitle="Accept Sale"
        />

        <NcModal
          isOpenProp={visibleModalSale}
          onCloseModal={() => setVisibleModalSale(false)}
          contentExtraClass="max-w-lg"
          renderContent={renderSaleModalContent}
          renderTrigger={renderTrigger}
          modalTitle="Put on Sale"
        />

        {
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={processing}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        }
      </div>
    </>
  );
};

export default NftDetailPage;
