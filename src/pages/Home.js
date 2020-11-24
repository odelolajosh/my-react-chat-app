import React from 'react';
import ChatList from '../components/chatlist/ChatList';
import noUserSelected from '../res/choiceSelect.svg';
import '../styles/home.css';
import ChatRoom from './chat/ChatRoom';
import ChatSocketServer from '../helpers/ChatSocketServer';
import { connect } from 'react-redux';
import { bars } from '../res/icon';
import logo from '../res/logo.svg';
import ErrorFullPage from '../components/error';
import SpinnerFullPage from '../components/spinner';
import ChatHttpServer from '../helpers/ChatHttpServer';
import AuthHelper from '../helpers/AuthHelper';


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.sidebarElem = React.createRef();
        this.state = {
            isMobileViewPort: false,
            toggleValue: false,
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

        this.createSocketConnection();
    }

    componentWillUnmount() {
        window.removeEventListener('DOMContentLoaded', this.handleViewPortResize);
        window.removeEventListener('resize', this.handleViewPortResize);
        window.removeEventListener('click', this.handleCloseSidebar)
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
                this.setState({ isLoading: false })

                ChatSocketServer.receiveTypingMessage();
                ChatSocketServer.eventEmitter.on('typing-message-response', this.addTypingUser)
            } catch(err) {
                this.setState({ isLoading: false, error: err.message })
            }
        }
    }

    handleViewPortResize = () => {
        if (window.innerWidth > 1200) {
            this.setState({ isMobileViewPort: false })
            window.removeEventListener('click', this.handleCloseSidebar)
        } else {
            this.setState({ isMobileViewPort: true, toggleValue: true })
            window.addEventListener('click', this.handleCloseSidebar)
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
                onAction: () => this.props.error ? (
                        this.props.checkUserToken(userId, token)
                    ) : ( this.createSocketConnection() )
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
            <main className="home-page">
                <ChatList sidebarRef={this.sidebarElem} typing={this.state.typing} updateSelectedUser={this.updateSelectedUser} { ...responsiveKit }></ChatList>
                <div className="chat-pane">
                    <div className="top-bar">
                        { responsiveKit.isMobileViewPort ? <span className="toggle-bar" onClick={responsiveKit.switchToggle}>{ bars }</span> : <></> }
                        <div>
                            <span>{ this.state.selectedUser ? this.state.selectedUser.username : <span className="logo-kit"><img src={logo} alt="logo" /><span>YouChat</span></span> }</span>
                        </div>
                    </div>
                    {
                        this.state.selectedUser ? (
                            <ChatRoom selectedUser={this.state.selectedUser} typing={this.state.typing} { ...responsiveKit } ></ChatRoom>
                        ) : (
                            this.renderNoUserSelectedUI()
                        )
                    }
                </div>
            </main>
        )
    }
}

export default connect(
    ({ auth }) => ({ userId: auth.userId, token: auth.token, error: auth.error, isLoading: auth.isLoading }),
    (dispatch) => ({ checkUserToken: (userId, token) => dispatch(ChatHttpServer.checkToken(userId, token)) })
)(Home);