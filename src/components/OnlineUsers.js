import React from "react";
import './Stylesheet.css';

class OnlineUsers extends React.Component {
    renderUsers() {
        return(
            <div>
                <h3 className="whos-online-header">Current Room</h3>
                <h5 className="whos-online-room">#{this.props.currentRoom.name}</h5>
                <br />
                <h3 className="whos-online-members">{this.props.users.length === 1 ? this.props.users.length + " Member" : this.props.users.length + " Members"}</h3>
            <ul className="whos-online-list">
                {this.props.users.map((user, index) => {
                    if (user.id === this.props.currentUser.id){
                        return (
                            <WhoisOnlineItem key={index} presenceState="online"> {user.name} (You)</WhoisOnlineItem>
                        )
                    }
                    return (
                        <WhoisOnlineItem key={index} presenceState={user.presence.state}>
                            {user.name}
                        </WhoisOnlineItem>
                    )
                })}
            </ul>
            </div>
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
                <div className="OnlineUsersDivElement" style={{backgroundColor: this.props.presenceState === 'online' ? '#43ff4b' : '#434956'}}/>
                {this.props.children}
            </li>
        )
    }
}
export default OnlineUsers;