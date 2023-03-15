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
        <ButtonPrimary className={cn("button-pink", styles.button)} onClick={onOk} >Continue</ButtonPrimary>
        <ButtonPrimary className={cn("button-stroke", styles.button)} onClick={onCancel} >Cancel</ButtonPrimary>
      </div>
    </div>
  );
};

export default Burn;
