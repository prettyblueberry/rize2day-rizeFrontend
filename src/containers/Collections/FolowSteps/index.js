import React from "react";
import cn from "classnames";
import styles from "./FolowSteps.module.sass";
import Icon from "../../../components/Icon";
import LoaderCircle from "../../../components/LoaderCircle";

const FolowSteps = ({ className, state, navigate2Next}) => {
  return (
    <div className={cn(className, styles.steps)}>
      <div className={cn("h4", styles.title)}>Follow steps</div>
      <div className={styles.list}>

      {(state===0) ? 
        <div className={cn(styles.item, styles.done)}>
          <div className={styles.head}>
            <div className={styles.icon}>
              <Icon name="upload-file" size="24" />
            </div>
            <div className={styles.details}>
              <div className={styles.info}>Create Collection</div>
              <div className={styles.text}>Created successfully.</div>
            </div>
          </div>
          <button className={cn("button done", styles.button)} onClick={navigate2Next}>Done</button>
        </div>
      : (state===1) ?
        <div className={styles.item}>
          <div className={styles.head}>
            <div className={styles.icon}>
              <LoaderCircle className={styles.loader} />
            </div>
            <div className={styles.details}>
              <div className={styles.info}>Create Collection</div>
              <div className={styles.text}>
                Create and sell your collection
              </div>
            </div>
          </div>
          <button className={cn("button disabled", styles.button)}>
            Creating...
          </button>
        </div>
      : (state===3) ?
        <div className={styles.item}>
          <div className={styles.head}>
            <div className={styles.icon}>
              <Icon name="pencil" size="24" />
            </div>
            <div className={styles.details}>
              <div className={styles.info}>Create Collection</div>
              <div className={styles.text}>
                Please log in and try again.
              </div>
            </div>
          </div>
          <button className={cn("button error", styles.button)}>
            Error
          </button>
        </div>
        :
        <div className={cn(styles.item, styles.error)}>
          <div className={styles.head}>
            <div className={styles.icon}>
              <Icon name="pencil" size="24" />
            </div>
            <div className={styles.details}>
              <div className={styles.info}>Create Collection</div>
              <div className={styles.text}>
                Failed to create.
              </div>
            </div>
          </div>
          <button className={cn("button error", styles.button)}>Failed</button>
        </div>
      }
      </div>
    </div>
  );
};

export default FolowSteps;
