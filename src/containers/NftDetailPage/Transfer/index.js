import React, { useState } from "react";
import cn from "classnames";
import styles from "./Transfer.module.sass";
import ButtonPrimary from "shared/Button/ButtonPrimary";

const Transfer = ({ className = "", onOk, onCancel }) => {
  const regexForWallet = /^(0x[a-fA-F0-9]{40})$/gm;
  const [toAddr, setToAddr] = useState("");
  const [addressIsInvalid, setAddressIsInvalid] = useState(false);

  const onContinue = () => {
    // if(toAddr !== "")
    // {
    //   let m; let correct = false;
    //   while ((m = regexForWallet.exec(toAddr)) !== null)
    //   {
    //     if (m.index === regexForWallet.lastIndex) {
    //       regexForWallet.lastIndex++;
    //     }
    //     if(m[0] === toAddr)
    //     {
    //       correct = true;
    //     }
    //   }
    //   if(!correct)
    //   {
    //     setAddressIsInvalid(true);
    //     setToAddr("");
    //     return;
    //   }
    // }
    // else { setAddressIsInvalid(true); return; }
    setAddressIsInvalid(false);
    onOk(toAddr);
  };

  return (
    <div className={cn(className, styles.transfer)}>
      <div className={cn("h4", styles.title)}>Transfer NFT</div>
      <div className={styles.text}>
        You can transfer nfts from your address to another
      </div>
      <div className={styles.info}>Receiver address</div>
      <div className={styles.field}>
        <input
          className={styles.input}
          type="text"
          name="address"
          value={toAddr}
          onChange={(e) => setToAddr(e.target.value)}
          placeholder="Paste address"
        />
      </div>
      {addressIsInvalid === true ? (
        <span style={{ color: "red" }}>Wallet address is invalid.</span>
      ) : (
        <></>
      )}
      <div className={styles.btns}>
        <ButtonPrimary
          className={cn("button", styles.button)}
          onClick={() => onContinue()}
        >
          Continue
        </ButtonPrimary>

        <button
          className="bg-transparent text-[#33FF00] border-2 rounded-lg border-[#33FF00] w-full py-4"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Transfer;
