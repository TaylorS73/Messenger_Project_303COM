import React from "react";

class TypingIndicator extends  React.Component{
    render(){
        if (this.props.allUsersTyping.length === 0) {
            return <div/>
        }else if(this.props.allUsersTyping.length === 1){
            return <p>{this.props.allUsersTyping[0]} is typing...</p>
        }else if(this.props.allUsersTyping.length > 1) {
            return <p>{this.props.allUsersTyping.join(' and ')} are typing...</p>
        }
    }
}

export default TypingIndicator;