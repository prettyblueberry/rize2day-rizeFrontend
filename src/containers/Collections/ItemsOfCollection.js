import React, { useEffect, useState } from "react";
import cn from "classnames";
import Icon from "../../components/Icon";
import styles from "./Profile.module.sass";
import Card from "../../components/Card";
import Slider from "react-slick";
import { FILE_TYPE, config } from "app/config.js";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { isEmpty } from "app/methods";
import { useAppDispatch, useAppSelector } from "app/hooks";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import {
  changeDetailedCollection,
  selectDetailedCollection,
} from "app/reducers/collection.reducers";
import CardNFT from "components/CardNFT";
import CardNFTMusic from "components/CardNFTMusic";
import CardNFTVideo from "components/CardNFTVideo";
import CardNFT3D from "components/CardNFT3D";
import {
  selectCurrentChainId,
  selectCurrentUser,
} from "app/reducers/auth.reducers";
import { Helmet } from "react-helmet";
import SelectBox from "components/SelectBox";
import BoolBox from "components/BoolBox";

const SlickArrow = ({ currentSlide, slideCount, children, ...props }) => (
  <button {...props}>{children}</button>
);

const ItemsOfCollection = () => {
  const collection = useAppSelector(selectDetailedCollection);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUsr = useAppSelector(selectCurrentUser);
  const currentChainId = useAppSelector(selectCurrentChainId);

  const [items, setItems] = useState([]);
  const [start, setStart] = useState(0);
  const [last, setLast] = useState(8);
  const [metaData, setMetaData] = useState([]);
  // const collectionId = useSelector(state => state.collection.consideringId);
  const [viewNoMore, setViewNoMore] = useState(false);
  const [metaList, setMetaList] = useState([]);
  const [all, setAll] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const { collectionId } = useParams();

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: (
      <SlickArrow>
        <Icon name="arrow-next" size="14" />
      </SlickArrow>
    ),
    prevArrow: (
      <SlickArrow>
        <Icon name="arrow-prev" size="14" />
      </SlickArrow>
    ),
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 100000,
        settings: "unslick",
      },
    ],
  };

  useEffect(() => {
    axios
      .post(
        `${config.API_URL}api/collection/detail`,
        { id: collectionId },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then((result) => {
        const data = result?.data?.data;
        setMetaData(data?.metaData);
        const list = [];
        for (let i = 0; i < data.metaData.length; i++) {
          const meta = data.metaData[i];
          const temp = {};
          temp.key = meta.trait_type;
          temp.value = meta.type.text === "boolean" ? false : [];
          list.push(temp);
        }
        setMetaList(list);
        dispatch(changeDetailedCollection(data));
      })
      .catch(() => {});
  }, [collectionId]);

  useEffect(() => {
    setStart(0);
    setLast(8);
    itemsOfCollectionList();
  }, []);

  const onLoadMore = () => {
    itemsOfCollectionList();
  };

  useEffect(() => {
    setItems(items);
  }, [last, start]);

  const itemsOfCollectionList = (isAll = false) => {
    var params = { start: start, last: last, date: 0, colId: collectionId };
    if (!isAll) {
      params.metaData = metaList;
    }
    axios
      .post(`${config.API_URL}api/item/get_items_of_collection`, params)
      .then((result) => {
        if (isEmpty(result.data.data)) {
          setViewNoMore(true);
          setTimeout(() => {
            setViewNoMore(false);
          }, 2500);
        }

        setItems(result.data.data);
        // if (start === 0) {
        //   setItems(result.data.data);
        // } else {
        //   let curItems = items;
        //   let moreItems = [], i;
        //   moreItems = result.data.data;
        //   if (moreItems.length > 0)
        //     for (i = 0; i < moreItems.length; i++) curItems.push(moreItems[i]);
        //   setItems(curItems);
        // }
        // setStart(last);
        // setLast(last + 8);
      })
      .catch(() => {});
  };
  console.log(">>>>>", metaList);
  const handleChangeFilter = (value, index) => {
    if (metaList.length > index) {
      const temp = metaList;
      temp[index].value = value;
      setMetaList(temp);
      itemsOfCollectionList();
      setRefresh(!refresh);
    }
  };

  const handleChangeAll = (value) => {
    setAll(value);
    itemsOfCollectionList(value);
    setRefresh(!refresh);
  };

  return (
    <>
      <Helmet>
        <title>Detailt Collection || Rize2Day </title>
      </Helmet>
      <div
        style={{
          width: "100%",
          marginLeft: "0",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            width: "100%",
            position: "relative",
            height: "300px",
          }}
        >
          {collection && collection.bannerURL !== "" && (
            <img
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
              id="BannerImg"
              src={`${config.API_URL}uploads/${collection.bannerURL}`}
              alt="Banner"
            />
          )}
          <div
            className={styles.logoImg}
            style={{
              border: "2px solid rgb(204, 204, 204)",
              borderRadius: "50%",
              width: "10rem",
              height: "10rem",
              position: "absolute",
              left: "50%",
              top: "100%",
              marginLeft: "-5rem",
              marginTop: "-5rem",
            }}
          >
            <div className={styles.logoImg}>
              {collection && collection.logoURL !== "" && (
                <img
                  id="avatarImg"
                  src={`${config.API_URL}uploads/${collection.logoURL}`}
                  alt="Avatar"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div
          className={styles.collectionName}
          style={{ marginTop: "6rem", textAlign: "center" }}
        >
          {collection && collection.name}
        </div>
        <div
          className={styles.createdBy}
          style={{ marginTop: "1rem", textAlign: "center" }}
        >
          {collection && collection.owner && (
            <>
              <span>Created by </span>
              <span
                onClick={() => navigate(`/profile/${collection.owner._id}`)}
              >{`${collection.owner.username}`}</span>
            </>
          )}
        </div>
        <div
          className={styles.collectionFloorPrice}
          style={{ textAlign: "center" }}
        >
          {collection && collection.price
            ? "Floor price : " + collection.price + " RIZE"
            : "Floor price : 0 " + " RIZE"}
        </div>
        <div
          className={styles.collectionDescription}
          style={{ textAlign: "center" }}
        >
          {collection && collection.description}
        </div>
        <div className="flex justify-end py-2 gap-4">
          {currentUsr && currentUsr?._id === collection?.owner?._id && (
            <ButtonPrimary
              onClick={() => {
                navigate("/page-upload-item");
              }}
            >
              Create NFTs
            </ButtonPrimary>
          )}
        </div>
        <div className="w-full border-b border-neutral-200/70 dark:border-neutral-600 my-4"></div>
        <div className="grid grid-flow-col auto-cols-auto justify-start py-2 mb-3 gap-4">
          <BoolBox
            text="All"
            value={all}
            onChange={(v) => handleChangeAll(v)}
          />
          {metaData?.length > 0 &&
            metaData.map((meta, index) => {
              if (meta.type.text === "boolean") {
                return (
                  <BoolBox
                    text={meta.trait_type}
                    value={metaList[index].value}
                    onChange={(v) => handleChangeFilter(v, index)}
                  />
                );
              }
              if (meta.type.text === "string" || meta.type.text === "number") {
                return (
                  <SelectBox
                    text={meta.trait_type}
                    types={meta.property}
                    value={metaList[index].value}
                    onChange={(v) => handleChangeFilter(v, index)}
                  />
                );
              }
            })}
        </div>
        {items !== undefined && items !== null && items.length > 0 ? (
          <div align="center">
            <div id="sliderWrapper" className={styles.list}>
              <Slider
                className={cn("discover-slider", styles.slider)}
                {...settings}
              >
                {items && items.length > 0 && items ? (
                  items.map((x, index) =>
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
                      <div key={index}></div>
                    )
                  )
                ) : (
                  <></>
                )}
              </Slider>
            </div>
            <span style={{ marginTop: "2rem" }}>
              &nbsp;{viewNoMore === true && "No more items"}&nbsp;
            </span>
            <div
              className={styles.btns}
              align="center"
              style={{
                marginTop: "1rem",
                marginBottom: "5rem",
              }}
            >
              <button
                className={cn("button-stroke button-small", styles.btns)}
                onClick={() => {
                  onLoadMore();
                }}
              >
                <span>Load more</span>
              </button>
            </div>
          </div>
        ) : (
          <h3 className="px-3 py-2 text-center">No items</h3>
        )}
      </div>
    </>
  );
};

export default ItemsOfCollection;
