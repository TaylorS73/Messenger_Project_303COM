import React from 'react';
import Chatkit from '@pusher/chatkit-client';
import MessageList from "./MessageList";
import SendMessage from "./SendMessage";
import TypingIndicator from "./TypingIndicator";
import './Stylesheet.css';
import OnlineUsers from "./OnlineUsers";

class ChatScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            currentRoom: {},
            currentUser: {},
            allUsersTyping: []
        };
        this.sendMessage = this.sendMessage.bind(this);
        this.userTypingEvent = this.userTypingEvent.bind(this);
    }

    componentDidMount(){
        const chatManager = new Chatkit.ChatManager({
            instanceLocator: 'v1:us1:cda0f940-152b-46e7-b38b-e20c2eb435de',
            userId: this.props.currentUsername,
            tokenProvider: new Chatkit.TokenProvider({
                url: `http://localhost:8080/authenticate`,
                method: 'POST'
            }),
        });

        chatManager
            .connect()
            .then(currentUser => {
                this.setState({ currentUser });
                return currentUser.subscribeToRoom({
                    roomId: "5b14ccda-2395-405a-aa4d-10482fd90ce1",
                    messageLimit: 100,
                    hooks: {
                        onMessage: message => {
                            this.setState({
                                messages: [...this.state.messages, message],
                            })
                        },
                        onUserStartedTyping: user => {
                            this.setState({
                                allUsersTyping: [...this.state.allUsersTyping, user.name]
                            })
                        },
                        onUserStoppedTyping: user => {
                            this.setState({
                                allUsersTyping: this.state.allUsersTyping.filter(
                                    username => username !== user.name
                                ),
                            })
                        },
                        onPresenceChange: () => this.forceUpdate(),
                        onUserJoined: () => this.forceUpdate(),
                    },
                })
            })
            .then(currentRoom => {
                this.setState({currentRoom});
            })
            .catch(error => console.error('error', error))
    }

    sendMessage(text){
        this.state.currentUser.sendMessage({
            roomId: this.state.currentRoom.id,
            text
        })
    }

    userTypingEvent(){
       this.state.currentUser
           .isTypingIn({roomId: this.state.currentRoom.id})
           .catch(error => console.error('error is:', error)
           )}


    render() {
        return (
            <div className="Container">
                <div className="OnlineListStyle">
                    <h2>User's Online</h2>
                    <OnlineUsers currentUser={this.state.currentUser} users={this.state.currentRoom.users}/>
                </div>
                <div className="Container2">
                    <div className="ChatScreenStyle">
                        <MessageList messages={this.state.messages}/>
                    </div>
                <TypingIndicator allUsersTyping={this.state.allUsersTyping} />
                <SendMessage
                    onSubmit={this.sendMessage}
                    onChange={this.userTypingEvent}
                />
                </div>
            </div>
        )
    }
}

export default ChatScreen;