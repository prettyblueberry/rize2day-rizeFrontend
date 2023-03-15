import React from "react";
import cn from "classnames";
import styles from "./RemoveSale.module.sass";
import ButtonPrimary from "shared/Button/ButtonPrimary";

const RemoveSale = ({ className = "", onOk, onCancel}) => {
  return (
    <div className={cn(className, styles.transfer)}>
      <div className={cn("h4", styles.title)}>Remove from sale</div>
      <div className={styles.text}>
        Do you really want to remove your item from sale? You can put it on sale
        anytime
      </div>
      <div className={styles.btns}>
        <ButtonPrimary className={cn("button", styles.button)} onClick={onOk}>Remove now</ButtonPrimary>
        <ButtonPrimary className={cn("button-stroke", styles.button)} onClick={onCancel}>Cancel</ButtonPrimary>
      </div>
    </div>
  );
};

export default RemoveSale;
