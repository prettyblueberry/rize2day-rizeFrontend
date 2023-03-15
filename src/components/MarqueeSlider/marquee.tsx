import React from "react";
import SwiperCore, { Autoplay, Parallax } from "swiper";
import { Swiper, SwiperSlide, SwiperProps } from "swiper/react";
import { HighlightStyled } from "./styled";
import "swiper/css";
import { config } from "app/config";

const SwiperConfig: SwiperProps = {
  speed: 5000,
  autoplay: {
    delay: 5,
    disableOnInteraction: false,
    pauseOnMouseEnter: false
  },
  loop: true,
  slidesPerView: "auto",
  watchSlidesProgress: false,
  spaceBetween: 100,
  grabCursor: true
};

SwiperCore.use([Autoplay, Parallax]);

interface HighlightPropArg {
  items: any,
  speed?: number,
  width?: number,
  spaceBetween?: number
}

const Highlight: React.FC<HighlightPropArg> = ({ items, speed = 5000, width = 300, spaceBetween = 100 }) => {
  const swiperRef = React.useRef<SwiperCore>();
  const onInit = (Swiper: SwiperCore): void => {
    swiperRef.current = Swiper;
    swiperRef.current.autoplay.start();
  };

  return (
    <HighlightStyled>
      <div className="highlight-section">
        <div
          className="highlight-inner"
          style={{ transform: 'translate3d(0,0,0)' }}
        >
          <Swiper {...SwiperConfig} loop={true} speed={speed} spaceBetween={spaceBetween} onInit={onInit}>
            {items?.map((item: any, index: number) => (
              <SwiperSlide className="highlight-card" key={index}>
                <div className={`card w-[${width}px] h-[${width}px]`}>
                  <img className="object-cover w-full h-full" src={`${config.API_URL}uploads/${(item)?.logoURL}`} width={width} height={width} alt="" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </HighlightStyled>
  );
};

export default Highlight;