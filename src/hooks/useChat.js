import { useState, useEffect } from "react";

const useChat = (userId) => {
    //
    const [ messages, setMessage ] = useState([]) // sent and received messages

    useEffect(() => {
        // creates a WebSocket connection

        // Listen for incomming messages
        
        // Destroy the socket connection when closed
        
    }, [ userId ]);

    // Sends a message to the server that 
    // forwards it to all users in the same room
    const sendMessage = (messageBody) => {
        setMessage([])
    }

    return [ messages, sendMessage ]
}

export default useChat;