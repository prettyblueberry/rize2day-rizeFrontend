import { FC, useEffect, useState } from "react";
import NcDropDown, { NcDropDownItem } from "shared/NcDropDown/NcDropDown";
import { useAppDispatch, useAppSelector } from "app/hooks";
import {
  selectCurrentChainId,
  selectCurrentUser,
  selectCurrentWallet,
  selectGlobalProvider,
  selectWalletStatus,
} from "app/reducers/auth.reducers";
import {
  selectDetailOfAnItem,
  changeItemDetail,
  changeItemOwnHistory,
} from "app/reducers/nft.reducers";
import { toast } from "react-toastify";
import { isEmpty } from "app/methods";
import { config } from "app/config";
import Modal from "./Modal";
import Transfer from "containers/NftDetailPage/Transfer";
import RemoveSale from "containers/NftDetailPage/RemoveSale";
import DeleteItem from "containers/NftDetailPage/DeleteItem";

import ModalDelete from "./ModalDelete";
import ModalEdit from "./ModalEdit";
import ModalTransferToken from "./ModalTransferToken";

import Burn from "containers/NftDetailPage/Burn";
import ChangePrice from "containers/NftDetailPage/ChangePrice";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSigningClient } from "app/cosmwasm";

export interface NftMoreDropdownProps {
  containerClassName?: string;
  iconClass?: string;
  dropdownPositon?: "up" | "down";
  actions?: { id: string; name: string; icon?: string; href?: string }[];
}

const actionsDefault: NftMoreDropdownProps["actions"] = [
  { id: "edit", name: "Change price", icon: "las la-dollar-sign" },
  { id: "transferToken", name: "Transfer token", icon: "las la-sync" },
  // { id: "Delete", name: "Delete from website", icon:"las la-trash-alt" },
  // { id: "Unlist", name: "Remove from sale", icon: "las la-flag" },
  { id: "burn", name: "Burn item", icon: "las la-trash-alt" },
];

const NftMoreDropdown: FC<NftMoreDropdownProps> = ({
  containerClassName = "py-1.5 px-3 flex rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer",
  iconClass = "w-4 h-4 sm:h-5 sm:w-5",
  dropdownPositon = "down",
  actions = actionsDefault,
}) => {
  const [isEditting, setIsEditting] = useState(false);
  const [isBurning, setIsBurning] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUnlisting, setIsUnlisting] = useState(false);
  const [isTransfering, setIsTransfering] = useState(false);
  const [processing, setProcessing] = useState(false);
  const globalProvider = useAppSelector(selectGlobalProvider);
  const { tokenId } = useParams();
  const globalDetailNFT = useAppSelector(selectDetailOfAnItem);
  const currentUsr = useAppSelector(selectCurrentUser);
  const walletStatus = useAppSelector(selectWalletStatus);
  const globalAccount = useAppSelector(selectCurrentWallet);
  const globalChainId = useAppSelector(selectCurrentChainId);
  const { updateNFT, transferNFT, burnNFT, balances }: any = useSigningClient();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

  const openModalEdit = () => setIsEditting(true);
  const closeModalEdit = () => setIsEditting(false);

  const openModalBurn = () => setIsBurning(true);
  const closeModalBurn = () => setIsBurning(false);

  const openModalDelete = () => setIsBurning(true);
  const closeModalDelete = () => setIsBurning(false);

  const openModalRemove = () => setIsUnlisting(true);
  const closeModalRemove = () => setIsUnlisting(false);

  const openModalTransferToken = () => setIsTransfering(true);
  const closeModalTransferToken = () => setIsTransfering(false);

  const hanldeClickDropDown = (item: NcDropDownItem) => {
    if (item.href) {
      return;
    }

    if (item.id === "edit") {
      return openModalEdit();
    }
    if (item.id === "Delete") {
      return openModalDelete();
    }
    if (item.id === "Unlist") {
      return openModalRemove();
    }
    if (item.id === "burn") {
      return openModalBurn();
    }
    if (item.id === "transferToken") {
      return openModalTransferToken();
    }
    return;
  };

  const checkWalletAddrAndChainId = async () => {
    if (isEmpty(currentUsr) === true) {
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
      (currentUsr as any).address &&
      (globalAccount as string).toLowerCase() !==
        (currentUsr as any).address.toLowerCase()
    ) {
      toast.warn(
        "Wallet addresses are not equal. Please check current wallet to your registered wallet."
      );
      return false;
    }
    return true;
  };

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
      .then((result) => {
        dispatch(changeItemDetail(result.data.data || {}));
      })
      .catch(() => {});

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
      .catch(() => {});
  };

  const setNewPrice = async (newPrice: number) => {
    setIsEditting(true);

    if (newPrice < 0) {
      toast.warning("Price can not be a negative number.");
      return;
    }

    if (globalDetailNFT?.owner?._id !== (currentUsr as any)?._id) {
      toast.warning("You are not the owner of this nft.");
      return;
    }

    if (globalDetailNFT?.bids?.length > 0 && globalDetailNFT?.isSale === 2) {
      toast.warn(
        "You cannot change the price of NFT because you had one or more bid(s) already."
      );
      return;
    }

    setProcessing(true);
    let iHaveit;
    try {
      iHaveit = 0; //await getBalanceOf(new Web3(globalProvider), (currentUsr as any)?.address, globalDetailNFT?._id, globalDetailNFT?.chainId || 1);
      if (iHaveit === 1) {
        setProcessing(false);
        toast.warn("Your NFT is not on sale.");
        return;
      }
      if (iHaveit && (iHaveit as any)?.message) {
        toast.warn((iHaveit as any)?.message);
      }
      let checkResut = await checkWalletAddrAndChainId();
      if (!checkResut) {
        setProcessing(false);
        return;
      }

      // let result = await changePrice(new Web3(globalProvider), (currentUsr as any)?.address, globalDetailNFT?._id, newPrice, globalDetailNFT?.chainId || 1 );
      // if((result as any).success === true) toast.success((result as any).message + "Check your new item in your profile 'Collectibles' .");
      // else toast.error((result as any).message);
      try {
        let checkBalance = await checkNativeCurrencyAndTokenBalances(0);
        if (checkBalance == false) return;
        let txHash = await updateNFT(
          currentUsr.address,
          globalDetailNFT.collection_id.address,
          globalDetailNFT.tokenId,
          globalDetailNFT.isSale == 2 ? "Auction" : "Fixed",
          globalDetailNFT.isSale == 1
            ? "Fixed"
            : {
                Time: [
                  Math.floor(Number(globalDetailNFT.auctionStarted)),
                  Math.floor(globalDetailNFT.auctionStarted) +
                    Math.floor(globalDetailNFT.auctionPeriod),
                ],
              },
          newPrice,
          globalDetailNFT.lastPrice,
          { cw20: config.CW20_CONTRACT }
        );
        if (txHash != -1) {
          //update db
          await axios
            .post(`${config.API_URL}api/item/changePrice`, {
              itemId: globalDetailNFT._id,
              newPrice: newPrice,
            })
            .then((response) => {
              if (response.data.code == 0) {
                toast.success("You 've updated price.");
                getNftDetail(globalDetailNFT._id || "");
              } else toast.error("Server side error");
            })
            .catch((error) => {
              console.log(error);
              toast.error("Server side error");
            });
        } else {
          toast.error("Network error.");
        }
      } catch (error) {
        console.log(error);
        toast.error("Transaction failed.");
      }

      setProcessing(false);
    } catch (err) {
      setProcessing(false);
      console.log("failed on changing price : ", err);
    }
  };

  const removeSale = async () => {
    setIsUnlisting(true);

    if (globalDetailNFT?.owner._id !== (currentUsr as any)?._id) {
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
    let iHaveit;
    try {
      iHaveit = 0; //await getBalanceOf(new Web3(globalProvider), (currentUsr as any)?.address, globalDetailNFT?._id, globalDetailNFT?.chainId || 1);
      if (iHaveit === 1) {
        setProcessing(false);
        toast.warn("Your NFT is not on sale.");
        return;
      }
      if (iHaveit && (iHaveit as any).message) {
        toast.warn((iHaveit as any).message);
      }
      let checkResut = await checkWalletAddrAndChainId();
      if (!checkResut) {
        setProcessing(false);
        return;
      }

      // let result = await destroySale(new Web3(globalProvider), (currentUsr as any)?.address, globalDetailNFT?._id, globalDetailNFT?.chainId || 1);
      // if((result as any).success === true) toast.success((result as any).message + "Check your new item in your profile 'Collectibles' .");
      // else toast.error((result as any).message);

      setProcessing(false);
    } catch (err) {
      setProcessing(false);
      console.log("failed on remove sale : ", err);
    }
  };

  const deleteItem = async () => {
    setIsDeleting(true);
    await axios
      .post(`${config.API_URL}api/item/deleteOne`, {
        ownerId: currentUsr?._id || "",
        itemId: globalDetailNFT?._id || "",
      })
      .then((docs) => {
        toast.success("You've deleted an item.");
        navigate(`/page-author/${currentUsr?._id || ""}`);
      })
      .catch((err) => {
        console.log("delete an item : ", err);
      });
  };

  const burnToken = async () => {
    setIsBurning(true);

    if (globalDetailNFT?.owner._id !== (currentUsr as any)?._id) {
      toast.warn("You are not the owner of this nft.");
      return;
    }
    setProcessing(true);
    let iHaveit;
    try {
      iHaveit = 1; //await getBalanceOf(new Web3(globalProvider), (currentUsr as any)?.address, globalDetailNFT?._id, globalDetailNFT?.chainId || 1);
      if (iHaveit === 0) {
        setProcessing(false);
        toast.warn(
          "You cannot burn NFT while it is on sale or you've not minted it ever."
        );
        return;
      }
      if (iHaveit && (iHaveit as any).message) {
        toast.warn((iHaveit as any).message);
      }
      let checkBalance = await checkNativeCurrencyAndTokenBalances(0);
      if (checkBalance == false) return;
      let checkResut = await checkWalletAddrAndChainId();
      if (!checkResut) {
        setProcessing(false);
        return;
      }

      // let result = await burnNFT(new Web3(globalProvider), (currentUsr as any)?.address, globalDetailNFT?._id, globalDetailNFT?.chainId || 1);
      // if((result as any).success === true) toast.success((result as any).message + "Check your new item in your profile 'Collectibles' .");
      // else toast.error((result as any).message);
      try {
        let txHash = burnNFT(
          currentUsr.address,
          globalDetailNFT.collection_id.cw721address,
          globalDetailNFT.tokenId
        );
        if (txHash == -1) {
          toast.error("Network error.");
        } else {
          axios
            .post(`${config.API_URL}api/item/burntNFT`, {
              itemId: globalDetailNFT._id || "",
            })
            .then((response) => {
              if (response.data.code == 0) {
                toast.success("You 've burnt an item.");
                navigate("/page-search");
              } else {
                toast.error("Internal server error.");
              }
            })
            .catch((error) => {
              console.log(error);
              toast.error("Internal server error.");
            });
        }
      } catch (error) {
        console.log(error);
        toast.error("Transaction failed.");
      }
      setProcessing(false);
    } catch (err) {
      setProcessing(false);
      console.log("failed on burn token : ", err);
    }
  };

  const transferToken = async (toAddr: string) => {
    setIsTransfering(true);

    if (globalDetailNFT?.owner._id !== (currentUsr as any)?._id) {
      toast.warn("You are not the owner of this nft.");
      return;
    }
    setProcessing(true);
    let iHaveit;
    try {
      iHaveit = 1; //await getBalanceOf(new Web3(globalProvider), (currentUsr as any)?.address, globalDetailNFT?._id, globalDetailNFT?.chainId || 1);
      if (iHaveit === 0) {
        setProcessing(false);
        toast.warn(
          "You cannot transfer NFT while it is on sale or you've not minted it ever."
        );
        return;
      }
      if (iHaveit && (iHaveit as any).message) {
        toast.warn((iHaveit as any).message);
      }
      let checkBalance = await checkNativeCurrencyAndTokenBalances(0);
      if (checkBalance == false) return;
      let checkResut = await checkWalletAddrAndChainId();
      if (!checkResut) {
        setProcessing(false);
        return;
      }
      // let result = await transferNFT(new Web3(globalProvider), (currentUsr as any)?.address, toAddr, globalDetailNFT?._id, globalDetailNFT?.chainId || 1);
      // if((result as any).success === true) toast.success((result as any).message + "Check your new item in your profile 'Collectibles' .");
      // else toast.error((result as any).message);
      try {
        let txHash = transferNFT(
          currentUsr.address,
          globalDetailNFT.collection_id.cw721address,
          toAddr,
          globalDetailNFT.tokenId
        );
        if (txHash == -1) {
          toast.error("Network error.");
        } else {
          axios
            .post(`${config.API_URL}api/item/transferedNFT`, {
              itemId: globalDetailNFT._id,
              sender: currentUsr.address,
              receiver: toAddr,
            })
            .then((response) => {
              if (response.data.code == 0) {
                toast.success("You 've sent an item.");
                getNftDetail(globalDetailNFT._id || "");
              } else {
                toast.error("Internal server error.");
              }
            })
            .catch((error) => {
              console.log(error);
              toast.error("Internal server error.");
            });
        }
      } catch (error) {
        console.log(error);
        toast.error("Transaction failed.");
      }
      setProcessing(false);
    } catch (err) {
      setProcessing(false);
      console.log("failed on transfer token : ", err);
    }
  };

  const renderMenu = () => {
    return (
      <NcDropDown
        className={` ${containerClassName} `}
        iconClass={iconClass}
        data={actions}
        panelMenusClass={
          dropdownPositon === "up"
            ? "origin-bottom-right bottom-0 "
            : "origin-top-right !w-44 sm:!w-52"
        }
        onClick={hanldeClickDropDown}
      />
    );
  };

  return (
    <div className="">
      {renderMenu()}

      <ModalEdit
        show={isEditting}
        onOk={setNewPrice}
        onCloseModalEdit={closeModalEdit}
      />
      <ModalDelete
        show={isBurning}
        onOk={() => burnToken()}
        onCloseModalDelete={closeModalDelete}
      />
      <ModalTransferToken
        show={isTransfering}
        onOk={transferToken}
        onCloseModalTransferToken={closeModalTransferToken}
      />
    </div>
  );
};

export default NftMoreDropdown;
