import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineMessage } from "react-icons/ai";
import { useAppSelector } from "app/hooks";
import { selectCurrentUser } from "app/reducers/auth.reducers";
import { config } from "app/config";

const Message = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
  const [unread, setUnread] = useState(0);

  const getUnreadTotalCount = async (userId: string | number) => {
    try {
      const resp = await axios.get(config.API_URL + 'api/messages/total/', {
        params: {
          userId: userId
        }
      })
      if (resp?.data.length > 0) {
        setUnread(resp.data[0].unread);
        document.title = document.title.replace(/\(\d+\)/g, "") + ` (${resp.data[0].unread})`;
      } else {
        setUnread(0);
        document.title = document.title.replace(/\(\d+\)/g, "")
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    let intVal = null;
    if (user && user._id) {
      intVal = setInterval(() => {
        getUnreadTotalCount(user._id);
      }, 6000)
    }
    return () => clearInterval(intVal);
  }, [user]);

  return (
    <button
      className={`relative text-2xl md:text-3xl w-12 h-12 rounded-full text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none flex items-center justify-center`}
      onClick={() => navigate('/message')}
    >
      <AiOutlineMessage size={24} />
      {unread > 0 && <span className='unread-badge' />}
    </button>
  );
};

export default Message;
