import React, { useEffect } from "react";
import styles from "./Profile.module.sass";
import Cards from "./CollectionCards";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import Icon from "../../components/Icon";
import cn from "classnames";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { config } from "app/config.js";
import { changeCollectionList, changeConsideringCollectionId, selectConllectionList } from "app/reducers/collection.reducers";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { selectCurrentUser } from "app/reducers/auth.reducers";
import CollectionCard from "components/CollectionCard";

const SlickArrow = ({ currentSlide, slideCount, children, ...props }) => (
  <button {...props}>{children}</button>
);

const CollectionsOfACategory = () => 
{  
  const currentUsr = useAppSelector(selectCurrentUser);  
  const collections = useAppSelector(selectConllectionList);
  const dispatch =  useAppDispatch();  
  const history = useNavigate();
  const { category } = useParams();
  
  const fetchCollections = async (limit) => {
    await axios.post(`${config.API_URL}api/collection/getCategoryCollections`, { limit: limit, category: category}, {
      headers:
      {
          "x-access-token": localStorage.getItem("jwtToken")
      }
    }).then((result) => {
      dispatch(changeCollectionList(result.data.data));
    }).catch(() => {

    });
  }

    useEffect(() =>
    {
      fetchCollections(90, currentUsr._id);
    }, [currentUsr._id]);
  
 
  const createNewCollection = () =>
  {
    history("/createCollection");
  }

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 2,
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

  return (
    <div className="container">
      <div style={{paddingTop: "3rem", paddingRight: "5rem"}}>
        <h1 style={{ fontSize:"28px" }}>Collections with {category} category</h1>
      </div>   
      <div style={{
        margin: "1rem"
      }}>
      </div>   
        {
            (collections !== undefined && collections !== null) &&
            
            <div id="sliderWrapper" className={styles.list} style={{minHeight: "calc(100vh - 500px)"}}>            
              <div className={`grid grid-cols-1 sm:grid-cols-4 gap-4 2xl:gap-6`}>
                  {                                     
                    (collections && collections.length >0 ) ? collections.map((x, index) => (
                        <CollectionCard className={styles.card} collection={x} key={index} />
                    ))
                    : 
                    <h3 style={{witch:"100%"}}>There is no collection</h3>                                 }         
              </div>                   
            </div>
        }
        <div style={{marginBottom:"5rem"}}><span>&nbsp;&nbsp;</span></div>
    </div>
  );
};

export default CollectionsOfACategory;
