import { ACTIVE_CHAINS, PLATFORM_NETWORKS } from "app/config";
import { useAppSelector } from "app/hooks";
import { selectCurrentNetworkSymbol } from "app/reducers/auth.reducers";
import { isSupportedEVMNetwork } from "InteractWithSmartContract/interact";
import React, { FC } from "react";

export interface PricesProps {
  className?: string;
  item?: any;
  contentClass?: string;
  labelTextClassName?: string;
  labelText?: string;
}

const Prices: FC<PricesProps> = ({
  className = "pt-3",
  item,
  contentClass = "py-1.5 md:py-2 px-2.5 md:px-3.5 text-sm sm:text-base font-semibold",
  labelTextClassName = "bg-white",
  labelText = Math.random() > 0.4 ? "Price" : "Current Bid",
}) => {
  const currentNetworkSymbol = useAppSelector(selectCurrentNetworkSymbol);

  return (
    <div className={`${className}`}>
      <div
        className={`flex items-baseline border-2 border-green-500 rounded-lg relative ${contentClass} `}
      >
        <span
          className={`block absolute font-normal bottom-full translate-y-1 p-1 -mx-1 text-xs text-neutral-500 dark:text-neutral-400 ${labelTextClassName}`}
        >
          {labelText}
        </span>
        <span className=" text-green-500 !leading-none">
          {item?.isSale == 2
            ? `${
                item.bids && item.bids.length > 0
                  ? item.bids[item.bids.length - 1].price
                    ? item.bids[item.bids.length - 1].price
                    : 0
                  : item?.price
              } 
          ${
            item.networkSymbol === PLATFORM_NETWORKS.COREUM ||
            item.networkSymbol === undefined
              ? "USD"
              : ""
          }
          ${
            isSupportedEVMNetwork(item.networkSymbol) === true
              ? ACTIVE_CHAINS[item.networkSymbol]?.currency || "ETH"
              : ""
          }
                  `
            : `${item?.price || 0} 
          ${
            item.networkSymbol === PLATFORM_NETWORKS.COREUM ||
            item.networkSymbol === undefined
              ? "USD"
              : ""
          }
          ${
            isSupportedEVMNetwork(item.networkSymbol) === true
              ? ACTIVE_CHAINS[item.networkSymbol]?.currency || "ETH"
              : ""
          }                   
                `}
        </span>
      </div>
    </div>
  );
};

export default Prices;
