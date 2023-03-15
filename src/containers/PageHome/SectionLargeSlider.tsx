import { config } from "app/config";
import { nftsLargeImgs } from "contains/fakeData";
import Heading from "components/Heading/Heading";
import { FC, useState, useEffect, useRef } from "react";
import { io } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from "app/hooks";
import { changeBannerItemsOnAuction, selectBannerItemsOnAuction, selectDetailOfAnItem, selectCOREPrice } from "app/reducers/nft.reducers";
import { selectCurrentChainId, selectCurrentUser, selectCurrentWallet, selectGlobalProvider, selectWalletStatus } from "app/reducers/auth.reducers";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isEmpty } from "app/methods";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from "axios";
import CardLarge1 from "components/CardLarge1/CardLarge1";
import NextPrev from "shared/NextPrev/NextPrev";

var socket = io(`${config.socketUrl}`);

export interface SectionLargeSliderProps {
  className?: string;
}

const SectionLargeSlider: FC<SectionLargeSliderProps> = ({
  className = "",
}) => {
  const [indexActive, setIndexActive] = useState(0);
  const dispatch = useAppDispatch();
  const globalBannerItemsOnAuction = useAppSelector(selectBannerItemsOnAuction);
  const [items, setItems] = useState([]);
  const sliderRef = useRef(null);

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
      setItems(response.data.data || []);
    })
      .catch((error) => {
        console.log("getPopularItems() error ===> ", error);
      })
  }

  // const handleClickNext = () => {
  //   setIndexActive((state) => {
  //     if (state >= 2) {
  //       return 0;
  //     }
  //     return state + 1;
  //   });
  // };

  // const handleClickPrev = () => {
  //   setIndexActive((state) => {
  //     if (state === 0) {
  //       return 2;
  //     }
  //     return state - 1;
  //   });
  // };

  const getNftBannerList = async (limit: number) => {
    await axios.post(`${config.API_URL}api/item/get_banner_list`, { limit: limit }, {
      headers:
      {
        "x-access-token": localStorage.getItem("jwtToken")
      }
    }).then((result) => {
      dispatch(changeBannerItemsOnAuction(result.data.data || []));
    }).catch(() => {

    });
  }

  useEffect(() => {
    socket.on("UpdateStatus", data => {
      getNftBannerList(100);
    });
    getNftBannerList(100);
  }, []);

  console.log(items)

  return (
    <div className={`nc-SectionLargeSlider relative ${className}`}>
      <div className="mb-12 lg:mb-14">
        <Heading
          className="text-neutral-900 dark:text-neutral-50 mb-4"
          fontClass="text-3xl md:text-4xl 2xl:text-5xl font-semibold"
          isCenter
          desc=""
        >
          Sponsored Drops
        </Heading>
        <p className="text-center">Want your project listed here contact us!</p>
      </div>
      <Slider ref={sliderRef} arrows={false} settings={{ infinite: true, slidesToShow: 1, slidesToScroll: 1, initialSlide: 0 }}>
        {
          (items && items.length > 0) &&
          items.map((item, index) => (
            <CardLarge1
              className="item"
              item={item}
              key={index}
              isShowing
              featuredImgUrl={nftsLargeImgs[index]}
              onClickNext={() => sliderRef?.current?.slickNext()}
              onClickPrev={() => sliderRef?.current?.slickPrev()}
            />
          ))
        }
      </Slider>
    </div>
  );
};

export default SectionLargeSlider;
