import React, { Component, useContext } from 'react';
import { connect } from 'react-redux';
import ThemeContext from '../../contexts/themeContext';
import ChatSocketServer from '../../helpers/ChatSocketServer';
import { chat, cog, contact, friends, group, moon, search, sun, times } from '../../res/icon';
import logoSvg from '../../res/logo.svg';
// import { AuthProfile } from '../user/AuthProfile';
import './chatlist.css';


const ChatListItem = ({ user, isSelected, setSelectedUser, isTyping=false }) => {
    const { theme, state } = useContext(ThemeContext.MyThemeContext);
    return (
        <li
            className={` chatlist--item ${isSelected ? 'active' : ''} ${state}`} 
            onClick={setSelectedUser}>
            <div className={`chat-image ${user.online === 'Y' ? 'online' : '' }`}>
                { user.imageUrl ? <img src={user.imageUrl} alt="profile" /> : <></> }
                { user.online === 'Y' && <div className="online-trk"></div> }
            </div>
            <div className="chat-person">
                <span className={`chat-person--name`} style={{ color: theme.textColor }}>{ user.username }</span>
                { isTyping ? <small className="chat-person--typing">typing</small> : <></> }
            </div>
        </li>
    );
}
class ChatList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // for the chat
            selectedUserId: null,
            chatListUsers: null,
            // typing: {},

            searchTerm: ''
        }
    }

    componentDidMount() {
        ChatSocketServer.getChatList(this.props.userId);
        ChatSocketServer.eventEmitter.on('chat-list-response', this.renderChatList)

        // ChatSocketServer.receiveTypingMessage();
        // ChatSocketServer.eventEmitter.on('typing-message-response', this.addTypingUser)
    }

    componentWillUnmount() {
        ChatSocketServer.eventEmitter.removeListener('chat-list-response', this.renderChatList);
    }

    updateSelectedUser(user) {
        this.setState({ selectedUserId: user._id });
        this.props.updateSelectedUser(user)
    }

    /* addTypingUser = ({ userId }) => {
        if (this.state.typing[userId]) {
            window.clearTimeout(this.state.typing[userId])
        }
        const newTyping = this.state.typing;
        newTyping[userId] = window.setTimeout(() => this.typingTimeout(userId), 3000);
        this.setState({ typing: newTyping })
    } */

    /* typingTimeout(userId) {
        if (this.state.typing[userId]) {
            window.clearTimeout(this.state.typing[userId])
            const newTyping = this.state.typing;
            newTyping[userId] = null;
            this.setState({ typing: newTyping })
        }
    } */

    searchKey = (e) => {
        this.setState({ searchTerm: e.target.value })
    }

    renderChatList = (chatListResponse) => {
        if (chatListResponse.error) {
            console.log("chatlist", chatListResponse.error)
        } else {
            let chatListUsers = this.state.chatListUsers;
            if (chatListResponse.singleUser) {
                if (chatListUsers) { // to prevent error
                    if (chatListUsers.length > 0) {
                        chatListUsers = chatListUsers.filter((user) => user._id !== chatListResponse.chatList._id);
                    }
                    /* Adding new online user into chat list array */
                    chatListUsers = [...[ chatListResponse.chatList ], ...chatListUsers];
                }
            } else if (chatListResponse.userDisconnected) {
                const loggedOutUser = chatListUsers.findIndex((obj) => obj._id === chatListResponse.userId);
                if (loggedOutUser >= 0) {
                    chatListUsers[loggedOutUser].online = 'N';
                }
            } else {
                /* Updating entire chat list if user logs in. */
                chatListUsers = chatListResponse.chatList;
            }
            this.setState({
                chatListUsers: chatListUsers
            });
        }
    }

    _renderNavbarAside = ({ theme, state, toggleTheme }) => (
        <aside className="nav-aside" style={{ background: theme.backgroundColor, color: theme.textColor, fill: theme.textColor }}>
            <div className="nav-links">
                <div className="header">
                    <img src={logoSvg} alt="logo" />
                </div>
                <span>{ contact }</span>
                <span>{ chat }</span>
                <span>{ group }</span>
            </div>
            <div className="nav-sub">
                <span>{ cog }</span>
            </div>
        </aside>
    )

    _renderAuthBox = ({ theme, state, toggleTheme }) => (
        <div className="auth-box" style={{ background: theme.contrastColorFade }}>
            <div className="auth-img"></div>
            <div className="auth-name">Odelola Joshua</div>
        </div>
    )

    render() {
        const { isMobileViewPort, toggleValue } = this.props;
        return (
            <ThemeContext.Consumer>
                {
                    ({ theme, state, toggleTheme }) => (
                    <div ref={this.props.sidebarRef} className={`app-aside ${isMobileViewPort ? `float ${!toggleValue ? 'hide' : ''}` : ''}`}>
                        { this._renderNavbarAside({ theme, state, toggleTheme }) }
                        { this._renderAuthBox({ theme, state, toggleTheme }) }
                        <aside className={`chat-list`} style={{ background: theme.contrastColorFall, color: theme.textColor, boxShadow: `3px 0 5px ${theme.contrastColorFade}` }}>
                            { this.state.chatListUsers ? (
                                <>
                                <div className="aside-top">
                                    { this.state.chatListUsers.length > 0 ? (
                                        <>
                                            <div className="search-pane">
                                                { this.state.searchTerm.trim().length > 0 ? <span className="close-search" onClick={() => this.setState({ searchTerm: '' })}><div>{ times }</div></span> : <span>{ search }</span> }
                                                <input type="text" placeholder="Find a chat here" onChange={this.searchKey} value={this.state.searchTerm} style={{ background: theme.contrastColorFade, color: theme.textColor }} />
                                            </div>
                                            <span onClick={() => toggleTheme()}>
                                                { state === 'night' ? sun : moon }
                                            </span>
                                        </>
                                    ) : <></> }
                                </div>
                                <ul>
                                {
                                    (this.state.chatListUsers.filter((user) => {
                                        return user.username.toLowerCase().includes(this.state.searchTerm.trim().toLowerCase())
                                    })).map((user, index) => (
                                        <ChatListItem 
                                            key={`chat-user${index}`}
                                            isTyping={this.props.typing[user._id]}
                                            isSelected={this.state.selectedUserId === user._id}
                                            user={user}
                                            setSelectedUser={() => this.updateSelectedUser(user)}></ChatListItem>
                                    ))
                                }
                                </ul>
                                <div className="aside-bottom">
                                    {/* <AuthProfile /> */}
                                </div>
                                </>
                                ) : <></>
                            }
                            <div className={`alert 
                                ${this.state.loading ? 'alert-info' : ''} 
                                ${this.state.chatListUsers && this.state.chatListUsers.length > 0 ? 'visibility-hidden' : ''}`
                            }>
                                { this.state.chatListUsers ? this.state.chatListUsers.length === 0 ? 'No User Available to chat.' : 'Error loading your chat! We will keep trying' : 'Loading your chat list.'}
                            </div>
                        </aside>
                    </div>
                    )
                }
            </ThemeContext.Consumer>
        )
    }
}

const mapStateToProps = (state) => {
    const { userId, token } = state.auth;
    return { userId, token }
}

export default connect(mapStateToProps)(ChatList);