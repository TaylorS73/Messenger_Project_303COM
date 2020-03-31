import React from "react";

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
        const styles = {
            li: {
                display: 'flex',
                alignItems: 'center',
                marginTop: 5,
                marginBottom: 5,
                paddingTop: 2,
                paddingBottom: 2,
            },
            div: {
                borderRadius: '50%',
                width: 11,
                height: 11,
                marginRight: 10,
            },
        };
        return (
            <li style ={styles.li}>
                <div style={{
                    ...styles.div,
                    backgroundColor: this.props.presenceState === 'online' ? '#539eff' : '#414756'
                }}
                />
                {this.props.children}
            </li>
        )
    }
}
export default OnlineUsers;