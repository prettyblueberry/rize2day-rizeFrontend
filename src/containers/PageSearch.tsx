import React, { FC, useRef, useState, useEffect } from "react";
import clsx from 'clsx';
import { Helmet } from "react-helmet";
import HeaderFilterSearchPage from "components/HeaderFilterSearchPage";
import Input from "shared/Input/Input";
import ButtonCircle from "shared/Button/ButtonCircle";
import CardNFT from "components/CardNFT";
import axios from "axios";
import { config, CATEGORIES, FILE_TYPE } from "app/config";
import { isEmpty } from "app/methods";
import CardNFTMusic from "components/CardNFTMusic";
import CardNFTVideo from "components/CardNFTVideo";
import CardNFT3D from "components/CardNFT3D";
import frameImg from 'images/vector.svg';

const navLinks = [{ value: 0, text: "All items" }, ...CATEGORIES];
const dateOptions = [
  { value: 0, text: "Newest" },
  { value: 1, text: "Oldest" },
  { value: 2, text: "Price: Low to High" },
  { value: 3, text: "Price: High to Low" },
  { value: 4, text: "Most Like" },
  { value: 5, text: "Least Like" },
];
const priceOptions = [
  { value: 0, text: "Highest price" },
  { value: 1, text: "The lowest price" },
];
const likesOptions = [
  { value: 0, text: "Most liked" },
  { value: 1, text: "Least liked" },
];
const creatorOptions = [
  { value: 0, text: "All" },
  { value: 1, text: "Verified only" },
];
const statusOptions = [
  { value: 0, text: "All" },
  { value: 1, text: "On Sale" },
  { value: 2, text: "On Auction" },
  { value: 3, text: "Listed" }
];

export interface PageSearchProps {
  className?: string;
}

const settings = {
  effect: "coverflow",
  centeredSlides: true,
  slidesPerView: 3,
  coverflowEffect: {
    rotate: 0, // Slide rotate in degrees
    stretch: 40, // Stretch space between slides (in px)
    depth: 300, // Depth offset in px (slides translate in Z axis)
    modifier: 1, // Effect multipler
    slideShadows: false // Enables slides shadows
  }
}

const PageSearch: FC<PageSearchProps> = ({ className = "" }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [search, setSearch] = useState("");

  const [date, setDate] = useState(0);
  const [likes, setLikes] = useState(0);
  const [creator, setCreator] = useState(0);
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState(3);
  const [range, setRange] = useState([0, 100000]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [fileType, setFileType] = useState(0);
  const [reSearch, setResearch] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState({});
  const [metadatas, setMetaDatas] = useState([]);
  const [checked, setChecked] = React.useState([]);
  const [collections, setCollections] = useState([]);
  const [viewNoMore, setViewNoMore] = useState(false);
  const pageRef = useRef(null);

  useEffect(() => {
    onResetFilter();
  }, []);

  useEffect(() => {
    getCollectionList(true);
  }, [
    date,
    activeIndex,
    price,
    fileType,
    likes,
    creator,
    range,
    reSearch,
    selectedCollection,
    checked,
    status,
    priceMin,
    priceMax,
  ]);

  const onSearch = () => {
    setResearch(!reSearch);
  };

  useEffect(() => {
    if (selectedCollection) {
      axios
        .post(`${config.API_URL}api/collection/get_collection_metadatas`, {
          id: (selectedCollection as any)._id,
        })
        .then((result) => {
          if (result.data.data[0].metaData) {
            setMetaDatas(result.data.data[0].metaData);
          } else {
            setMetaDatas([]);
          }
        })
        .catch(() => { });
    } else {
      setMetaDatas([]);
    }
  }, [selectedCollection]);

  const getCollectionList = (reStart: boolean) => {
    let currentItemCount = localStorage.getItem("currentItemCount");
    if (currentItemCount == null || currentItemCount == undefined) {
      localStorage.setItem("currentItemCount", "0");
    }

    var param = {
      start: reStart == true ? 0 : currentItemCount,
      last: reStart == true ? 10 : Number(currentItemCount) + Number(10),
      date: dateOptions[date].value,
      category: navLinks[activeIndex].value,
      status: statusOptions[status].value,
    };
    // if (visible) {
    (param as any).price = priceOptions[price].value;
    (param as any).likes = likesOptions[likes].value;
    (param as any).creator = creatorOptions[creator].value;
    // (param as any).range = range;

    (param as any).range = [range[0], range[1]];
    (param as any).search = search;
    (param as any).sortmode = dateOptions[date].value;
    (param as any).fileType = fileType;
    // }
    // if (selectedCollection) {
    //   (param as any).collection_id = (selectedCollection as any)._id;
    //   (param as any).metadata = checked;
    // }

    localStorage.setItem("loading", "true");
    setTimeout(() => {
      localStorage.setItem("loading", "false");
      setViewNoMore(false);
    }, 2000);
    axios
      .post(`${config.API_URL}api/collection/onsearch`, param)
      .then((result) => {
        var list = [];
        for (var i = 0; i < result.data.list.length; i++) {
          var item = result.data.list[i].item_info;
          item.owner = result.data.list[i].owner_info;
          item.users = [{ avatar: result.data.list[i].creator_info.avatar }];
          list.push(item);
        }
        if (isEmpty(list)) {
          setViewNoMore(true);
        }
        if (reStart) {
          localStorage.setItem(
            "currentItemCount",
            (Number(currentItemCount) + Number(list.length)).toString()
          );
          setCollections(list);
        } else {
          setCollections((collections) => {
            localStorage.setItem(
              "currentItemCount",
              (Number(currentItemCount) + Number(list.length)).toString()
            );
            return collections.concat(list);
          });
        }
      })
      .catch(() => {
        localStorage.setItem("loading", "false");
      });
  };

  const handleToggle = (object) => () => {
    const currentIndex = checked.indexOf(object);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(object);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const onResetFilter = () => {
    setDate(0);
    setLikes(0);
    setCreator(0);
    setStatus(3);
    setPrice(0);
    setSearch("");
    setRange([0, 100000]);
    setResearch(false);
    // setSelectedCollection({});
    setMetaDatas([]);
    setChecked([]);
    setPriceMax("");
    setPriceMin("");
    setFileType(0);
    localStorage.setItem("loading", "false");
    localStorage.setItem("currentItemCount", "0");
  };

  const onChangeSearch = (event) => {
    setSearch(event.target.value);
    onSearch();
  };

  const handlePrice = (type, event) => {
    var pattern = /[^0-9.]/g;
    var result = event.target.value.match(pattern);
    if (!result && !isNaN(event.target.value)) {
      if (type == "min") {
        setPriceMin(event.target.value);
      } else if (type == "max") {
        setPriceMax(event.target.value);
      }
    }
  };

  useEffect(() => {
    var lastScrollTop = 0;
    window.onscroll = () => {
      var st = document.documentElement.scrollTop;
      if (
        st > lastScrollTop &&
        st > document.documentElement.scrollHeight - 1000
      ) {
        if (
          (viewNoMore === false && !localStorage.getItem("loading")) ||
          localStorage.getItem("loading") !== "true"
        ) {
          getCollectionList(false);
        }
      }
      lastScrollTop = st <= 0 ? 0 : st;
    };
  }, []);

  const renderEffect = () => {
    const rows = [];
    for (let i = 150, j = 0; i < pageRef?.current?.clientHeight; i += 500, j++) {
      rows.push(<div className={clsx("absolute z-auto bg-[#33FF00] opacity-30 blur-[100px] w-[300px] h-[300px] rounded-full", j % 2 === 0 ? '-left-[100px]' : '-right-[100px]')} style={{ top: i + 'px' }}></div>)
    }
    return <div className="absolute top-0 right-0 w-full">{rows}</div>
  }

  return (
    <div className={`nc-PageSearch  ${className}`} data-nc-id="PageSearch">
      <Helmet>
        <title>Marketplace || Rize2Day </title>
      </Helmet>

      {/* <div
        className={`nc-HeadBackgroundCommon h-24 2xl:h-28 top-0 left-0 right-0 w-full bg-primary-50 dark:bg-neutral-800/20 `}
        data-nc-id="HeadBackgroundCommon"
      /> */}
      <div className="container-fluid sticky top-0 z-20 bg-white dark:bg-[#191818]">
        <header className="mx-auto flex flex-col">
          <div className="relative max-w-xl mb-3">
            <label
              htmlFor="search-input"
              className="text-neutral-500 dark:text-neutral-300"
            >
              <span className="sr-only">Search all items</span>
              <Input
                className="shadow-lg border-0 dark:border"
                id="search-input"
                type="search"
                placeholder="Type your keywords"
                sizeClass="pl-14 py-2 pr-5 md:pl-16"
                rounded="rounded-full"
                onChange={onChangeSearch}
                value={search}
              />
              <ButtonCircle
                className="absolute right-2.5 top-1/2 transform -translate-y-1/2"
                size=" w-7 h-7"
                type="button"
                onClick={() => {
                  getCollectionList(true);
                }}
              >
                <i className="las la-arrow-right text-xl"></i>
              </ButtonCircle>
              <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-2xl md:left-6">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 22L20 20"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </label>
          </div>
          <HeaderFilterSearchPage
            className="mb-2"
            onChangeActiveTab={setActiveIndex}
            onChangeDate={setDate}
            dateValue={date}
            onChangeLikes={setLikes}
            likesValue={likes}
            onChangeCreator={setCreator}
            creatorValue={creator}
            onChangePrice={setPrice}
            priceValue={price}
            onChangeStatus={setStatus}
            statusValue={status}
            onChangeRange={setRange}
            rangeValue={range}
            onChangeFileType={setFileType}
            fileTypeValue={fileType}
          />
        </header>
      </div>

      <div className="relative px-10 py-6 lg:pb-28 lg:pt-10 space-y-16 lg:space-y-28 overflow-hidden">
        <main ref={pageRef}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-8 gap-y-10 mt-8 lg:mt-10">
            {collections &&
              collections.length > 0 &&
              collections.map((x, index) =>
                x.fileType > 0 ? (
                  x.fileType === FILE_TYPE.IMAGE ? (
                    <CardNFT className={"w-[300px]"} item={x} key={index} />
                  ) : x.fileType === FILE_TYPE.AUDIO ? (
                    <CardNFTMusic
                      className={"w-[300px]"}
                      item={x}
                      key={index}
                    />
                  ) : x.fileType === FILE_TYPE.VIDEO ? (
                    <CardNFTVideo
                      className={"w-[300px]"}
                      item={x}
                      key={index}
                    />
                  ) : (
                    <CardNFT3D
                      className={"w-[300px]"}
                      item={x}
                      key={index}
                    />
                  )
                ) : (
                  <></>
                )
              )}
          </div>

          <div className=" text-center mt-10 m-10">
            <span>&nbsp;{viewNoMore === true && "No more items"}&nbsp;</span>
          </div>
          {/* 
          <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
            <ButtonPrimary
              onClick={() => { onLoadMore() }}
            >Show me more</ButtonPrimary>
          </div> */}
          {renderEffect()}
          <img className="absolute w-full right-0 bottom-1/4 opacity-5" src={frameImg} alt="" />
        </main>
      </div>
    </div>
  );
};

export default PageSearch;
