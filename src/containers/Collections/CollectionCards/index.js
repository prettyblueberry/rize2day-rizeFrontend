import React from "react";
// import cn from "classnames";
import styles from "./Cards.module.sass";
// import Icon from "../../../components/Icon";
import styles1 from "../ProfileEdit.module.sass";
import styles2 from "../UploadDetails.module.sass";
import { config } from "app/config.js";

const Cards = ({ className, collection, onSelectCollection}) => {
  
  const onSelectCard = (id) =>
  {
    // document.getElementById(`${id}`).style.border = "2px solid rgba(200,200,200, 1)";
    // document.getElementById(`${id}`).style.background = "rgba(170, 170, 170, 0.3)";
    // document.getElementById(`${id}`).style.borderRadius = "20px";
    // items.forEach(element => {
    //   if(element._id !== id) {
    //     document.getElementById(`${element._id}`).style.border = "none";
    //     document.getElementById(`${element._id}`).style.background = "none";
    //   }
    // }
    // );
    onSelectCollection(id);
  }
//{styles.card}
  return (
    <div className={(className, styles.card)} >
      
        <div id={collection._id} className={styles.collection} onClick={() =>onSelectCard(collection._id)}          
        >          
          <div style={{
            width : "100%",
            position : "relative",
            height : "250px"
          }}>
            {collection.banner !== "" && <img style={{
              position: "absolute",
              width:"100%",
              height:"100%",
              borderRadius: "20px"
            }}
              id="BannerImg" src={`${config.API_URL}uploads/${collection.bannerURL}`} alt="Banner" /> }
            <div className={styles2.file} style={{border:"2px solid rgb(204, 204, 204)", 
                borderRadius:"50%",
                width : "5rem",
                height : "5rem",
                position: "absolute",
                left : "50%",
                top : "100%",
                marginLeft: "-2.5rem",
                marginTop : "-2.5rem"                
                }}>
              <div className={styles1.avatar } >
                {collection.avatar !=="" &&<img id="avatarImg" src={`${config.API_URL}/uploads/${collection.logoURL}`} alt="Avatar" /> }
              </div>
            </div>   
          </div>
            <div className={styles1.stage} style={{marginTop: "4rem", textAlign:"center"}}>{collection.name}</div>
            <div className={styles1.text} style={{textAlign:"center"}} >
            {
              (collection.items && collection.items.length>0) ?
              collection.items.length+" items"
              :
              "0 items"
            } 
            </div>
            <div className={styles1.text} style={{textAlign:"center"}} >
              {collection.description}
            </div>
          </div>          
     
    </div>
  );
};

export default Cards;
