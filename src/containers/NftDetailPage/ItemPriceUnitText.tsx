import { ACTIVE_CHAINS, PLATFORM_NETWORKS } from "app/config";
import { selectCurrentNetworkSymbol } from "../../app/reducers/auth.reducers";
import { isSupportedEVMNetwork } from "InteractWithSmartContract/interact";

export const getItemPriceUnitText = (item, currentNetworkSymbol) => {
  let unitText = "";
  if (currentNetworkSymbol === PLATFORM_NETWORKS.COREUM) unitText = "USD";
  else if (isSupportedEVMNetwork(currentNetworkSymbol) === true)
    unitText = ACTIVE_CHAINS[currentNetworkSymbol]?.currency || "ETH";
  return unitText;
};
