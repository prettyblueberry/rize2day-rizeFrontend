import React, { FC, useEffect, useId, useRef, useState } from "react";
import Heading from "components/Heading/Heading";
import Glide from "@glidejs/glide";
import CardNFT from "components/CardNFT";
import Next from "shared/NextPrev/Next";
import Prev from "shared/NextPrev/Prev";
import axios from "axios";
import { config, FILE_TYPE } from "app/config";
import { useDispatch } from "react-redux";
import CardNFTMusic from "components/CardNFTMusic";
import CardNFTVideo from "components/CardNFTVideo";
import CardNFT3D from "components/CardNFT3D";

export interface SectionSliderCollections2Props {
  className?: string;
  itemClassName?: string;
  cardStyle?: "style1" | "style2";
}

const SectionSliderCollections2: FC<SectionSliderCollections2Props> = ({
  className = "",
}) => {
  const [tabActive, setTabActive] = React.useState("Last 24 hours");
  const id = useId();
  const UNIQUE_CLASS = "glidejs" + id.replace(/:/g, "_");

  const sliderRef = useRef(null);
  const dispatch = useDispatch();
  const [time, setTime] = useState(0);
  const [items, setItems] = useState([]);

  const getPopularItems = () => {
    axios
      .post(`${config.API_URL}api/item/getPopularItems`, {
        limit: 10,
      })
      .then((response) => {
        setItems(response.data.data || []);
      })
      .catch((error) => {
        console.log("getPopularItems() error ===> ", error);
      });
  };

  useEffect(() => {
    getPopularItems();
  }, []);

  // useEffect(() => {
  //   if (!sliderRef.current) {
  //     return;
  //   }

  //   const OPTIONS: Glide.Options = {
  //     perView: 4,
  //     gap: 20,
  //     bound: true,
  //     breakpoints: {
  //       1280: {
  //         gap: 28,
  //         perView: 3,
  //       },
  //       1024: {
  //         gap: 20,
  //         perView: 2.15,
  //       },
  //       768: {
  //         gap: 8,
  //         perView: 2,
  //       },

  //       500: {
  //         gap: 20,
  //         perView: 1,
  //       },
  //     },
  //   };

  //   let slider = new Glide(`.${UNIQUE_CLASS}`, OPTIONS);
  //   slider.mount();
  //   // @ts-ignore
  //   return () => slider.destroy();
  // }, [sliderRef, UNIQUE_CLASS, items]);

  return (
    <div className={`nc-SectionSliderCollections2 ${className}`}>
      <Heading
        className="mb-12 lg:mb-14 text-neutral-900 dark:text-neutral-50"
        fontClass="text-3xl md:text-4xl 2xl:text-5xl font-semibold"
        isCenter
        desc=""
      >
        Featured NFTs
      </Heading>
      <div className={`${UNIQUE_CLASS} relative`} ref={sliderRef}>
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {items &&
              items.length > 0 &&
              items.map((x, index) =>
                x.fileType > 0 ? (
                  x.fileType === FILE_TYPE.IMAGE ? (
                    <CardNFT className={"w-[300px]"} item={x} key={index} isHome={true} />
                  ) : x.fileType === FILE_TYPE.AUDIO ? (
                    <CardNFTMusic
                      className={"w-[300px]"}
                      item={x}
                      key={index}
                      isHome={true}
                    />
                  ) : x.fileType === FILE_TYPE.VIDEO ? (
                    <CardNFTVideo
                      className={"w-[300px]"}
                      item={x}
                      key={index}
                      isHome={true}
                    />
                  ) : (
                    <CardNFT3D
                      className={"w-[300px]"}
                      item={x}
                      key={index}
                      isHome={true}
                    />
                  )
                ) : (
                  <></>
                )
              )}
          </ul>
        </div>

        <Next className="absolute ml-5 -translate-y-1/2 left-full top-1/2" />
        <Prev className="absolute mr-5 -translate-y-1/2 right-full top-1/2" />
      </div>
    </div>
  );
};

export default SectionSliderCollections2;
