import React, { useContext } from 'react';
import { emoji, plane } from '../../res/icon';
import "./chatroom.css";
import { connect } from 'react-redux';
import ChatHttpServer from '../../helpers/ChatHttpServer';
import ChatSocketServer from '../../helpers/ChatSocketServer';
import noUserSelected from '../../res/select_a_user.svg';
import startConversation from '../../res/startConversation.svg';
import SpinnerFullPage from '../../components/spinner';
import ReactEmoji from 'react-emoji';
import ScrollContainer from '../../components/scroll-comp/ScrollContainer';
import { datesAreOnSameDay } from '../../helpers/dateHelper';

import soundFile from '../../res/sound/doneforyou.mp3';
import SoundHelper from '../../helpers/SoundHelper';
import ThemeContext from '../../contexts/themeContext';

class ChatRoom extends React.Component {
    constructor(props) {
        super(props);
        this.messagesBox = null;
        this.messageContentBox = null;
        this.notifySound = new SoundHelper({ asset: soundFile })
        this.state = {
            messageLoading: false,
            messages: [],
            selectedUser: null,
            //
            page: null,
            limit: 10,
            totalPages: null,
            //
            messageInput: ""
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.selectedUser === null || prevState.selectedUser._id !== nextProps.selectedUser._id) {
            return {
                selectedUser: nextProps.selectedUser,
                page: null,
                messages: []
            };
        }
        return null;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectedUser === null || (this.props.selectedUser._id !== prevProps.selectedUser._id)) {
            this.getMessages();
        }
    }

    componentDidMount() {
        ChatSocketServer.receiveMessage();
        ChatSocketServer.eventEmitter.on('add-message-response', this.receiveSocketMessages);
    }

    componentWillUnmount() {
        ChatSocketServer.eventEmitter.removeListener('add-message-response', this.receiveSocketMessages);
    }

    receiveSocketMessages = (socketResponse) => {
        const { selectedUser } = this.state;
        if (selectedUser !== null && selectedUser._id === socketResponse.fromUserId) {
            this.setState({ messages: [ ...this.state.messages, socketResponse ] });
            this.scrollMessageContainer();
            this.notifySound.play()
        }
    }

    getMessages = async () => {
        try {
            // this.setState({ messageLoading: true })
            const { userId, selectedUser, token} = this.props;
            const result = await ChatHttpServer.getMessages(userId, selectedUser._id, { page: this.state.page, limit: this.state.limit }, token);
            if (!result.error) {
                this.setState({ 
                    messages: result.messages,
                    page: result.currentPage,
                    totalPages: result.totalPages
                });
                this.scrollMessageContainer();
            } else {
                alert("Unable to fetch messages")
            }
        } catch (err) {
            console.log("an error occurred!!! \n", err)
        } finally {
            // this.setState({ messageLoading: false });
        }
    }

    handleKeyPress = (e) => {
        const { selectedUser } = this.props;
        if (e.key === 'Enter') {
            this.sendMessage();
        } else {
            ChatSocketServer.typingMessage(selectedUser._id);
        }
    }

    sendMessage = () => {
        const { userId, selectedUser } = this.props;
        const message = this.state.messageInput;
        if (message === '' || message === undefined || message === null) {
            alert("message can't be empty")
        } else if (userId === '') {
            
        } else if (!selectedUser || selectedUser === undefined) {

        } else {
            this.sendAndUpdateMessages({
                fromUserId: userId,
                text: (message).trim(),
                toUserId: selectedUser._id,
            });
            this.setState({ messageInput: "" })
        }
    }

    sendAndUpdateMessages(message) {
        try {
            ChatSocketServer.sendMessage(message);
            this.setState({
                messages : [...this.state.messages, message]
            });
            this.scrollMessageContainer();
        } catch (error) {
            console.error("error")
            alert(`Can't send your message`);
        }
    }

    scrollMessageContainer() {
        if (this.messagesBox !== null) {
          try {
            setTimeout(() => {
                this.messagesBox.scrollTo(0, this.messageContentBox.scrollHeight);
            }, 100);
          } catch (error) {
            console.warn(error);
          }
        }
    }

    onScrollBoxMount = (scrollBox, contextBox) => {
        this.messagesBox = scrollBox;
        this.messageContentBox = contextBox;
        this.scrollMessageContainer();
    }

    handleScrollPageRequest = async () => {
        if (parseInt(this.state.page) > 1) {
            try {
                const { userId, selectedUser, token} = this.props;
                const result = await ChatHttpServer.getMessages(userId, selectedUser._id, { page: this.state.page - 1, limit: this.state.limit }, token);
                if (!result.error) {
                    this.setState({ 
                        messages: [...result.messages, ...this.state.messages],
                        page: result.currentPage,
                        totalPages: result.totalPages
                    });
                    // this.scrollMessageContainer();
                } else {
                    alert("Unable to fetch messages")
                }
            } catch (err) {
                console.error(err)
            }
        }
    }

    handleScrollPageResult = (data) => {
        console.log(data);
    }

    renderMessages = () => {
        if (this.state.messages.length === 0) return [];
        let dayInConcern = new Date(this.state.messages[0].date);
        const messageUI = this.state.messages.map((message, index) => {
            const day = new Date(message.date);
            const isNewDay = !datesAreOnSameDay(day, dayInConcern) && (day.getTime() > dayInConcern.getTime());
            if (isNewDay) dayInConcern = day;
            return (
                <React.Fragment key={`chat-msg-${index}`}>
                    { 
                        isNewDay ? (
                            <div className="chat-date-bk">
                                <div></div>
                                <span>{ dayInConcern.toDateString() }</span>
                                <div></div>
                            </div>
                        ) : <></> 
                    }
                    <ChatBox key={`chat-bx-${index}`} isAuth={message.fromUserId === this.props.userId} message={message} />
                </ React.Fragment>
            )
        })
        return messageUI;
    }

    renderChatUI = () => {
        return (
            <ThemeContext.Consumer>
                {
                    ({ theme }) => (
                        <main className="chat-room" role="main">
                            { this.state.page === 0 ? this.renderStartChatUI() : <></> }
                            <ScrollContainer 
                                scrollBoxRef={this.messagesBox}
                                onScrollPageRequest={this.handleScrollPageRequest}
                                onScrollPageResponse={this.handleScrollPageResult}
                                onScrollBoxMount={this.onScrollBoxMount} 
                                className="chat-bx" 
                                contentClassName="content-bx">
                                <>
                                {
                                    parseInt(this.state.page) <= 1 || this.state.page === null ? (
                                        this.renderStartChatUI()
                                    ) : <></>
                                }
                                {
                                    this.renderMessages()
                                }
                                </>
                            </ScrollContainer>
                            <div className="bottom-bar" style={{ width: this.messagesBox ? this.messagesBox.getBoundingClientRect().width : "100%" }}>
                                <span>{ emoji }</span>
                                <input 
                                    placeholder={`Send a message`} 
                                    value={this.state.messageInput} 
                                    onChange={(e) => this.setState({ messageInput: e.target.value })} 
                                    onKeyPress={this.handleKeyPress} 
                                    style={{ background: theme.contrastColorFall, color: theme.textColor }} />
                                <span onClick={this.sendMessage}>{ plane }</span>
                            </div>
                        </main>
                    )
                }
            </ThemeContext.Consumer>
        )
    }

    renderNoUserSelectedUI = () => {
        return (
            <div className="no-chat-select-bx">
                <img src={ noUserSelected } alt="No Selected User" />
                <h4>Select A Chat</h4>
            </div>
        )
    }

    renderStartChatUI = () => {
        return (
            <div className="chat-start-bx">
                <img src={ startConversation } alt="Start Conversation" />
            </div>
        )
    }

    render() {
        const { selectedUser } = this.state;
        if (selectedUser) {
            if (this.state.messageLoading) {
                return <SpinnerFullPage />
            }
            return this.renderChatUI();
        } else {
            return this.renderNoUserSelectedUI();
        }
    }
}

const ChatBox = ({ message, isAuth }) => {
    const { state } = useContext(ThemeContext.MyThemeContext);
    return (
        <div className={`chat-row ${message.username === "admin" ? "admin" : isAuth ? "auth" : ""} ${state}`}>
            { 
                message.username !== "admin" && !isAuth ? <div className="chat-auth">{ message.username }</div> : ""
            }
            <div className="chat-item">
                { ReactEmoji.emojify(message.text) }
            </div>
        </div>
    )
}

export default connect(
    (state) => ({ userId: state.auth.userId, token: state.auth.token })
)(ChatRoom);