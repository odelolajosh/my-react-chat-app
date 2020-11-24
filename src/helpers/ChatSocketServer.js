import io from 'socket.io-client'
const events = require('events');

class ChatSocketServer {
    socket = null;
    eventEmitter = new events.EventEmitter();

    // connecting to Socket server
    createSocketConnection(userId) {
        // io.connect('http://localhost:4001', { query: `userId=${userId}` })
        try {
            this.socket = io.connect(' https://my-chat-app-server-0707.herokuapp.com', { query: `userId=${userId}` })
        } catch(error) {
            throw new Error('Something went wrong. We can\'t connect to server')
        }
        return true;
    }

    getChatList(userId) {
        this.socket.emit('chat-list', { userId }, ({ error, message }) => {
            if (error) {
                this.eventEmitter.emit('chat-list-response', { error, message });
            }
        });
        this.socket.on('chat-list-response', (data) => {
            this.eventEmitter.emit('chat-list-response', data);
        })
    }

    sendMessage(message) {
        this.socket.emit('add-message', message)
    }

    receiveMessage() {
        this.socket.on('add-message-response', (data) => {
            this.eventEmitter.emit('add-message-response', data);
        })
    }

    typingMessage(toUserId) {
        this.socket.emit('typing-message', { toUserId }, ({ error, message }) => {
            console.log("error", message);
        });
    }

    receiveTypingMessage() {
        this.socket.on('typing-message-response', (data) => {
            this.eventEmitter.emit('typing-message-response', data);
        })
    }
}

export default new ChatSocketServer();