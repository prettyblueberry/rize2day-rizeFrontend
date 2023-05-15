import {
  ACTIVE_CHAINS,
  COREUM_PAYMENT_COINS,
  PLATFORM_NETWORKS,
} from "app/config";
import { useAppSelector } from "app/hooks";
import { selectCurrentNetworkSymbol } from "app/reducers/auth.reducers";
import { isSupportedEVMNetwork } from "InteractWithSmartContract/interact";
import React, { FC } from "react";

export interface Prices2Props {
  className?: string;
  labelTextClassName?: string;
  item?: any;
}

const PricesUnit: FC<Prices2Props> = ({
  className = "",
  labelTextClassName = "",
  item,
}) => {
  const currentNetworkSymbol = useAppSelector(selectCurrentNetworkSymbol);

  return (
    <div className={`${className}`}>
      {item?.isSale == 2
        ? `${
            item.bids && item.bids.length > 0
              ? item.bids[item.bids.length - 1].price
                ? item.bids[item.bids.length - 1].price
                : 0
              : item?.price
          } 
          ${
            item.networkSymbol === PLATFORM_NETWORKS.COREUM
              ? item.coreumPaymentUnit === COREUM_PAYMENT_COINS.RIZE
                ? "RIZE"
                : "CORE"
              : ""
          }
          ${
            isSupportedEVMNetwork(item.networkSymbol) === true
              ? ACTIVE_CHAINS[item.networkSymbol]?.currency || "ETH"
              : ""
          }
                  `
        : item?.isSale === 1
        ? `${item?.price || 0}  
          ${
            item.networkSymbol === PLATFORM_NETWORKS.COREUM
              ? item.coreumPaymentUnit === COREUM_PAYMENT_COINS.RIZE
                ? "RIZE"
                : "CORE"
              : ""
          }
          ${
            isSupportedEVMNetwork(item.networkSymbol) === true
              ? ACTIVE_CHAINS[item.networkSymbol]?.currency || "ETH"
              : ""
          }                   
          `
        : "Not listed"}
    </div>
  );
};

export default PricesUnit;
