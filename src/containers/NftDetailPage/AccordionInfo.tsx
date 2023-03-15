import { useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { config } from "app/config";
import CopyButton from "components/CopyButton/CopyButton";
import { getMidAddress } from "app/methods";

export default function AccordionInfo(props: any) {

  const [description, setDescription] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [stockAmount, setStockAmount] = useState(0);
  const [imagePixel, setImagePixel] = useState("");
  const [imageSize, setImageSize] = useState("");
  const [itemChainId, setItemChainId] = useState(1);
  const [sizeOfMusicAndVideo, setSizeOfMusicAndVideo] = useState("");

  const getTokenIdFromDBId = async (idOnDB: string) => {
    try {
      // let ethWeb3 = new Web3((chains as any)[itemChainId || 1]?.rpcURL || "");
      // let platformContract =  new ethWeb3.eth.Contract(platformContractAbi as any, (chains as any)[itemChainId]?.platformContractAddress );
      // let tokenId = await platformContract.methods._getNFTId(idOnDB).call();
      setTokenId(tokenId);
      return tokenId;
    }
    catch (error) {
      console.log("[AccordionInfo.js] getTokenIdFromDBId() : ", error);
      return -1;
    }
  }

  useEffect(() => {
    setDescription(props?.description || "");
    setImagePixel(props?.imagePixel || "");
    setImageSize(props?.imageSize || "");
    setSizeOfMusicAndVideo(props?.sizeOfMusicAndVideo || "");
    setContractAddress(props?.contractAddress || "");
    setStockAmount(props?.stockAmount || 1);
    setItemChainId(props?.chainId || 1);
    setTokenId(props?.tokenId || 0);
  }, [props]);

  return (
    <div className="w-full rounded-2xl">
      <Disclosure defaultOpen>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between w-full px-4 py-2 font-medium text-left rounded-lg bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-500 hover:bg-neutral-200 focus:outline-none focus-visible:ring focus-visible:ring-neutral-500 focus-visible:ring-opacity-75">
              <span>Descriptions</span>
              <ChevronUpIcon
                className={`${open ? "transform rotate-180" : ""
                  } w-5 h-5 text-neutral-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel
              className="px-4 pt-4 pb-2 text-sm text-neutral-500 dark:text-neutral-400"
              as="p"
            >
              {description}
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
                className={`${open ? "transform rotate-180" : ""
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
                <span className="w-full text-base text-neutral-900 dark:text-neutral-100">{getMidAddress(contractAddress)}</span>
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
