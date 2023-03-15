import moment from "moment";
import { useAppSelector } from "app/hooks";
import { selectCurrentUser } from "app/reducers/auth.reducers";
import { config } from "app/config";
import defaultAvatar from "images/default_avatar.png";

function Message({ message, amigo, own }) {
    const user = useAppSelector(selectCurrentUser);
    const API_URL = config.API_URL
    
    return (
        <div className='message-box'>
            <img className="message-image"
                src={own ? (user?.avatar ? `${API_URL}uploads/${user.avatar}` : defaultAvatar) : (amigo?.avatar ? `${API_URL}uploads/${amigo.avatar}` : defaultAvatar)}
                alt=""
            >
            </img>
            <div>
                <div className="message-header">
                    <span className='message-user'>{own ? "Me" : amigo?.username}</span>
                    <span className='message-time'>{moment(message.createdAt).format("MMM DD YYYY, hh:mm A")}</span>
                </div>
                <p className="message-text" dangerouslySetInnerHTML={{ __html: message.text }}></p>
            </div>
        </div>
    )
}

export default Message
