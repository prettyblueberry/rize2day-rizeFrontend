import React from "react";
import cn from "classnames";
import styles from "./Burn.module.sass";
import ButtonPrimary from "shared/Button/ButtonPrimary";

const Burn = ({ className = "", onOk, onCancel }) => {
  return (
    <div className={cn(className, styles.transfer)}>
      <div className={cn("h4", styles.title)}>Burn token</div>
      <div className={styles.text}>
        Are you sure to burn this token? This action cannot be undone. Token
        will be transfered to zero address
      </div>
      <div className={styles.btns}>
        <ButtonPrimary
          className={cn("button-pink", styles.button)}
          onClick={onOk}
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

export default Burn;
