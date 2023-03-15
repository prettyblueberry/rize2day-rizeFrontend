import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Scrollbar } from "react-scrollbars-custom";
import AddAmigo from "./AddAmigo";
import ProfilePage from "./ProfilePage";
import SidebarChat from "./SidebarChat";
import axios from "axios";
import Input from "shared/Input/Input";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import { IconButton } from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { useAppSelector } from "app/hooks";
import { selectCurrentUser, UserData } from "app/reducers/auth.reducers";
import defaultAvatar from "images/default_avatar.png";
import MessageContainer from "./MessageContainer";
import { config } from "app/config";
import { Helmet } from "react-helmet";
import "../../styles/message.scss";

function PageMessage() {
  const [chatroomtiles, setChatroomtiles] = useState([]);
  const [currentchat, setCurrentchat] = useState(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [arrivalChat, setArrivalChat] = useState(false);
  const user = useAppSelector(selectCurrentUser);
  const { userId: currentMem } = useParams();

  const API_URL = config.API_URL

  /* Fetching the Chat Tiles */
  useEffect(() => {
    const getChatroomtiles = async () => {
      try {
        let data = null;
        if (currentMem) {
          const response = await axios.post(`${API_URL}api/users/findOne`, {
            userId: currentMem
          })
          data = {
            senderId: user._id,
            receiverId: response?.data?.data?._id
          }
          await axios.post(API_URL + 'api/chatrooms', data)
        }

        const res = await axios.get(API_URL + "api/chatrooms", {
          params: {
            user_id: user._id
          }
        });
        setChatroomtiles(res.data);

        if (data) {
          const resp = await axios.post(API_URL + 'api/chatrooms/get', data);
          setCurrentchat(resp.data[0]);
        }
      } catch (err) {
        console.log(err);
      }
    };
    (async () => {
      await getChatroomtiles();
    })();
  }, [user?._id, currentMem, API_URL]);

  /* Logout */

  const logout = () => {
    window.location.href = "/";
  };

  /* AddChat Toggle Setup */
  const [addtoggle, setAddtoggle] = useState(false);
  const addchatToggler = () => {
    addtoggle === false ? setAddtoggle(true) : setAddtoggle(false);
  };

  /* Profile Page Toggle Setup */
  const [profiletoggle, setProfiletoggle] = useState(false);
  const profiletoggler = () => {
    profiletoggle === false ? setProfiletoggle(true) : setProfiletoggle(false);
  };
  return (
    <>
    <Helmet>      
      <title>Chat || Rize2Day </title>
    </Helmet>
    <div className="home">
      {/* Chat Adding Card */}
      {/* <AddAmigo addchattoggler={() => { addchatToggler(); }} addchattoggle={addtoggle} /> */}

      {/* Profile Page Card - Update */}
      {/* <ProfilePage toggler={() => { profiletoggler(); }} togglestate={profiletoggle} /> */}

      {/* Sidebar Open Menu */}
      {open
        ? ""
        : <div className="menu-open" onClick={() => { setOpen(true); }} >
          <IconButton>
            <MenuIcon style={{ fontSize: 30, color: "#333" }} />
          </IconButton>
        </div>
      }

      {/* Sidebar, ChatRoom */}
      <div className="home-components">
        {/* Sidebar */}
        <div className={open ? "sidebar active" : "sidebar"}>
          <div className="sidebar-top-header">
            <div className="sidebar-mobile-header">
              <div></div>
              <div className="menu-close" onClick={() => { setOpen(false); }} >
                <IconButton>
                  <CloseIcon style={{ fontSize: 30, color: "#333" }} />
                </IconButton>
              </div>
            </div>
            <div className="sidebar-header">
              <IconButton className="user-profile" onClick={() => { profiletoggler(); }} >
                <img className="user-profile-image" src={user?.avatar ? `${API_URL}uploads/${user.avatar}` : defaultAvatar} alt='' />
              </IconButton>
              <span className="sidebar-mobile-profile-name">{user?.username}</span>
              <div className="logout-option">
                <IconButton onClick={logout}>
                  <ExitToAppIcon />
                </IconButton>
              </div>
            </div>
            <div className="sidebar-search">
              <div className="sidebar-search-container">
                <SearchIcon className="sidebar-searchicon" />
                <Input type="text" name="chat-search" placeholder="Search for the username..." onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="logout-mobile-option">
                <IconButton onClick={logout}>
                  <ExitToAppIcon />
                </IconButton>
              </div>
            </div>
          </div>

          {/* Chatroom tiles */}

          <Scrollbar className="sidebar-members" noScrollX={true}>
            <div className="sidebar-chatoptions">
              {chatroomtiles.filter(opt => {
                if (search) {
                  for (let i = 0; i < opt.usernames.length; i++) {
                    const item = opt.usernames[i];
                    const fullname = user.username
                    if (item !== fullname && item.toLowerCase().includes(search.toLowerCase())) {
                      return true;
                    }
                  }
                  return false;
                } else {
                  return true;
                }
              }).map((chatroomtile, index) => (
                <div
                  key={index}
                  onClick={(e) => {
                    setCurrentchat(chatroomtile);
                    setOpen(false);
                  }}
                >
                  <SidebarChat chatroomtile={chatroomtile} currentChat={currentchat} currentUser={user} arrivalChat={arrivalChat} />
                </div>
              ))}
            </div>
          </Scrollbar>
        </div>

        {/* Chatroom */}
        <MessageContainer currentchat={currentchat} chatroomtiles={chatroomtiles} arrivalChat={arrivalChat} setArrivalChat={setArrivalChat} />
      </div>
    </div >
    </>
  );
}

export default PageMessage;