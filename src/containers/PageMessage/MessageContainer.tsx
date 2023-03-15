import { useCallback, useEffect, useState, useRef } from "react";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import moment from "moment";
import { format } from "timeago.js";
import { ContentEditableEvent } from "react-contenteditable";
import { Button, IconButton } from "@material-ui/core";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import { IoSend } from "react-icons/io5";
import { io } from "socket.io-client";
import axios from "axios";
import EmptyChatRoom from "./EmptyChatRoom";
import MessageBox from "./MessageBox";
import Message from "./Message";
import { config } from "app/config";
import defaultAvatar from "images/default_avatar.png";
import { useAppSelector } from "app/hooks";
import { selectCurrentUser, UserData } from "app/reducers/auth.reducers";

const MessageContainer = ({
  currentchat,
  chatroomtiles,
  arrivalChat,
  setArrivalChat,
}) => {
  const API_URL = config.API_URL;
  const [pick, setPick] = useState(false);
  const [online, setOnline] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [amigo, setAmigo] = useState<UserData>();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [down, setDown] = useState(0);
  const user = useAppSelector(selectCurrentUser);
  const roomRef = useRef(null);
  const socket = useRef(null);
  const chatRef = useRef<any>();

  function sendNotification(message: string, avatar: string, username: string) {
    const notification = new Notification("New message from Upit Chat", {
      icon: avatar,
      body: `@${username}: ${message}`,
    });
  }

  function checkPageStatus(message: string, avatar: string, username: string) {
    if (!("Notification" in window)) {
      alert("This browser does not support system notifications!");
    } else if (Notification.permission === "granted") {
      sendNotification(message, avatar, username);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission((permission) => {
        if (permission === "granted") {
          sendNotification(message, avatar, username);
        }
      });
    }
  }

  const setRead = async (roomId: string | number, userId: string | number) => {
    if (roomId) {
      await axios.put(API_URL + "api/messages/", {
        roomId,
        userId,
      });
    }
  };

  /* Emoji Picker */
  const addEmoji = useCallback(
    (e) => {
      let emoji = `<span className="emoji-image">${e.native}</span>`;
      setNewMessage((prev) => prev + emoji);
    },
    [newMessage]
  );

  useEffect(() => {
    socket.current = io(API_URL);
    socket.current.on("getMessage", (data: any) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
      setArrivalChat((prev) => !prev);
      if (!document.hidden || data.chatroomId === chatRef.current?._id) {
        setRead(data.chatroomId, user?._id);
      }
      if (document.hidden || !window.location.pathname.includes("message")) {
        checkPageStatus(data.text, data.avatar, data.username);
        getUnreadTotalCount();
      }
    });
  }, [API_URL]);

  useEffect(() => {
    arrivalMessage &&
      currentchat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentchat]);

  useEffect(() => {
    if (user && user._id) {
      socket.current.emit("addUser", user._id);
    }
  }, [user, chatroomtiles, currentchat, socket]);

  /* Fetching the Chat Tile user details */
  useEffect(() => {
    const amigoId = currentchat?.members.find((m: any) => m !== user._id);
    socket.current.on("getUsers", (users: any) => {
      setOnline(users.find((user: any) => user.userId === amigoId));
    });
    const getAmigodetails = async () => {
      try {
        const response = await axios.post(API_URL + "api/users/findOne", {
          userId: amigoId,
        });
        const amigoData = response.data.data;
        setAmigo(amigoData);
      } catch (err) {}
    };
    if (currentchat) {
      getAmigodetails();
    }
  }, [user, currentchat, API_URL]);

  /* Fetching ChatRoom Messages */
  useEffect(() => {
    const getMessages = async () => {
      try {
        if (user && currentchat) {
          setRead(currentchat?._id, user?._id);
        }
        const response = await axios.get(
          API_URL + "api/messages/" + currentchat?._id
        );
        setMessages(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (currentchat) {
      chatRef.current = currentchat;
      getMessages();
    }
  }, [currentchat, API_URL]);

  useEffect(() => {
    scrollItThere();
  }, [messages]);

  const scrollItThere = useCallback(() => {
    roomRef.current?.scroll({
      top: roomRef.current?.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  const handleSubmit = useCallback(
    async (e: any) => {
      if (!newMessage) return;
      let textMessage = newMessage;
      if (
        textMessage.startsWith("<img") &&
        (textMessage.match(/<img/g) || []).length === 1 &&
        textMessage.endsWith("/>")
      ) {
        textMessage = textMessage.replace(
          'className="emoji-image"',
          'className="emoji-image-full"'
        );
      }
      const sendingMessage = {
        chatroomId: currentchat._id,
        senderId: user._id,
        text: textMessage,
      };

      const receiverId = currentchat.members.find(
        (member: any) => member !== user._id
      );

      socket.current.emit("sendMessage", {
        senderId: user._id,
        receiverId,
        chatroomId: currentchat?._id,
        username: user?.username,
        avatar: `${
          user?.avatar ? `${API_URL}uploads/${user.avatar}` : defaultAvatar
        }`,
        text: textMessage,
      });

      try {
        if (user && currentchat) {
          setRead(currentchat?._id, user?._id);
          setArrivalChat(!arrivalChat);
        }

        const response = await axios.post(
          API_URL + "api/messages/",
          sendingMessage
        );
        setMessages([...messages, response.data]);
        setNewMessage("");
      } catch (err) {
        console.log(err);
      }
      setPick(false);
    },
    [newMessage, currentchat]
  );

  /* Posting a Message */
  const handleMessageKey = (e: any) => {
    if (e.keyCode == 13 && !e.shiftKey) {
      e.preventDefault();
      setDown((prev) => prev + 1);
    }
  };

  useEffect(() => {
    handleSubmit(null);
  }, [down]);

  const handleMessage = (e: ContentEditableEvent) => {
    setNewMessage(e.target.value);
  };

  const getUnreadTotalCount = async () => {
    try {
      const resp = await axios.get(API_URL + "api/messages/total/", {
        params: {
          userId: user?._id,
        },
      });
      if (resp?.data.length > 0) {
        document.title =
          document.title.replace(/\(\d+\)/g, "") + ` (${resp.data[0].unread})`;
      } else {
        document.title = document.title.replace(/\(\d+\)/g, "");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chatroom">
      {currentchat ? (
        <>
          <div className="chatroom-header">
            <div className="chatroom-chatinfo">
              <img
                className="chatroom-profilepic"
                src={
                  amigo?.avatar
                    ? `${API_URL}uploads/${amigo.avatar}`
                    : defaultAvatar
                }
                alt=""
              />
              <div className="chatroom-chatinfo-right">
                <div className="chatroom-chatinfo-name">
                  <a
                    href={"/page-author/" + amigo?._id}
                    className="chatroom-chatinfo-name"
                  >
                    {amigo ? amigo?.username : ""}
                  </a>
                </div>
                <div className="chatroom-top-header">
                  <span>
                    Last seen: {amigo && amigo.logAt ? format(amigo.logAt) : ""}
                  </span>
                  <span> | </span>
                  <span>
                    Local time:{" "}
                    {amigo && amigo.logAt
                      ? moment(amigo.logAt).format("MMM DD, YYYY, hh:mm A")
                      : ""}
                  </span>
                </div>
              </div>
            </div>
            {/* <div className="chatroom-search">
                  <div className="chatroom-search-container">
                    <SearchIcon className="chatroom-searchicon" />
                    <input type="text" name="chat-search" placeholder="Search message..." />
                  </div>
                </div> */}
          </div>
          <div className="chatroom-container">
            <div className="flex flex-col w-full h-full">
              <div
                className="chatroom-messages-container"
                ref={roomRef}
                onClick={() => {
                  setPick(false);
                }}
              >
                {messages.map((message, index) => (
                  <div key={index}>
                    <Message
                      message={message}
                      amigo={amigo}
                      own={message?.senderId === user._id}
                    />
                  </div>
                ))}
              </div>
              <div className="chatroom-footer">
                <div className="chatroom-footer-lefticons">
                  <IconButton
                    onMouseEnter={() => setPick(true)}
                    onMouseLeave={() => setPick(false)}
                  >
                    <InsertEmoticonIcon />
                  </IconButton>
                </div>
                <form onSubmit={handleSubmit}>
                  <MessageBox
                    id="message-input"
                    className="message-input"
                    placeholder="Message..."
                    html={newMessage}
                    onKeyDown={handleMessageKey}
                    onChange={handleMessage}
                  />
                  <button
                    type="submit"
                    className="input-button"
                    onClick={newMessage ? handleSubmit : null}
                  >
                    {" "}
                    Send a Message{" "}
                  </button>
                </form>
                <div
                  className="chatroom-footer-righticon"
                  onClick={newMessage ? handleSubmit : null}
                >
                  <Button className="btn-send">
                    <span className="send-text">SEND</span>
                    <IoSend className="ml-5" color="white" size={18} />
                  </Button>
                </div>
              </div>
            </div>
            <div className="chatroom-profile">
              <div className="flex flex-col gap-5">
                <img
                  className="profile-photo"
                  src={
                    amigo?.avatar
                      ? `${API_URL}uploads/${amigo.avatar}`
                      : defaultAvatar
                  }
                  alt=""
                />
                <div className={online ? "profile-online" : "profile-offline"}>
                  <span />{" "}
                  <p className="m-0">{online ? "Active" : "Inactive"}</p>
                </div>
              </div>
            </div>
          </div>
          <div
            className={pick ? "emoji-picker-open" : "emoji-picker-close"}
            onMouseEnter={() => setPick(true)}
            onMouseLeave={() => setPick(false)}
          >
            <Picker onSelect={addEmoji} emojiSize={25} />
          </div>
        </>
      ) : (
        <EmptyChatRoom />
      )}
    </div>
  );
};

export default MessageContainer;
