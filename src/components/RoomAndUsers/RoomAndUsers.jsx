import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RoomAndUsers.css';

export const RoomAndUsers = ({ socket, userName, room, setRooms }) => {
  const [roomUsers, setRoomUsers] = useState([]);
  console.log(roomUsers);
  const navigate = useNavigate();
  const uniqueIds = new Set();

  let filteredArray = roomUsers.filter(item => {
    if (!uniqueIds.has(item.id)) {
        uniqueIds.add(item.id);
        return true;
    }
    return false;
});

  useEffect(() => {
    socket.on('chatroom_users', (data) => {
      setRoomUsers(data);
    });

    socket.on('rooms', (data) => {
      setRooms(data.rooms);
    });

    return () => socket.off('chatroom_users');
  }, [socket, roomUsers, setRooms]);

  const leaveRoom = () => {
    const createdtime = Date.now();
    socket.emit('leave_room', { userName, room, createdtime });

    localStorage.removeItem('room');
    localStorage.removeItem('user');

    navigate('/', { replace: true });
  };

  return (
    <div className="room-users-column">
      <h2 className="room-title">{room}</h2>

      <div>
        {filteredArray.length > 0 && <h5 className="users-title">Users:</h5>}
        <ul className="users-list">
          {filteredArray.map((user) => (
            <li
              className="user-item"
              key={user.id}
            >
              {user.userName}
            </li>
          ))}
        </ul>
      </div>

      <button className='button button-outline' onClick={leaveRoom}>
        Leave
      </button>
    </div>
  );
};
