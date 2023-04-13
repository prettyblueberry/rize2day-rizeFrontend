import { FC, useEffect, useState } from "react";
import NcDropDown, { NcDropDownItem } from "shared/NcDropDown/NcDropDown";
import { useAppDispatch, useAppSelector } from "app/hooks";
import {
  selectCurrentNetworkSymbol,
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
import Web3 from "web3";
import { ACTIVE_CHAINS, config, PLATFORM_NETWORKS } from "app/config";
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
import {
  changePrice,
  destroySale,
  burnEVMNFT,
  getBalanceOf,
  isSupportedEVMNetwork,
  transferEVMNFT,
} from "InteractWithSmartContract/interact";

export interface NftMoreDropdownProps {
  containerClassName?: string;
  iconClass?: string;
  dropdownPositon?: "up" | "down";
  actions?: { id: string; name: string; icon?: string; href?: string }[];
}

const actionsDefault: NftMoreDropdownProps["actions"] = [
  { id: "edit", name: "Change price", icon: "las la-dollar-sign" },
  { id: "transferToken", name: "Transfer token", icon: "las la-sync" },
  { id: "burn", name: "Burn item", icon: "las la-trash-alt" },
];

const NftMoreDropdown: FC<NftMoreDropdownProps> = ({
  containerClassName = "py-1.5 px-3 flex rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer",
  iconClass = "w-4 h-4 sm:h-5 sm:w-5",
  dropdownPositon = "down",
  actions = actionsDefault,
}) => {
  const globalDetailNFT = useAppSelector(selectDetailOfAnItem);
  const currentUsr = useAppSelector(selectCurrentUser);
  const walletStatus = useAppSelector(selectWalletStatus);
  const globalAccount = useAppSelector(selectCurrentWallet);
  const currentNetworkSymbol = useAppSelector(selectCurrentNetworkSymbol);

  const [isEditting, setIsEditting] = useState(false);
  const [isBurning, setIsBurning] = useState(false);
  const [isTransfering, setIsTransfering] = useState(false);
  const [processing, setProcessing] = useState(false);
  const globalProvider = useAppSelector(selectGlobalProvider);
  const { updateNFT, transferNFT, burnNFT, balances }: any = useSigningClient();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const checkNativeCurrencyAndTokenBalances = async (tokenAmountShouldPay) => {
    if (
      balances[config.COIN_MINIMAL_DENOM] <= 0 ||
      (tokenAmountShouldPay > 0 && balances.cw20 <= tokenAmountShouldPay)
    ) {
      toast.warn("Insufficient TESTCORE or USD");
      return false;
    }
    return true;
  };

  const openModalEdit = () => setIsEditting(true);
  const closeModalEdit = () => setIsEditting(false);

  const openModalBurn = () => setIsBurning(true);
  const closeModalBurn = () => setIsBurning(false);

  const openModalTransferToken = () => setIsTransfering(true);
  const closeModalTransferToken = () => setIsTransfering(false);

  const hanldeClickDropDown = (item: NcDropDownItem) => {
    if (item.href) {
      return;
    }

    if (item.id === "edit") {
      return openModalEdit();
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
    if (
      currentNetworkSymbol !==
      (globalDetailNFT?.networkSymbol || PLATFORM_NETWORKS.COREUM)
    ) {
      toast.warn(
        `Please connect your wallet to ${
          ACTIVE_CHAINS[
            globalDetailNFT?.networkSymbol || PLATFORM_NETWORKS.COREUM
          ]?.name || ""
        } and try again.`
      );
      return false;
    }
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

    let checkResut = await checkWalletAddrAndChainId();
    if (!checkResut) {
      setProcessing(false);
      return;
    }

    setProcessing(true);
    if (isSupportedEVMNetwork(currentNetworkSymbol) === true) {
      let iHaveit;
      try {
        iHaveit = await getBalanceOf(
          new Web3(globalProvider),
          (currentUsr as any)?.address,
          globalDetailNFT?._id,
          globalDetailNFT?.networkSymbol || PLATFORM_NETWORKS.COREUM
        );
        if (iHaveit === 1) {
          setProcessing(false);
          toast.warn("Your NFT is not on sale.");
          return;
        }
        if (iHaveit && (iHaveit as any)?.message) {
          toast.warn((iHaveit as any)?.message);
        }

        let result = await changePrice(
          new Web3(globalProvider),
          (currentUsr as any)?.address,
          globalDetailNFT?._id,
          newPrice,
          globalDetailNFT?.networkSymbol || PLATFORM_NETWORKS.COREUM
        );
        if ((result as any).success === true)
          toast.success(
            (result as any).message +
              "Check your new item in your profile 'Collectibles' ."
          );
        else toast.error((result as any).message);
      } catch (err) {
        setProcessing(false);
        console.log("failed on changing price : ", err);
      }
    }
    if (currentNetworkSymbol === PLATFORM_NETWORKS.COREUM) {
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
    }
    setProcessing(false);
  };

  const removeSale = async () => {
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

    let checkResut = await checkWalletAddrAndChainId();
    if (!checkResut) {
      setProcessing(false);
      return;
    }

    setProcessing(true);
    if (isSupportedEVMNetwork(currentNetworkSymbol) === true) {
      let iHaveit;
      try {
        iHaveit = await getBalanceOf(
          new Web3(globalProvider),
          (currentUsr as any)?.address,
          globalDetailNFT?._id,
          globalDetailNFT?.networkSymbol || PLATFORM_NETWORKS.COREUM
        );
        if (iHaveit === 1) {
          setProcessing(false);
          toast.warn("Your NFT is not on sale.");
          return;
        }
        if (iHaveit && (iHaveit as any).message) {
          toast.warn((iHaveit as any).message);
        }

        let result = await destroySale(
          new Web3(globalProvider),
          (currentUsr as any)?.address,
          globalDetailNFT?._id,
          globalDetailNFT?.networkSymbol || PLATFORM_NETWORKS.COREUM
        );
        if ((result as any).success === true)
          toast.success(
            (result as any).message +
              "Check your new item in your profile 'Collectibles' ."
          );
        else toast.error((result as any).message);

        setProcessing(false);
      } catch (err) {
        setProcessing(false);
        console.log("failed on remove sale : ", err);
      }
    }
  };

  const deleteItem = async () => {
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
    let checkResut = await checkWalletAddrAndChainId();
    if (!checkResut) {
      setProcessing(false);
      return;
    }
    setProcessing(true);
    if (isSupportedEVMNetwork(currentNetworkSymbol) === true) {
      let iHaveit;
      try {
        if ((globalDetailNFT?.isSale || 0) > 0) await removeSale();
        iHaveit = await getBalanceOf(
          new Web3(globalProvider),
          (currentUsr as any)?.address,
          globalDetailNFT?._id,
          globalDetailNFT?.networkSymbol || PLATFORM_NETWORKS.COREUM
        );
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
        let result = await burnEVMNFT(
          new Web3(globalProvider),
          (currentUsr as any)?.address,
          globalDetailNFT?._id,
          globalDetailNFT?.networkSymbol || PLATFORM_NETWORKS.COREUM
        );
        if ((result as any).success === true) {
          toast.success("You've burnt an item.");
          deleteItem();
          navigate(`/page-author/${globalDetailNFT?.creator?._id || ""}`);
        } else toast.error((result as any).message);
      } catch (err) {
        setProcessing(false);
        console.log("failed on burn token : ", err);
      }
    }
    if (currentNetworkSymbol === PLATFORM_NETWORKS.COREUM) {
      try {
        let checkBalance = await checkNativeCurrencyAndTokenBalances(0);
        if (checkBalance == false) return;
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
    }
  };

  const transferToken = async (toAddr: string) => {
    setIsTransfering(true);

    if (globalDetailNFT?.owner._id !== (currentUsr as any)?._id) {
      toast.warn("You are not the owner of this nft.");
      return;
    }
    let checkResut = await checkWalletAddrAndChainId();
    if (!checkResut) {
      setProcessing(false);
      return;
    }
    setProcessing(true);
    if (isSupportedEVMNetwork(currentNetworkSymbol) === true) {
      let iHaveit;
      iHaveit = await getBalanceOf(
        new Web3(globalProvider),
        (currentUsr as any)?.address,
        globalDetailNFT?._id,
        globalDetailNFT?.networkSymbol || PLATFORM_NETWORKS.COREUM
      );
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
      let result = await transferEVMNFT(
        new Web3(globalProvider),
        (currentUsr as any)?.address,
        toAddr,
        globalDetailNFT?._id,
        globalDetailNFT?.networkSymbol || PLATFORM_NETWORKS.COREUM
      );
      if ((result as any).success === true)
        toast.success(
          (result as any).message +
            "Check your new item in your profile 'Collectibles' ."
        );
      else toast.error((result as any).message);
    }
    if (currentNetworkSymbol === PLATFORM_NETWORKS.COREUM) {
      try {
        let checkBalance = await checkNativeCurrencyAndTokenBalances(0);
        if (checkBalance == false) return;
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
    }
    setProcessing(false);
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
        onCloseModalDelete={closeModalBurn}
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
