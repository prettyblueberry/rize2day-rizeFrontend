import React, { FC, useEffect, useRef, useState } from "react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import Input from "shared/Input/Input";
import NcModal from "shared/NcModal/NcModal";

export interface ModalEditProps {
  show: boolean;
  onCloseModalEdit: () => void;
  onOk: any;
}

const ModalEdit: FC<ModalEditProps> = ({ show, onOk, onCloseModalEdit }) => {
  const textareaRef = useRef(null);
  const [price, setPrice] = useState(0);
  const regularInputTestRegExp = /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/gm;

  const onChangePrice = (e) =>
  {
    var inputedPrice = e.target.value;    
    if(inputedPrice !== "") 
    {
      let m; let correct = false;
      while ((m = regularInputTestRegExp.exec(inputedPrice)) !== null) 
      {
        if (m.index === regularInputTestRegExp.lastIndex) {
          regularInputTestRegExp.lastIndex++;
        }
        if(m[0] === inputedPrice) 
        {
          correct = true;
        }         
      }      
      if(!correct)         
      {
        return;
      }
    }        
    if(isNaN(inputedPrice))
    {
      return;
    }
    setPrice(inputedPrice);
  }

  const onContinue = () => {
    if(isNaN(price) || Number(price) < 0.00001)
    {
      setPrice(0.00001);
      return;
    }
    onOk(price);
  }

  // useEffect(() => {
  //   if (show) {
  //     setTimeout(() => {
  //       const element: HTMLTextAreaElement | null = textareaRef.current;
  //       if (element) {
  //         (element as HTMLTextAreaElement).focus();
  //         (element as HTMLTextAreaElement).setSelectionRange(
  //           (element as HTMLTextAreaElement).value.length,
  //           (element as HTMLTextAreaElement).value.length
  //         );
  //       }
  //     }, 400);
  //   }
  // }, [show]);

  const renderContent = () => {
    return (
      <form action="#">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
          Change price
        </h3>
        <span className="text-sm">Are you sure you want to change price?</span>
        <div className="mt-8 relative rounded-md shadow-sm">
          <Input ref={textareaRef} defaultValue={"1.000"} type={"text"} 
            value= {price || ""}
            onChange = { (e) => onChangePrice(e) }
          />

          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <label htmlFor="currency" className="sr-only">
              Currency
            </label>
            RIZE
          </div>
        </div>
        <div className="mt-4 space-x-3">
          <ButtonPrimary type="button" onClick={()=>{onContinue()}}>Submit</ButtonPrimary>
          <ButtonSecondary type="button" onClick={onCloseModalEdit}>
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
      onCloseModal={onCloseModalEdit}
      contentExtraClass="max-w-lg"
      renderContent={renderContent}
      renderTrigger={renderTrigger}
      modalTitle=""
    />
  );
};

export default ModalEdit;
