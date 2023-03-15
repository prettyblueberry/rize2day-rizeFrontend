import React, {useState} from "react";
import cn from "classnames";
import styles from "./Transfer.module.sass";
import ButtonPrimary from "shared/Button/ButtonPrimary";

const ChangePrice = ({ className = "", onOk , onCancel}) => {
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

  return (
    <div className={cn(className, styles.transfer)}>
      <div className={cn("h4", styles.title)}>Change Nft Price</div>
      <div className={styles.text}>
        You can change nft price now.
      </div>
      <div className={styles.info}>Price</div>
      <div className={styles.field}>
        <input
          className={styles.input}
          type="text"
          name="price"
          id="priceInput"
          value= {price || ""}
          onChange = { (e) => onChangePrice(e) }
          placeholder="Price must be bigger than 0.00001"
        />
      </div>
      <div className={styles.btns}>
        <ButtonPrimary className={cn("button", styles.button)} onClick={()=>{onContinue()}}>Apply</ButtonPrimary>
        <ButtonPrimary className={cn("button-stroke", styles.button)} onClick={onCancel}>Cancel</ButtonPrimary>
      </div>
    </div>
  );
};

export default ChangePrice;
