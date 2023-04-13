import React from "react";
import cn from "classnames";
import styles from "./Accept.module.sass";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { numberWithCommas } from "app/methods";
import { BsCurrencyDollar } from "react-icons/bs";
import { getItemPriceUnitText } from "../ItemPriceUnitText";
import { useAppSelector } from "app/hooks";
import { selectCurrentNetworkSymbol } from "app/reducers/auth.reducers";
// import { chains } from "config";

const Accept = ({ className = "", onOk, onCancel, nft = {} }) => {
  const currentNetworkSymbol = useAppSelector(selectCurrentNetworkSymbol);
  return (
    <div className={cn(className, styles.accept)}>
      <div className={styles.line}>
        <div className={styles.icon}>
          <BsCurrencyDollar size={32} />
        </div>
        <div className={styles.text}>
          You are about to accept a bid for <strong>{nft && nft.name}</strong>
          {/* from{" "}<strong>PINK BANANA</strong> */}
        </div>
      </div>
      {nft ? (
        <div className={styles.stage}>
          {numberWithCommas(
            Number(nft.bids.length > 0 && nft.bids[nft.bids.length - 1].price)
          )}{" "}
          {getItemPriceUnitText(nft, currentNetworkSymbol)} for your NFT
        </div>
      ) : (
        <div className={styles.stage}>for your NFT</div>
      )}
      <div className={styles.btns}>
        <ButtonPrimary className={cn("button", styles.button)} onClick={onOk}>
          Accept bid
        </ButtonPrimary>
        <ButtonPrimary
          className={cn("button-stroke", styles.button)}
          onClick={onCancel}
        >
          Cancel
        </ButtonPrimary>
      </div>
    </div>
  );
};

export default Accept;
