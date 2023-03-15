import emptyImage from 'images/empty-message.png'

function EmptyChatRoom() {
  return (
    <div className="EmptyChatroom">
      <img className="emptychatroom-img"
        src={emptyImage}
        alt=""
      ></img>
      <p className="text-xl">Welcome To Our Rize Chat!</p>
    </div>
  );
}

export default EmptyChatRoom;
