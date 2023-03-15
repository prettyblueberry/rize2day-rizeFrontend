import React from "react";
import cn from "classnames";
import styles from "./Filters.module.sass";
import Checkbox from "../../../components/Checkbox";

const Filters = ({
  className,
  filters,
  selectedFilters,
  setSelectedFilters,
}) => {
  const handleChange = (filter) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((x) => x !== filter));
    } else {
      setSelectedFilters((selectedFilters) => [...selectedFilters, filter]);
    }
  };

  const onClickSellectAll = () => {
    setSelectedFilters(filters);
  };

  const onClickUnselectAll = () => {
    setSelectedFilters([]);
  };

  return (
    <div className={cn(styles.filters, className)}>
      <div className={styles.info}>Filters</div>
      <div className={styles.group}>
        {filters &&
          filters.length > 0 &&
          filters.map((x, index) => (
            <Checkbox
              className={`text-black dark:text-white py-2`}
              content={x}
              value={selectedFilters.includes(x)}
              onChange={() => handleChange(x)}
              key={index}
            />
          ))}
      </div>
      <div className={"flex justify-around"}>
        <button
          className={"button-stroke button-small text-green-400"}
          onClick={() => onClickSellectAll()}
        >
          Select all
        </button>
        <button
          className={"button-stroke button-small text-green-400"}
          onClick={() => onClickUnselectAll()}
        >
          Unselect all
        </button>
      </div>
    </div>
  );
};

export default Filters;
