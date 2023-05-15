import React from "react";
import cn from "classnames";
import styles from "./RemoveSale.module.sass";
import ButtonPrimary from "shared/Button/ButtonPrimary";

const RemoveSale = ({ className = "", onOk, onCancel }) => {
  return (
    <div className={cn(className, styles.transfer)}>
      <div className={cn("h4", styles.title)}>Delete from website</div>
      <div className={styles.text}>
        Do you really want to remove your item from website? You can't recover
        it later.
      </div>
      <div className={styles.btns}>
        <ButtonPrimary className={cn("button", styles.button)} onClick={onOk}>
          Delete now
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

export default RemoveSale;
