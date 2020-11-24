import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import './join.css';

const Join = () => {
    const [ name, setName ] = useState("");
    const [ room, setRoom ] = useState("");
    const [ joined, setJoined ] = useState(false);

    const joinRoom = (e) => {
        e.preventDefault();
        if (room.trim().length > 0 && name.trim().length > 0) {
            setJoined(true)
        }
    }

    if (joined) {
        return <Redirect to={`/chat?name=${name}&room=${room}`} />
    }

    return (
        <div id="join-bx">
            <form onSubmit={joinRoom}>
                <h2>Join A Server <span role="img" aria-label="rocket">🚀</span></h2>
                <input placeholder="Your Name" type="name" onChange={(e) => setName(e.target.value)} />
                <input placeholder="Room Name" type="room" onChange={(e) => setRoom(e.target.value)} />
                <div>
                    <button type="submit" disabled={!(room.trim().length > 0 && name.trim().length > 0)}>Join</button>
                </div>
            </form>
        </div>
    )
}

export default Join;