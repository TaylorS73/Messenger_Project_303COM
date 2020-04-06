import React from "react";
import './Stylesheet.css';

class OnlineUsers extends React.Component {
    renderUsers() {
        return(
            <ul>
                {this.props.users.map((user, index) => {
                    if (user.id === this.props.currentUser.id){
                        return (
                            <WhoisOnlineItem key={index} presenceState="online">
                                {user.name} (YOU)
                            </WhoisOnlineItem>
                        )
                    }
                    return (
                        <WhoisOnlineItem key={index} presenceState={user.presence.state}>
                            {user.name}
                        </WhoisOnlineItem>
                    )
                })}
            </ul>
        )
    }

    render() {
        if(this.props.users){
            return this.renderUsers()
        } else {
            return <p>Loading Users...</p>
        }
    }
}

class WhoisOnlineItem extends React.Component {
    render() {
        return (
            <li className="OnlineUsersListElement">
                <div className="OnlineUsersDivElement" style={{backgroundColor: this.props.presenceState === 'online' ? '#09ff00' : '#434956'}}/>
                {this.props.children}
            </li>
        )
    }
}
export default OnlineUsers;