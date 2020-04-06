import React from 'react';
import Chatkit from '@pusher/chatkit-client';
import MessageList from "./MessageList";
import SendMessage from "./SendMessage";
import TypingIndicator from "./TypingIndicator";
import './Stylesheet.css';
import OnlineUsers from "./OnlineUsers";
import NewRoom from "./NewRoom";
import RoomList from "./RoomList";

class ChatScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomId: null,
            messages: [],
            joinableRooms: [],
            joinedRooms: [],
            currentRoom: {},
            currentUser: {},
            allUsersTyping: []
        };
        this.sendMessage = this.sendMessage.bind(this);
        this.userTypingEvent = this.userTypingEvent.bind(this);
        this.createRoom = this.createRoom.bind(this);
        this.getRooms = this.getRooms.bind(this);
        this.subscribeToRoom = this.subscribeToRoom.bind(this);
    }

    componentDidMount() {
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
                this.currentUser = currentUser;
                this.getRooms();

                return currentUser.subscribeToRoom({
                                    roomId: "06454fe3-1cf8-4e09-8f7c-ce69ec00e3dc",
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
            .catch(error => console.error('error', error));
    }

    getRooms(){
        this.currentUser.getJoinableRooms()
            .then(joinableRooms =>{
                this.setState({
                    joinableRooms,
                    joinedRooms: this.currentUser.rooms
                })
            })
            .catch(err => console.log('error on joining rooms: ', err))
    }

    subscribeToRoom(roomID) {
        this.setState({ messages: [] });
        this.currentUser.subscribeToRoom({
            roomId: roomID,
            messageLimit: 100,
            hooks: {
                onNewMessage: message => {
                    this.setState({
                        messages: [...this.state.messages, message]
                    })
                }
            }
        })
            .then(room =>{
                this.setState({
                    roomId: room.id
                });
                this.getRooms()
            })
            .catch(err => console.log('error on subscribing to rooms:', err))

    }

    sendMessage(text) {
        this.currentUser.sendMessage({
            text,
            roomId: this.state.currentRoom.id
        })
    }

    userTypingEvent() {
        this.currentUser
            .isTypingIn({roomId: this.state.currentRoom.id})
            .catch(error => console.error('error is:', error)
            )
    }

    createRoom(name){
        this.currentUser.createRoom({
            name
        })
            .then(room => {
                console.log(`Created room: ${room.name}`)
            })
            .catch(error => console.error('error is:', error))
    }

    render() {
        return (
            <div className="Container">
                <div className="OnlineListStyle">
                    <h2>User's Online</h2>
                    <OnlineUsers currentUser={this.state.currentUser} users={this.state.currentRoom.users}/>
                    <RoomList
                        subscribeToRoom={this.subscribeToRoom}
                        rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]}/>
                </div>
                <div className="Container2">
                    <h3>{this.state.currentRoom.name}</h3>
                    <div className="ChatScreenStyle">
                        <MessageList messages={this.state.messages}/>
                    </div>
                <TypingIndicator allUsersTyping={this.state.allUsersTyping}/>
                <SendMessage
                    onSubmit={this.sendMessage}
                    onChange={this.userTypingEvent}
                />
                </div>
                <NewRoom createRoom={this.createRoom}/>
            </div>
        )
    }
}

export default ChatScreen;