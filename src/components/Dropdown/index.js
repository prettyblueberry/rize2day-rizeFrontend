import React, { useState } from "react";
import cn from "classnames";
import OutsideClickHandler from "react-outside-click-handler";
import styles from "./Dropdown.module.sass";
import Icon from "../Icon";

const Dropdown = ({ className, value, setValue, options, disabled = false }) => {
  const [visible, setVisible] = useState(false);

  const handleClick = (value, index) => {
    setValue(value, index);
    setVisible(false);
  };

  return (
    <OutsideClickHandler onOutsideClick={() => setVisible(false)} disabled={disabled}>
      <div
        className={cn(styles.dropdown, className, { [styles.active]: visible })}
      >
        <div className={styles.head} onClick={() => setVisible(!visible)}>
          <div className={styles.selection}>{value.text}</div>
          <div className={styles.arrow}>
            <Icon name="arrow-bottom" size="10" />
          </div>
        </div>
        <div className={styles.body} style={{ maxHeight: "200px", overflowY: "scroll" }}>
          {
            (options && options.length > 0) &&
            options.map((x, index) => (
              <div
                className={cn(styles.option, {
                  [styles.selectioned]: x.value === value,
                })}
                onClick={() => handleClick(x, index)}
                key={index}
              >
                {x.text}
              </div>
            ))}
        </div>
      </div>
    </OutsideClickHandler>
  );
};

export default Dropdown;
