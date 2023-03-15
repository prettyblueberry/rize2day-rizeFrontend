import React, { FC, useState, useEffect } from "react";
import { isEmpty } from "app/methods";
import axios from "axios";
import { config } from "app/config.js";

interface Props {
  className?: string;
  contentClassName?: string;
  src?: string,
  nftId?: string,
  itemLength?: number
}

const RemainingTimeNftCard: FC<Props> = ({
  className = "absolute top-[-1px] right-[-1px] flex items-center",
  contentClassName = "right-5 top-1/2 -translate-y-1/2",
  src,
  nftId,
  itemLength = 0
}) => {

  const [fileLength, setFileLength] = useState("00m:00s");

  useEffect(() => {
    if (isEmpty(nftId) === false) {
      var x = document.getElementById(`${nftId}x`) as any;
      x.onloadedmetadata = function () {
        let secondLen = 0;
        if (isEmpty(x) === false) secondLen = x?.duration;
        if (itemLength === 0 && secondLen > 0) {
          axios.post(
            `${config.API_URL}api/item/updateTimeLength`,
            {
              itemId: nftId,
              timeLength: secondLen
            }
          )
            .then((docs) => { })
            .catch((error) => { });
        }
        let dateObj = new Date(secondLen * 1000);
        // let hours = isNaN(dateObj.getUTCHours()) === false? dateObj.getUTCHours() : 0;
        let minutes = isNaN(dateObj.getUTCMinutes()) === false ? dateObj.getUTCMinutes() : 0;
        let seconds = isNaN(dateObj.getSeconds()) === false ? dateObj.getSeconds() : 0;
        // let timeString = hours.toString().padStart(2, '0') + 'h:' + 
        let timeString =
          minutes.toString().padStart(2, '0') + 'm:' +
          seconds.toString().padStart(2, '0') + 's';
        setFileLength(timeString);
      };
    }
  }, [nftId]);

  return (
    <div className={className}>
      <svg
        className="text-white dark:text-[#212121] w-44 md:w-[195px] rounded-tr-[22px]"
        viewBox="0 0 196 55"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M196 55V0H0.5V1H4.05286C12.4067 1 20.1595 5.34387 24.5214 12.4685L43.5393 43.5315C47.9012 50.6561 55.654 55 64.0078 55H196Z"
          fill="currentColor"
        />
      </svg>
      <div className="w-0 h-0" >
        <audio id={`${nftId}x`} preload="metadata"  >
          <source src={`${src}`} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
      <div className={`absolute ${contentClassName}`}>
        <span className="block text-xs tracking-wide text-neutral-500 dark:text-neutral-400">
          Length
        </span>
        <span className="block font-semibold md:text-lg">{fileLength}</span>
      </div>
    </div>
  );
};

export default RemainingTimeNftCard;
