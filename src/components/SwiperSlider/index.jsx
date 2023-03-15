import { useState, useEffect } from 'react';
import Carousel from "react-spring-3d-carousel";
import { config } from "react-spring";
import { config as appConfig } from 'app/config';

const getTouches = (evt) => {
  return (
    evt.touches || evt.originalEvent.touches // browser API
  );
};

const SwiperSlider = ({ items }) => {
  const [slides, setSlides] = useState([]);
  const [goToSlide, setGoToSlide] = useState(0);
  const [xDown, setXDown] = useState(null);
  const [yDown, setYDown] = useState(null);

  useEffect(() => {
    const list = [];
    items.map((item, index) => {
      list.push({
        key: index,
        content: <img key={index} src={`${appConfig.API_URL}uploads/${(item)?.logoURL}`} className="w-[300px]" alt="1" />
      })
    })
    setSlides(list);
  }, [items]);

  const handleTouchStart = (evt) => {
    setXDown(evt.clientX);
    setYDown(evt.clientY);
  };

  const handleTouchMove = (evt) => {
    if (!xDown && yDown) {
      return;
    }

    let xUp = evt.clientX;
    let yUp = evt.clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        /* left swipe */
        setGoToSlide(goToSlide + 1);
        setXDown(null);
        setYDown(null);
      } else {
        /* right swipe */
        setGoToSlide(goToSlide - 1);
        setXDown(null);
        setYDown(null);
      }
    }
  };

  return (
    <div className="w-full h-[300px]" onMouseDown={handleTouchStart} onMouseUp={handleTouchMove}>
      <Carousel
        slides={slides}
        goToSlide={goToSlide}
        offsetRadius={3}
        showNavigation={false}
        animationConfig={config.gentle}
      />
    </div>
  )
}

export default SwiperSlider;