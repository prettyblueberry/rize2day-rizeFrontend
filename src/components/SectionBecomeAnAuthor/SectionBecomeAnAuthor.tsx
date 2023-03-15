import React, { FC, useState, useEffect } from "react";
import NcImage from "shared/NcImage/NcImage";
import rightImgDemo from "images/rightLargeImg.png";
import rightLargeImgDark from "images/rightLargeImgDark.png";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Logo from "shared/Logo/Logo";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import axios from "axios";
import { config } from "app/config";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import { useNavigate } from "react-router-dom";

// import 'swiper/swiper-bundle.min.css'
// import 'swiper/swiper.css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

export interface SectionBecomeAnAuthorProps {
  className?: string;
}

const SectionBecomeAnAuthor: FC<SectionBecomeAnAuthorProps> = ({
  className = "",
}) => {
  SwiperCore.use([Autoplay]);

  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    getPopularItems();
  }, []);

  const getPopularItems = () => {
    axios.post(
      `${config.API_URL}api/item/getPopularItems`,
      {
        limit: 10
      }
    ).then((response) => {
      console.log("getPopularItems() response.data.data ===> ", response.data.data);
      setItems(response.data.data || []);
    })
      .catch((error) => {
        console.log("getPopularItems() error ===> ", error);
      })
  }

  return (
    <div
      className={`nc-SectionBecomeAnAuthor relative flex flex-col lg:flex-row items-center  ${className}`}
      data-nc-id="SectionBecomeAnAuthor"
    >
      <div className="flex-shrink-0 mb-16 lg:mb-0 lg:mr-10 lg:w-2/5">
        <h2 className="font-semibold text-3xl sm:text-4xl xl:text-6xl mt-6 sm:mt-10 !leading-[1.112] tracking-tight">
          Gather Create Evolve
        </h2>
        <span className="block mt-6 text-neutral-500 dark:text-neutral-400 ">
          A creative agency that lead and inspire.
        </span>
        <div className="flex space-x-2 sm:space-x-5 mt-6 sm:mt-12">
          <ButtonPrimary href="/createCollection" className="">
            Create collection
          </ButtonPrimary>
          <ButtonSecondary href="/page-search" className="">
            Discover more
          </ButtonSecondary>
        </div>
      </div>
      <div className="flex-grow">
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={10}
          slidesPerView={1}
          navigation={false}
          autoplay={true}
          loop
          style={{ width: "360px", height: "360px", border: "#0BFFF9 solid 2px" }}
          scrollbar={{ draggable: true }}
        >
          {
            (items && items.length > 0) ? items.map((item, index) => (
              <SwiperSlide key={index} className="rize-slide">
                <img src={`${config.API_URL}uploads/${item.logoURL}`}
                  onClick={() => { navigate(`/nft-detail/${item._id}`) }}
                  className="cursor-pointer w-full "
                  alt=""
                />
              </SwiperSlide>
            ))
              :
              <></>
          }
        </Swiper>
      </div>
    </div>
  );
};

export default SectionBecomeAnAuthor;
