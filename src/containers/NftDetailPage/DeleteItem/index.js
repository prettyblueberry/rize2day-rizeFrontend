import React from "react";
import cn from "classnames";
import styles from "./RemoveSale.module.sass";
import ButtonPrimary from "shared/Button/ButtonPrimary";

const RemoveSale = ({ className = "", onOk, onCancel}) => {
  return (
    <div className={cn(className, styles.transfer)}>
      <div className={cn("h4", styles.title)}>Delete from website</div>
      <div className={styles.text}>
        Do you really want to remove your item from website? You can't recover it later.
      </div>
      <div className={styles.btns}>
        <ButtonPrimary className={cn("button", styles.button)} onClick={onOk}>Delete now</ButtonPrimary>
        <ButtonPrimary className={cn("button-stroke", styles.button)} onClick={onCancel}>Cancel</ButtonPrimary>
      </div>
    </div>
  );
};

export default RemoveSale;
