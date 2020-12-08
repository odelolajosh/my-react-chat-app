import React from 'react';
import ChatList from '../../components/chatlist/ChatList';
import noUserSelected from '../../res/select_a_user.svg';
import './home.css';
import ChatRoom from '../chat/ChatRoom';
import ChatSocketServer from '../../helpers/ChatSocketServer';
import { connect } from 'react-redux';
import { leftCaret, noWifi } from '../../res/icon';
import ErrorFullPage from '../../components/error';
import SpinnerFullPage from '../../components/spinner';
import ChatHttpServer from '../../helpers/ChatHttpServer';
import AuthHelper from '../../helpers/AuthHelper';
import ThemeContext from '../../contexts/themeContext';


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.sidebarElem = React.createRef();
        this.state = {
            isMobileViewPort: false,
            toggleValue: false,
            windowWidth: 0,
            theme: null,
            // chat
            isLoading: true,
            selectedUser: null,
            error: null,
            // typing
            typing: {}
        }
    }
    componentDidMount() {
        // responsiveness
        this.handleViewPortResize();
        window.addEventListener('DOMContentLoaded onLoad', this.handleViewPortResize);
        window.addEventListener('resize', this.handleViewPortResize);
        this.setState({ toggleValue: true })

        this.createSocketConnection();
    }

    componentWillUnmount() {
        this.handleViewPortResize();
        window.removeEventListener('DOMContentLoaded', this.handleViewPortResize);
        window.removeEventListener('resize', this.handleViewPortResize);
        window.removeEventListener('click', this.handleCloseSidebar);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userId === null || prevProps.userId !== this.props.userId) {
            this.createSocketConnection();
        }
    }

    createSocketConnection = () => {
        const { userId } = this.props;
        if (userId) {
            try {
                ChatSocketServer.createSocketConnection(userId);

                ChatSocketServer.receiveTypingMessage();
                ChatSocketServer.eventEmitter.on('typing-message-response', this.addTypingUser)
            } catch(err) {
                this.setState({ error: err.message })
            } finally {
                this.setState({ isLoading: false })
            }
        }
    }

    handleViewPortResize = () => {
        const width = window.innerWidth;
        if (this.state.windowWidth !== width) {
            if (width > 1200) {
                this.setState({ isMobileViewPort: false })
                window.removeEventListener('click', this.handleCloseSidebar)
            } else {
                this.setState({ isMobileViewPort: true, toggleValue: false })
                // window.addEventListener('click', this.handleCloseSidebar)
            }
            this.setState({ windowWidth: width })
        }
    }

    switchToggleValue = () => {
        const newValue = !this.state.toggleValue;
        this.setState({ toggleValue: newValue });
        if (newValue) {
            window.setTimeout(
                () => window.addEventListener('click', this.handleCloseSidebar),
                500
            )
        } else {
            window.removeEventListener('click', this.handleCloseSidebar)
        }
    }

    handleCloseSidebar = (e) => {
        if (this.sidebarElem && this.sidebarElem.current) {
            if (!this.sidebarElem.current.contains(e.target) && this.state.toggleValue) {
                this.switchToggleValue();
            }
            window.removeEventListener('click', this.handleCloseSidebar)
        }
    }

    updateSelectedUser = (user) => {
        this.setState({ selectedUser: user });
        this.switchToggleValue();
    }

    addTypingUser = ({ userId }) => {
        if (this.state.typing[userId]) {
            window.clearTimeout(this.state.typing[userId])
        }
        const newTyping = this.state.typing;
        newTyping[userId] = window.setTimeout(() => this.typingTimeout(userId), 3000);
        this.setState({ typing: newTyping })
    }

    typingTimeout(userId) {
        if (this.state.typing[userId]) {
            window.clearTimeout(this.state.typing[userId])
            const newTyping = this.state.typing;
            newTyping[userId] = null;
            this.setState({ typing: newTyping })
        }
    }

    renderNoUserSelectedUI = () => {
        return (
            <div className="no-chat-select-bx">
                <img src={ noUserSelected } alt="" />
                <h4>Select a Chat</h4>
            </div>
        )
    }

    render() {
        if (this.props.error || this.state.error) {
            const { userId, token } = AuthHelper.getAuthValue();
            const errorAction = {
                onAction: () => this.props.error || this.state.error ? (
                        this.props.checkUserToken(userId, token)
                    ) : ( this.createSocketConnection() ),
                templateImage: noWifi
            }
            return <ErrorFullPage err={this.props.error} { ...errorAction }  />
        }
        if (this.state.isLoading || this.props.isLoading) {
            return <div style={{ height: "100vh" }}><SpinnerFullPage></SpinnerFullPage></div>
        }
        const responsiveKit = {
            isMobileViewPort: this.state.isMobileViewPort,
            toggleValue: this.state.toggleValue,
            switchToggle: this.switchToggleValue
        }
        return (
            <ThemeContext.Consumer>
                {
                    ({ theme }) => (
                        <main className="home-page">
                            <ChatList sidebarRef={this.sidebarElem} typing={this.state.typing} updateSelectedUser={this.updateSelectedUser} { ...responsiveKit }></ChatList>
                            <div className="chat-pane">
                                <div className="top-bar" style={{ background: theme.backgroundColor, color: theme.textColor, fill: theme.textColor, boxShadow: `0 3px 5px ${theme.contrastColorFade}` }}>
                                    { responsiveKit.isMobileViewPort ? <span className="toggle-bar" onClick={responsiveKit.switchToggle}>{ leftCaret }</span> : <></> }
                                    <div>
                                        <span>{ this.state.selectedUser ? this.state.selectedUser.username : "" }</span>
                                    </div>
                                </div>
                                <ChatRoom selectedUser={this.state.selectedUser} typing={this.state.typing} { ...responsiveKit } ></ChatRoom>
                            </div>
                        </main>
                    )
                }
            </ThemeContext.Consumer>
        )
    }
}

export default connect(
    ({ auth }) => ({ userId: auth.userId, token: auth.token, error: auth.error, isLoading: auth.isLoading }),
    (dispatch) => ({ checkUserToken: (userId, token) => dispatch(ChatHttpServer.checkToken(userId, token)) })
)(Home);