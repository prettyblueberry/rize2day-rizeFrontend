import {
  ACTIVE_CHAINS,
  COREUM_PAYMENT_COINS,
  PLATFORM_NETWORKS,
} from "app/config";

import { isSupportedEVMNetwork } from "InteractWithSmartContract/interact";

export const getItemPriceUnitText = (item) => {
  let unitText = "";
  if (item.networkSymbol === PLATFORM_NETWORKS.COREUM)
    unitText =
      item.coreumPaymentUnit === COREUM_PAYMENT_COINS.RIZE ? "RIZE" : "CORE";
  else if (isSupportedEVMNetwork(item.networkSymbol) === true)
    unitText = ACTIVE_CHAINS[item.networkSymbol]?.currency || "ETH";
  return unitText;
};
