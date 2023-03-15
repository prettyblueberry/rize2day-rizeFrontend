import React, { useState } from "react";
import cn from "classnames";
import styles from "./Bid.module.sass";
import { isEmpty } from "app/methods";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Icon from "components/Icon";
import Checkbox from "@mui/material/Checkbox";
import NcModal from "shared/NcModal/NcModal";

const Bid = ({ className = "", onOk, onCancel, nft = {} }) => {
  const [price, setPrice] = useState(0);
  const [priceIsInvalid, setPriceIsInvalid] = useState(false);
  const [warningStr, setWarningStr] = useState("");
  const [terms, setTerms] = useState(false);
  const [termsModal, setTermsModal] = useState(false);
  const regularInputTestRegExp = /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/gm;

  const onChangePrice = (e) => {
    var inputedPrice = e.target.value;
    if (inputedPrice !== "") {
      setPriceIsInvalid(false);
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
        setPriceIsInvalid(true);
        setWarningStr("Price must be a number.");
        return;
      }
    }
    if (isNaN(inputedPrice)) {
      setPriceIsInvalid(true);
      setWarningStr("Bidding price must be a valid number.");
      return;
    }
    setPriceIsInvalid(false);
    setWarningStr("");
    setPrice(inputedPrice);
  };

  const onContinue = () => {
    if (isNaN(price)) {
      setPriceIsInvalid(true);
      setWarningStr("Bidding price must be a valid number.");
      return;
    }
    if (nft && nft.bids && nft.bids.length > 0) {
      if (Number(price) <= Number(nft.bids[nft.bids.length - 1].price)) {
        setWarningStr("Bidding price must be bigger than crrent max bid.");
        setPriceIsInvalid(true);
        return;
      }
    }
    if (nft && nft.bids && isEmpty(nft.bids.length)) {
      if (Number(price) <= Number(nft.price)) {
        setWarningStr(
          "Bidding price must be bigger than auction staring price."
        );
        setPriceIsInvalid(true);
        return;
      }
    }
    setWarningStr("");
    setPriceIsInvalid(false);
    setTimeout(() => {
      onOk(Number(price));
    }, 100);
  };

  const handleTerms = (e) => {
    setTerms(e.target.checked);
  };

  //foster turtle cake uncover grace butter magnet update comfort behave horn title
  return (
    <div className={cn(className, styles.checkout)}>
      <div className={styles.attention}>
        <div className={styles.preview}>
          <Icon name="info-circle" size="32" />
        </div>
        <div className={styles.details}>
          You are about to bid for <strong>{nft && nft.name}</strong>
        </div>
      </div>

      <div className={styles.stage}>Your bid </div>
      {nft && nft.bids.length > 0 && (
        <div className={styles.stageBid}>{`( Current Max bid : ${Number(
          nft.bids[nft.bids.length - 1].price
        )} RIZE)`}</div>
      )}
      {nft && nft.bids.length === 0 && (
        <div className={styles.stageBid}>{`( Started price : ${Number(
          nft.price
        )} RIZE)`}</div>
      )}

      <div className={styles.table}>
        <div className={styles.field}>
          <input
            className={"text-black bg:white w-full text-center"}
            type="text"
            name="price"
            id="priceInput"
            value={price || ""}
            onChange={(e) => onChangePrice(e)}
            placeholder="Must be bigger than current max bid."
          />
        </div>
        {priceIsInvalid === true ? (
          <span style={{ color: "red" }}>{warningStr}</span>
        ) : (
          <span style={{ color: "greeb" }}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        )}
      </div>
      {nft?.collection_id?.terms && (
        <div className="flex items-center">
          <Checkbox
            checked={terms}
            onChange={handleTerms}
            inputProps={{ "aria-label": "controlled", color: "white" }}
          />
          <p>
            Accept this Collections{" "}
            <span
              className="text-blue-500 underline underline-offset-4 cursor-pointer"
              onClick={() => setTermsModal(true)}
            >
              Terms and Conditions
            </span>
          </p>
        </div>
      )}

      <div className={styles.btns}>
        <ButtonPrimary
          className={cn("button", styles.button)}
          onClick={onContinue}
          disabled={nft?.collection_id?.terms ? !terms : false}
        >
          Place a bid
        </ButtonPrimary>
        <ButtonPrimary
          className={cn("button", styles.button)}
          onClick={onCancel}
        >
          Cancel
        </ButtonPrimary>
      </div>
      <NcModal
        isOpenProp={termsModal}
        onCloseModal={() => setTermsModal(false)}
        contentExtraClass="max-w-screen-sm"
        renderContent={() => (
          <div className="flex flex-col">
            {nft?.collection_id?.terms && (
              <p className="whitespace-pre-wrap">{nft.collection_id.terms}</p>
            )}
            <div className="flex items-center justify-end my-2">
              <Checkbox
                checked={terms}
                onChange={handleTerms}
                inputProps={{ "aria-label": "controlled", color: "white" }}
              />
              <p>Accept</p>
            </div>
            <ButtonPrimary
              className={cn("button")}
              onClick={() => setTermsModal(false)}
            >
              Close
            </ButtonPrimary>
          </div>
        )}
        renderTrigger={() => {}}
        modalTitle="Terms and Conditions"
      />
    </div>
  );
};

export default Bid;
