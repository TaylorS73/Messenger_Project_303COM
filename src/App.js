import React, { Component } from 'react';
import UserSignup from './components/UserSignup';
import ChatScreen from './components/ChatScreen';

class App extends Component {
    constructor(props) {
        super(props);
        this.onUserSubmitted = this.onUserSubmitted.bind(this);
        this.state =  {
            currentScreen: 'UsernameScreen',
            currentUsername: ''
        }
    }

    onUserSubmitted (username) {
        (async () => {
            try {
                const res = await fetch(process.env.URI || `http://localhost:8080/users`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({username})

                });
                if (res.status !== 204){
                    this.setState({
                        currentUsername: username,
                        currentScreen: 'ChatScreen'
                    });
                    sessionStorage.setItem('username', username);
                }
            } catch (err) {
                console.error(err);
            }
        })();
    }

    render() {
        if (this.state.currentScreen === 'UsernameScreen'){
            return(
            <div>
                <UserSignup onSubmit={this.onUserSubmitted}/>
            </div>
            )
        } else if (this.state.currentScreen === 'ChatScreen'){
            return <ChatScreen currentUsername={this.state.currentUsername} path='/dashboard'/>
        }

    }
}

export default App