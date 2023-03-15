import { useState, useEffect } from 'react'
import clsx from 'clsx';
import MarqueeSlider from "components/MarqueeSlider/tickerMarquee";
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';
import { config } from 'app/config';

const Marquee3D = () => {
  const [popularItems, setPopularItems] = useState([]);
  const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 1224px)' })
  const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })

  const getPopularItems = () => {
    axios.post(
      `${config.API_URL}api/item/getPopularItems`,
      {
        limit: 10
      }
    ).then((response) => {
      setPopularItems(response.data.data || []);
    })
      .catch((error) => {
        console.log("getPopularItems() error ===> ", error);
      })
  }

  useEffect(() => {
    getPopularItems();
  }, []);

  return (
    <div className="relative w-full h-[550px]">
      <div className={"absolute top-0 bottom-0 flex items-center w-full"}>
        {popularItems.length > 0 && (
          <MarqueeSlider items={popularItems} speed={4 * 10 ** 5} delay={4} width={isBigScreen ? 300 : isDesktopOrLaptop ? 200 : 200} />
        )}
      </div>

      <div className={"absolute top-0 bottom-0 flex items-center w-full"}>
        {popularItems.length > 0 && (
          <MarqueeSlider items={popularItems} speed={2 * 10 ** 5} delay={2} width={isBigScreen ? 400 : isDesktopOrLaptop ? 300 : 250} />
        )}
      </div>
      <div className={"absolute top-0 bottom-0 flex items-center w-full"}>
        {popularItems.length > 0 && (
          <MarqueeSlider items={popularItems} speed={1 * 10 ** 5} delay={0} width={isBigScreen ? 500 : isDesktopOrLaptop ? 400 : 300} />
        )}
      </div>
    </div>
  )
}

export default Marquee3D;