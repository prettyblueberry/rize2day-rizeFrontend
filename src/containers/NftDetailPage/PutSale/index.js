import React, { useState } from "react";
import cn from "classnames";
import clsx from "clsx";
import styles from "./PutSale.module.sass";
import Icon from "../../../components/Icon";
import Switch from "../../../components/Switch";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { RiAuctionLine } from "react-icons/ri";
import { BsCoin } from "react-icons/bs";
// import { chains } from "config";
import { useAppSelector } from "app/hooks";
import { selectCurrentChainId } from "app/reducers/auth.reducers";

const PutSale = ({ className = "", onOk, onCancel, nft = {} }) => {
  const [instant, setInstant] = useState(false);
  const [period, setPeriod] = useState(7);
  const [price, setPrice] = useState(0);
  const currentChainId = useAppSelector(selectCurrentChainId);
  const regularInputTestRegExp = /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/gm;

  const onChangePrice = (e) => {
    var inputedPrice = e.target.value;
    if (inputedPrice !== "") {
      let m;
      let correct = false;
      while ((m = regularInputTestRegExp.exec(inputedPrice)) !== null) {
        if (m.index === regularInputTestRegExp.lastIndex) {
          regularInputTestRegExp.lastIndex++;
        }
        if (m[0] === inputedPrice) {
          correct = true;
        }
      }
      if (!correct) {
        return;
      }
    }
    if (isNaN(inputedPrice)) {
      return;
    }
    setPrice(inputedPrice);
  };

  const onContinue = () => {
    if (isNaN(price) || Number(price) < 0.00001) {
      setPrice(0.00001);
      return;
    }
    onOk(price, instant, period);
  };

  return (
    <div className={cn(className, styles.sale)}>
      {/* <div className={styles.line}>
        <div className={styles.icon}>
          <Icon name="coin" size="24" />
        </div>
        <div className={styles.details}>
          <div className={styles.info}>
            {instant ? "Instant sale" : "Auction Sale"}
          </div>
          <div className={styles.text}>
            Enter the price for which the item will be sold
          </div>
        </div>
        <Switch
          className={styles.switch}
          value={instant}
          setValue={setInstant}
        />
      </div> */}
      <div className="flex justify-evenly">
        <div onClick={() => setInstant(false)} className={clsx("flex flex-col gap-2 justify-center items-center cursor-pointer border-neutral-200 dark:border-neutral-600 p-3 rounded-lg border hover:border-primary-6000 dark:hover:border-primary-6000", !instant && "bg-green-400 text-neutral-700")}>
          <RiAuctionLine size="30" />
          <span>Auction Sale</span>
        </div>
        <div onClick={() => setInstant(true)} className={clsx("flex flex-col gap-2 justify-center items-center cursor-pointer border-neutral-200 dark:border-neutral-600 p-3 rounded-lg border hover:border-primary-6000 dark:hover:border-primary-6000", instant && "bg-green-400 text-neutral-700")}>
          <BsCoin size="30" />
          <span>Instant Sale</span>
        </div>
      </div>
      <div className="flex justify-center items-center mt-8">
        <div className="flex justify-start align-center">
          <input
            className={styles.input}
            type="text"
            value={price || ""}
            onChange={(e) => onChangePrice(e)}
            id="priceInput"
            placeholder={0}
          />
        </div>
        <span className="text-[26px] ml-2 mx-4">RIZE</span>
        {
          //for test we chaged the value 30 to 0.005 , 0.005 days equals with 432 second, with 7.2 min
          !instant ? (
            <select
              className={styles.select}
              value={period}
              onChange={(event) => {
                setPeriod(event.target.value);
              }}
              placeholder="Please select auction time"
            >
              <option value={0.000694}>1min</option>
              <option value={0.00347}>5min</option>
              <option value={0.00694}>10min</option>
              <option value={7}>7 days</option>
              <option value={10}>10 days</option>
              <option value={30}>1 month</option>
            </select>
          ) : (
            <></>
          )
        }
      </div>
      <p className="text-center m-2">
        Enter the price for which the item will be sold
      </p>
      <div className={styles.btns}>
        <ButtonPrimary
          className={cn("button", styles.button)}
          onClick={onContinue}
        >
          Continue
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

export default PutSale;
