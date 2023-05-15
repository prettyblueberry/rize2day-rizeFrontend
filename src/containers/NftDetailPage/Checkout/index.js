import { useState } from "react";
import cn from "classnames";
import styles from "./Checkout.module.sass";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Icon from "components/Icon";
import Checkbox from "@mui/material/Checkbox";
import NcModal from "shared/NcModal/NcModal";

const Checkout = ({ className = "", onOk, onCancel, items = [], nft = {} }) => {
  const [terms, setTerms] = useState(false);
  const [termsModal, setTermsModal] = useState(false);
  const handleTerms = (e) => {
    setTerms(e.target.checked);
  };

  return (
    <div className={cn(className, styles.checkout)}>
      <div className={styles.attention}>
        <div className={styles.preview}>
          <Icon name="info-circle" size="32" />
        </div>
        <div className={styles.details}>
          You are about to purchase <strong>{nft && nft.name}</strong>
        </div>
      </div>

      {nft?.collection_id?.terms && (
        <div className="flex items-center mt-2 flex-col w-full">
          {/* <textarea
            type="text"
            classsName="overflow-y-auto multiple "
            rows="5"
            cols="30"
            disabled={true}
            value={nft?.collection_id?.terms || ""}
          /> */}
          <div className="flex items-center">
            <Checkbox
              checked={terms}
              onChange={handleTerms}
              inputProps={{ "aria-label": "controlled", color: "white" }}
            />
            <p className="text-sm">
              Accept this collection{" "}
              <span
                className="text-blue-500 underline underline-offset-4 cursor-pointer"
                onClick={() => setTermsModal(true)}
              >
                Terms and Conditions
              </span>
            </p>
          </div>
        </div>
      )}

      <div className={styles.btns}>
        <ButtonPrimary
          className={cn("button", styles.button)}
          onClick={onOk}
          disabled={nft?.collection_id?.terms ? !terms : false}
        >
          Buy now
        </ButtonPrimary>
        <button
          className="bg-transparent text-[#33FF00] border-2 rounded-lg border-[#33FF00] w-full py-4"
          onClick={onCancel}
        >
          Cancel
        </button>
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

export default Checkout;
