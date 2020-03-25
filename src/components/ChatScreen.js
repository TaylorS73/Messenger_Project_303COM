import React from 'react';
import Chatkit from '@pusher/chatkit-client';

class ChatScreen extends React.Component{

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
                this.setState({currentUser});
            })
            .catch(error => console.error('error', error))
    }

    render() {
        return (
            <div>
                <h1>CHAT SCREEN</h1>
            </div>
        )
    }
}

export default ChatScreen;