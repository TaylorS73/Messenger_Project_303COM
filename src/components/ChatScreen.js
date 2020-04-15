import React from 'react';
import Chatkit from '@pusher/chatkit-client';
import MessageList from "./MessageList";
import SendMessage from "./SendMessage";
import TypingIndicator from "./TypingIndicator";
import OnlineUsers from "./OnlineUsers";
import NewRoom from "./NewRoom";
import RoomList from "./RoomList";
import './Stylesheet.css';


class ChatScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            joinableRooms: [],
            joinedRooms: [],
            currentUser: {},
            currentRoom: {},
            allUsersTyping: [],
            patientStatus: ["Patient has Arrived", "Patient is in Surgery", "Patient has Left"]
        };

        this.sendMessage = this.sendMessage.bind(this);
        this.userTypingEvent = this.userTypingEvent.bind(this);
        this.createRoom = this.createRoom.bind(this);
        this.subscribeToRoom = this.subscribeToRoom.bind(this);
        this.buttonMessage = this.buttonMessage.bind(this);
    }

    userTypingEvent() {
        this.state.currentUser
            .isTypingIn({roomId: this.state.currentRoom.id})
            .catch(error => console.error('error is:', error)
            )}

    sendMessage(text) {
        this.state.currentUser.sendMessage({
            text,
            roomId: this.state.currentRoom.id
        })
    }

    componentDidMount() {
        const chatManager = new Chatkit.ChatManager({
            instanceLocator: 'v1:us1:cda0f940-152b-46e7-b38b-e20c2eb435de',
            userId: this.props.currentUsername,
            tokenProvider: new Chatkit.TokenProvider({
                url: `http://localhost:8080/authenticate`,
                method: 'POST'
            })
        });

        chatManager.connect()
            .then(currentUser => {
            this.setState({ currentUser });
            this.getRooms();
                return currentUser.subscribeToRoom({
                    roomId: "c1d18c50-bb59-41aa-a7e9-706f7b158b2a",
                    messageLimit: 100,
                    hooks: {
                        onMessage: message => {
                            this.setState({
                                messages: [...this.state.messages, message]
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
                                )
                            })
                        },
                        onPresenceChanged: () => this.forceUpdate(),
                        onUserJoined: () => this.forceUpdate(),
                    }
                })
            })
            .then(currentRoom => {
                this.setState({currentRoom})
            })
            .catch(error => console.error('error', error))
    }

    getRooms() {
        this.state.currentUser.getJoinableRooms()
            .then(joinableRooms => {
                this.setState({
                    joinableRooms,
                    joinedRooms: this.state.currentUser.rooms
                })
            })
            .catch(err => console.log('error on joining rooms: ', err))
    }

    subscribeToRoom(roomId) {
        this.setState({messages: []});
        this.state.currentUser.subscribeToRoom({
            roomId: roomId,
            hooks: {
                onMessage: message => {
                    this.setState({
                        messages: [...this.state.messages, message]
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
                        )
                    })
                },
                onPresenceChanged: () => this.forceUpdate(),
                onUserJoined: () => this.forceUpdate(),
            },
        })
            .then(currentRoom => {
                this.setState({currentRoom});
            })
            .catch(err => console.log('error on subscribing to rooms:', err))

    }

    buttonMessage() {
        this.state.currentUser.sendSimpleMessage({
            roomId: this.state.currentRoom.id,
            text: this.state.patientStatus[0]
        })
            .catch(err => {
                console.log(`error adding message to ${this.state.currentRoom.name}: ${err}`)
            })
    }

    createRoom(name) {
        if (name == null) {
            console.log('error')
        } else {
            this.state.currentUser.createRoom({
                name
            })
                .then(room => {
                    this.subscribeToRoom(room.id);
                    console.log(`Created room: ${room.name}`)
                })
                .catch(error => console.error('error is:', error))
        }
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
                    <form>
                        <input type="button" placeholder="Patient has arrived." value="Patient has arrived." onClick={this.buttonMessage}/>
                        <input type="button" placeholder="Patient is in surgery." value="Patient is in surgery."/>
                        <input type="button" placeholder="Patient has left." value="Patient has left."/>
                    </form>
                </div>
                <div>
                    <NewRoom createRoom={this.createRoom}/>
                </div>
            </div>
        )
    }
}

export default ChatScreen;