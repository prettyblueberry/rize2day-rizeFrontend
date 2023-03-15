import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import cn from "classnames";
import styles from "./UploadVariants.module.sass";
import Control from "../../components/Control";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { isEmpty } from "app/methods";
import { Helmet } from "react-helmet";

const items = [
  {
    url: "/upload-single",
    buttonText: "Create Single",
    image: "/images/content/upload-pic-1.jpg",
    image2x: "/images/content/upload-pic-1@2x.jpg",
    flag : 0
  },
  {
    url: "/upload-multiple",
    buttonText: "Create Multiple",
    image: "/images/content/upload-pic-2.jpg",
    image2x: "/images/content/upload-pic-2@2x.jpg",
    flag : 1
  },
];

const Upload = () => {

  const currentUsr = useSelector(state => state.auth.user);
  const detailedUserInfo = useSelector(state => state.auth.detail);
  const navigate = useNavigate();

  useEffect(() =>{
    //check the current user, if ther user is not exists or not verified, go back to the home
    if(isEmpty(currentUsr) || (!isEmpty(detailedUserInfo) && !isEmpty(detailedUserInfo.verified) &&  detailedUserInfo.verified === false) ) navigate("/")
  }, [])

  return (
    <>
    <Helmet>
      <title>Single Or Multiple || Rize2Day </title>
    </Helmet>
    <div className={styles.page}>
      <div className={cn("section-pt80", "mt-10", styles.section)}>
        <div className={cn("container",  styles.container)}>
          <div className="text-black dark:text-white">
            <h1 className="text-black dark:text-white my-10 text-[30px]">Upload item</h1>
            <div className="text-black dark:text-white mb-2">
              Choose <span>“Single”</span> if you want your collectible to be
              one of a kind or <span>“Multiple”</span> if you want to sell one
              collectible multiple times
            </div>
          </div>
          <div className={styles.list}>
            {
              (items && items.length> 0) && 
            items.map((x, index) => (
              <div className={`${styles.item} cursor-pointer`} key={index}>
                <div className={styles.preview} onClick={() => { navigate(x.url) }}>
                  <img srcSet={`${x.image2x} 2x`} src={x.image} alt="Upload" />
                </div>
                <Link className={cn("button-stroke", styles.button)} to={x.url} >
                  {x.buttonText}
                </Link>
              </div>
            ))}
          </div>
          <div className="mb-2">
            We do not own your private keys and cannot access your funds without
            your confirmation.
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Upload;
