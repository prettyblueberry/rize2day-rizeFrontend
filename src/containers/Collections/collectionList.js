import React, { useEffect } from "react";
import styles from "./Profile.module.sass";
import Cards from "./CollectionCards";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Icon from "../../components/Icon";
import cn from "classnames";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { config } from "app/config.js";
import { changeCollectionList, changeConsideringCollectionId, selectConllectionList } from "app/reducers/collection.reducers";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { selectCurrentUser } from "app/reducers/auth.reducers";
import CollectionCard from "components/CollectionCard";
import { Helmet } from "react-helmet";
import { useSigningClient } from "app/cosmwasm";
import { toast } from "react-toastify";

const SlickArrow = ({ currentSlide, slideCount, children, ...props }) => (
  <button {...props}>{children}</button>
);

const CollectionList = () => {
  const currentUsr = useAppSelector(selectCurrentUser);
  const collections = useAppSelector(selectConllectionList);
  const { removeCollection } = useSigningClient();
  const dispatch = useAppDispatch();
  const history = useNavigate();

  const fetchCollections = async (limit, currentUserId) => {
    await axios.post(`${config.API_URL}api/collection/getUserCollections`, { limit: limit, userId: currentUserId }, {
      headers:
      {
        "x-access-token": localStorage.getItem("jwtToken")
      }
    }).then((result) => {
      dispatch(changeCollectionList(result.data.data));
    }).catch(() => {

    });
  }

  useEffect(() => {
    fetchCollections(90, currentUsr._id);
  }, [currentUsr._id]);

  const createNewCollection = () => {
    history("/createCollection");
  }

  const handleRemove = (_id, collectionNumber) => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: "Do you want to remove the collection?",
      showCancelButton: true,
    }).then(async (res) => {
      if (!res.isConfirmed) return;
      console.log(res);
      try {
        const resp = await removeCollection(currentUsr?.address, collectionNumber);
        if (resp !== -1) {
          await axios({
            method: "post",
            url: `${config.API_URL}api/collection/removeOne`,
            data: {
              _id
            }
          });
          fetchCollections(90, currentUsr._id);
          toast.success("Successfully removed the collection");
        }
      } catch (err)  {
        console.log(err);
      }
    })
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
    <>

      <Helmet>
        <title>My Collections || Rize2Day </title>
      </Helmet>
      <div className="container">
        <div style={{ paddingTop: "3rem", paddingRight: "5rem" }}>
          <h1>My Collections</h1>
        </div>
        <div style={{
          margin: "1rem"
        }}>
          <ButtonPrimary className={cn("button-stroke button-small", styles.btns)} onClick={() => createNewCollection()}>
            <span>Create a collection</span>
          </ButtonPrimary>
        </div>
        {
          (collections !== undefined && collections !== null) &&

          <div id="sliderWrapper" className={styles.list} style={{ minHeight: "calc(100vh - 500px)" }}>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 mt-8 lg:mt-10" >
              {

                (collections && collections.length > 0) ? collections.map((x, index) => (
                  <CollectionCard className={styles.card} collection={x} key={index} onRemove={handleRemove} />
                )) : <></>
              }
            </div>
          </div>
        }
        <div style={{ marginBottom: "5rem" }}><span>&nbsp;&nbsp;</span></div>
      </div>
    </>
  );
};

export default CollectionList;
