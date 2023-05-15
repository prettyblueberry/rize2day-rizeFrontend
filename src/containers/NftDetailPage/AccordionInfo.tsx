import { useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import Web3 from "web3";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { ACTIVE_CHAINS, config, PLATFORM_NETWORKS } from "app/config";
import CopyButton from "components/CopyButton/CopyButton";
import { getMidAddress } from "app/methods";
import { useAppSelector } from "app/hooks";
import { selectCurrentNetworkSymbol } from "app/reducers/auth.reducers";
import { isSupportedEVMNetwork } from "InteractWithSmartContract/interact";
import platformContractAbi from "InteractWithSmartContract/RizeNFTFactory.json";
import parse from "html-react-parser";

export default function AccordionInfo(props: any) {
  const currentNetworkSymbol = useAppSelector(selectCurrentNetworkSymbol);
  const [idOnDB, setItemIdObDB] = useState("");
  const [description, setDescription] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [stockAmount, setStockAmount] = useState(0);
  const [imagePixel, setImagePixel] = useState("");
  const [imageSize, setImageSize] = useState("");
  const [itemNetworkSymbol, setItemNetworkSymbol] = useState(1);
  const [sizeOfMusicAndVideo, setSizeOfMusicAndVideo] = useState("");

  const getTokenIdFromDBId = async (idOnDB: string) => {
    try {
      if (isSupportedEVMNetwork(currentNetworkSymbol) === true) {
        let web3Obj = new Web3(
          ACTIVE_CHAINS[itemNetworkSymbol || PLATFORM_NETWORKS.ETHEREUM]
            ?.rpcURL || ""
        );
        let platformContract = new web3Obj.eth.Contract(
          platformContractAbi as any,
          ACTIVE_CHAINS[
            itemNetworkSymbol || PLATFORM_NETWORKS.ETHEREUM
          ]?.platformContractAddress
        );
        let tokenId = await platformContract.methods._getNFTId(idOnDB).call();
        setTokenId(tokenId);
      }
    } catch (error) {
      console.log("[AccordionInfo.js] getTokenIdFromDBId() : ", error);
      return -1;
    }
  };

  useEffect(() => {
    setDescription(props?.description || "");
    setImagePixel(props?.imagePixel || "");
    setImageSize(props?.imageSize || "");
    setSizeOfMusicAndVideo(props?.sizeOfMusicAndVideo || "");
    setContractAddress(props?.contractAddress || "");
    setStockAmount(props?.stockAmount || 1);
    setItemNetworkSymbol(props?.networkSymbol || PLATFORM_NETWORKS.COREUM);
    setTokenId(props?.tokenId || 0);
    setItemIdObDB(props?.id || "");
  }, [props]);

  useEffect(() => {
    if (idOnDB !== "" && itemNetworkSymbol !== 0) {
      console.log("idOnDB ===> ", idOnDB);
      console.log("itemNetworkSymbol ===> ", itemNetworkSymbol);
      getTokenIdFromDBId(idOnDB);
    }
  }, [idOnDB, itemNetworkSymbol]);

  return (
    <div className="w-full rounded-2xl">
      <Disclosure defaultOpen>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between w-full px-4 py-2 font-medium text-left rounded-lg bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-500 hover:bg-neutral-200 focus:outline-none focus-visible:ring focus-visible:ring-neutral-500 focus-visible:ring-opacity-75">
              <span>Descriptions</span>
              <ChevronUpIcon
                className={`${
                  open ? "transform rotate-180" : ""
                } w-5 h-5 text-neutral-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel
              className="px-4 pt-4 pb-2 text-sm text-neutral-500 dark:text-neutral-400"
              as="p"
            >
              {parse(description || "")}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <Disclosure defaultOpen as="div" className="mt-5 md:mt-8">
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between w-full px-4 py-2 font-medium text-left rounded-lg bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-500 hover:bg-neutral-200 focus:outline-none focus-visible:ring focus-visible:ring-neutral-500 focus-visible:ring-opacity-75">
              <span>Details</span>
              <ChevronUpIcon
                className={`${
                  open ? "transform rotate-180" : ""
                } w-5 h-5 text-neutral-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="flex flex-col px-4 pt-4 pb-2 overflow-hidden text-xs text-neutral-500 dark:text-neutral-400">
              {/* <span>{imagePixel}.IMAGE(685KB)</span> */}
              <br />
              <span>Stock Amount</span>
              <span className="text-base text-neutral-900 dark:text-neutral-100 line-clamp-1">
                {stockAmount}
              </span>

              <br />
              <span>Contract Address</span>
              <div className="flex items-center">
                <span className="w-full text-base text-neutral-900 dark:text-neutral-100">
                  {getMidAddress(contractAddress)}
                </span>
                <CopyButton data={contractAddress} />
              </div>

              <br />
              <span>Token ID</span>
              <span className="text-base text-neutral-900 dark:text-neutral-100">
                {tokenId}
              </span>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
