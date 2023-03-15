import React, { useState } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import styles from "./Card.module.sass";
import Icon from "../Icon";
import { config } from "app/config.js";

const Card = ({ className, item }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className={cn(styles.card, className)}>
      <Link className={styles.link} to={`/item/${item._id}`}>

      <div className={styles.preview}>
        {/* <img srcSet={`${item.image2x} 2x`} src={item.image? item.image : ""} alt="Card" /> */}
        <img
          // srcSet={`${item.image2x} 2x`} 
          src={item.logoURL ? `${config.API_URL}uploads/${item.logoURL}` : ""} alt="Card" />
        {/* <div className={styles.control}>
          <div
            className={cn(
              { "status-green": item.category === "green" },
              styles.category
            )}
          >
            {item.categoryText ? item.categoryText : item.category}
          </div>
          <button
            className={cn(styles.favorite, { [styles.active]: visible })}
            onClick={() => setVisible(!visible)}
          >
            <Icon name="heart" size="20" />
          </button>
          <button className={cn("button-small", styles.button)}>
            <span>Place a bid</span>
            <Icon name="scatter-up" size="16" />
          </button>
        </div> */}
      </div>
      <div className={styles.fit_space}>
      </div>
        <div className={styles.body}>
          <div className={styles.line}>
            <div className={styles.title}>{item.name}</div>
            <div className={styles.price}>
              {/* {item.price? item.price + (chains[item?.chainId || 1]?.currency || "RIZE") : "0 RIZE" }  */}
            </div>
          </div>
          <div className={styles.line}>
            <div className={styles.users}>
              {
              (item && item.length >0 ) && 
              item.users ? item.users.map((x, index) => (
                <div className={styles.avatar} key={index}>
                  {/* <img src={x.avatar? `${config.API_URL}uploads/${x.avatar}` : ""} 
                    alt="Avatar" 
                  /> */}
                </div>
              )) : <></>}
            </div>
            <div className={styles.counter}>{item.counter}</div>
          </div>
        </div>
        <div className={styles.foot}>
          <div className={styles.status}>
            <Icon name="candlesticks-up" size="20" />
            Highest bid <span>{(item.bids && item.bids.length > 0) ? item.bids[item.bids.length - 1].price : 0} 
              {/* {chains[item?.chainId || 1]?.currency || "RIZE"} */}
              </span>
          </div>
          <div
            className={styles.bid}
            dangerouslySetInnerHTML={{ __html: item.bid }}
          />
        </div>
      </Link>
    </div>
  );
};

export default Card;
