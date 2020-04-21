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
            scrolled: false,
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
        });
        this.setState({
            scrolled: false
        })
    }
    componentDidMount() {
        const chatManager = new Chatkit.ChatManager({
            instanceLocator: 'v1:us1:cda0f940-152b-46e7-b38b-e20c2eb435de',
            userId: this.props.currentUsername,
            tokenProvider: new Chatkit.TokenProvider({
                url: process.env.URI || '/authenticate',
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
        this.setState({scrolled: false});
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
                    this.getRooms();
                    console.log(`Created room: ${room.name}`)
                })
                .catch(error => console.error('error is:', error))
        }
    }

    onScroll = () => {
        this.setState({
            scrolled: true
        })
    };

    render() {
        return (
            <div className="container">
                <div className="chatContainer">
                    <div className="whosOnlineListContainer">
                        <OnlineUsers currentRoom={this.state.currentRoom} currentUser={this.state.currentUser} users={this.state.currentRoom.users}/>
                        <RoomList subscribeToRoom={this.subscribeToRoom} rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]}/>
                        <NewRoom createRoom={this.createRoom}/>
                    </div>
                    <div className="chatListContainer">
                        <div className="button-container">
                            <form>
                                <input type="button" className="chat-list-form" onClick={this.buttonMessage} value="Patient has arrived."/>
                            </form>

                            <button className="chat-list-button">Patient is in surgery.</button>
                            <button className="chat-list-button">Patient has left.</button>
                        </div>
                        <MessageList messages={this.state.messages} scrolled={this.state.scrolled} onScroll={this.onScroll} currentUser={this.state.currentUser}/>
                        <TypingIndicator allUsersTyping={this.state.allUsersTyping}/>
                        <SendMessage onSubmit={this.sendMessage} onChange={this.userTypingEvent} currentRoom={this.state.currentRoom}/>

                    </div>
                </div>

                {/*<div>*/}
                {/*    <NewRoom createRoom={this.createRoom}/>*/}
                {/*</div>*/}
            </div>
        )
    }
}

export default ChatScreen;