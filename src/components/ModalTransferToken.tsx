import React, { FC, useEffect, useRef, useState } from "react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import Input from "shared/Input/Input";
import NcModal from "shared/NcModal/NcModal";

export interface ModalTransferTokenProps {
  show: boolean;
  onCloseModalTransferToken: () => void;
  onOk: any
}

const ModalTransferToken: FC<ModalTransferTokenProps> = ({
  show,
  onOk,
  onCloseModalTransferToken,
}) => {
  const textareaRef = useRef(null);
  const [toAddr, setToAddr] = useState("");

  const onContinue =  () =>
  {    
    onOk(toAddr);
  }

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        const element: HTMLTextAreaElement | null = textareaRef.current;
        if (element) {
          (element as HTMLTextAreaElement).focus();
          (element as HTMLTextAreaElement).setSelectionRange(
            (element as HTMLTextAreaElement).value.length,
            (element as HTMLTextAreaElement).value.length
          );
        }
      }, 400);
    }
  }, [show]);

  const renderContent = () => {
    return (
      <form action="#">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
          Transfer token
        </h3>
        <span className="text-sm">
          You can transfer tokens from your address to another
        </span>
        <div className="mt-8 ">
          <Input ref={textareaRef} placeholder="Paste address" type={"text"}
            value = {toAddr}
            onChange = {(e) => setToAddr(e.target.value)}
          />
        </div>
        <div className="mt-4 space-x-3">
          <ButtonPrimary type="button" onClick={() => onContinue() }>Submit</ButtonPrimary>
          <ButtonSecondary type="button" onClick={onCloseModalTransferToken}>
            Cancel
          </ButtonSecondary>
        </div>
      </form>
    );
  };

  const renderTrigger = () => {
    return null;
  };

  return (
    <NcModal
      isOpenProp={show}
      onCloseModal={onCloseModalTransferToken}
      contentExtraClass="max-w-lg"
      renderContent={renderContent}
      renderTrigger={renderTrigger}
      modalTitle=""
    />
  );
};

export default ModalTransferToken;
