import React, { Component } from 'react';
import UserSignup from './components/UserSignup';

class App extends Component {
    render() {
        return <UserSignup onSubmit={username => alert(username)}/>
    }
}

export default App