import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { io } from "socket.io-client"
import { FaStar } from "react-icons/fa"
import { FiStar } from "react-icons/fi"
import { RiMailOpenLine } from "react-icons/ri"
import { format } from "timeago.js"
import { config } from 'app/config'
import defaultAvatar from "images/default_avatar.png";

function SidebarChat({ chatroomtile, currentChat, currentUser, arrivalChat }) {
    const [user, setUser] = useState(null)
    const [isSelected, SetIsSelected] = useState(false);
    const [online, setOnline] = useState(false);
    const [favorite, setFavorite] = useState(false);
    const [unread, setUnread] = useState(0);
    const [latestAt, setLatestAt] = useState('');
    const socket = useRef(null)

    const API_URL = config.API_URL

    useEffect(() => {
        socket.current = io(API_URL);
    }, [API_URL])

    useEffect(() => {
        const amigoId = chatroomtile.members.find((m) => m !== currentUser._id);
        const currentId = currentChat?.members.find((m) => m !== currentUser._id);
        if (amigoId === currentId) {
            SetIsSelected(true);
        } else {
            SetIsSelected(false);
        }
        socket.current.on("getUsers", (users: any) => {
            setOnline(users.find((user: any) => user.userId === amigoId));
        })
        const getAmigodetails = async () => {
            try {
                const response = await axios.post(`${API_URL}api/users/findOne`, {
                    userId: amigoId
                })
                setUser(response.data.data)
            }
            catch (err) {
                console.log(err)
            }
        }
        const getLatestMessage = async () => {
            try {
                const response = await axios.get(API_URL + 'api/messages/latest/' + chatroomtile?._id)
                const data = response.data;
                if (data.length > 0) {
                    setLatestAt(format(data[0].createdAt));
                }
            } catch (err) {
                console.log(err);
            }
        }
        getAmigodetails()
        getLatestMessage()
    }, [currentUser, currentChat, chatroomtile, online, API_URL])

    const getUnreadCount = async () => {
        try {
            const resp = await axios.get(API_URL + 'api/messages/count/', {
                params: {
                    chatroomId: chatroomtile?._id,
                    userId: currentUser?._id
                }
            })
            setUnread(resp.data);
            if (resp.data > 0) {
                document.title = document.title.replace(/\(\d+\)/g, "") + ` (${resp.data})`;
            } else {
                document.title = document.title.replace(/\(\d+\)/g, "");
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleFavorite = () => {
        const storage = localStorage.getItem("favorites");
        let favorites = {}
        if (storage) {
            favorites = JSON.parse(storage);
        }
        if (favorites && chatroomtile?._id) {
            favorites[chatroomtile?._id] = !favorite;
        }
        setFavorite(!favorite);
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    useEffect(() => {
        const storage = localStorage.getItem("favorites");
        let favorites = {};
        if (storage) {
            favorites = JSON.parse(storage);
        }
        if (favorites && chatroomtile?._id) {
            setFavorite(favorites[chatroomtile?._id]);
        }
    }, [chatroomtile])

    useEffect(() => {
        if (document.hidden || chatroomtile?._id !== currentChat?._id) {
            getUnreadCount();
        } else {
            setUnread(0);
        }
    }, [arrivalChat, currentChat])

    return (
        <div className={isSelected ? 'sidebarchat sidebarchat-select' : 'sidebarchat'}>
            <div className='flex align-items-center'>
                <img className='amigo-profilepic' src={user?.avatar ? `${API_URL}uploads/${user.avatar}` : defaultAvatar} alt='' />
                <div className={online ? "online" : "offline"}></div>
                <div className='flex flex-col justify-center'>
                    <p className="sidebarchat-info-name">{user ? user?.username : ""}</p>
                </div>
            </div>
            <div className='flex flex-col gap-3'>
                <div className='flex gap-3 justify-end'>
                    <span className='latest_time'>{latestAt ? latestAt.replace(' ago', '') : 'just now'}</span>
                </div>
                <div className='flex gap-3 justify-end'>
                    {unread > 0 && <span className='badge'>{unread}</span>}
                    <button name="favorite" className='btn-favorite' onClick={handleFavorite}>
                        {favorite ? <FaStar size={20} color='#12A4FF'></FaStar> : <FiStar size={20} color='#8f9199'></FiStar>}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SidebarChat