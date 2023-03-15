import React from "react";
// import cn from "classnames";
import styles from "./Cards.module.sass";
import Icon from "../../../components/Icon";
import styles1 from "../ProfileEdit.module.sass";
import styles2 from "../UploadDetails.module.sass";
import { useSelector } from "react-redux";
import config, { BACKEND_URL } from "../../../config";

const Cards = ({ className, items, onSelectCollection}) => {
  
  const currentUsr = useSelector(state => state.auth.user);

  const onSelectCard = (id) =>
  {
    document.getElementById(`${id}`).style.border = "2px solid rgba(200,200,200, 1)";
    document.getElementById(`${id}`).style.background = "rgba(170, 170, 170, 0.3)";
    document.getElementById(`${id}`).style.borderRadius = "20px";
    items.forEach(element => {
      if(element._id !== id) {
        document.getElementById(`${element._id}`).style.border = "none";
        document.getElementById(`${element._id}`).style.background = "none";
      }
    }
    );
    onSelectCollection(id);
  }
//{styles.card}
  return (
    <div className={(className, styles.cards)} style={{
      flexWrap : "wrap"}}>
      {
        (items && items.length> 0) && 
      items.map((x, index) => (
        <div key={index} id={x._id} onClick={() =>onSelectCard(x._id)}
          style={{
            width:"30%",
            hight: "400px",
            marginLeft : "1.5%"
          }}
        >          
          <div style={{
            width : "100%",
            position : "relative",
            height : "250px"
          }}>
            {x.banner !== "" && <img style={{
              position: "absolute",
              width:"100%",
              height:"100%",
              borderRadius: "20px"
            }}
              id="BannerImg" src={`${BACKEND_URL}/uploads/${x.bannerURL}`} alt="Banner" /> }
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
                {x.avatar !=="" &&<img id="avatarImg" src={`${BACKEND_URL}/uploads/${x.logoURL}`} alt="Avatar" /> }
              </div>
            </div>   
          </div>
            <div className={styles1.stage} style={{marginTop: "4rem", textAlign:"center"}}>{x.name}</div>
            <div className={styles1.text} style={{textAlign:"center"}} >
              {x.description}
            </div>
          </div>          
      ))}
    </div>
  );
};

export default Cards;
