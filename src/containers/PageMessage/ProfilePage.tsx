import React, { useContext, useState } from "react";
import axios from "axios";
import CloseIcon from "@material-ui/icons/Close";
import { useAppSelector } from "app/hooks";
import { selectCurrentUser } from "app/reducers/auth.reducers";
import defaultAvatar from "images/default_avatar.png";
import { config } from "app/config";

function ProfilePage({ toggler, togglestate }) {
  const user = useAppSelector(selectCurrentUser);
  const [username, setUsername] = useState(user?.username)
  const [photo, setPhoto] = useState("")
  const API_URL = config.API_URL

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const updated_data = new FormData();
    updated_data.append("username", username);
    if (photo !== "") {
      updated_data.append("photo", photo);
    }

    try {
      await axios.put(API_URL + 'api/users/' + user?._id, updated_data, config)
      const result = await axios.get(API_URL + "api/users/" + user?._id)
      const data = JSON.stringify(result.data)
      localStorage.setItem("user", data)
    }
    catch (err) {
      console.log(err)
    }
    window.location.reload()
  }

  return (
    <div className="profile">
      <div className={togglestate ? "profile-card-open" : "profile-card-close"}>
        <div className="close-div">
          <span onClick={toggler}>
            <CloseIcon fontSize="large" />
          </span>
        </div>
        <img className="profile-image" src={user?.avatar ? `${API_URL}uploads/${user.avatar}` : defaultAvatar} alt=""></img>
        <form>
          <label>User Name</label>
          <div className="user-input">
            {user?.username}
          </div>
          <label>Email</label>
          <div className="user-input">
            {user?.email}
          </div>
          <button type="button" onClick={toggler}>Close</button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
