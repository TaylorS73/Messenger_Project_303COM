import React from "react";

class TypingIndicator extends  React.Component{
    render() {
        if (this.props.allUsersTyping.length > 0) {
            return (
                <div>
                    {`${this.props.allUsersTyping.slice(0, 2).join(" and ")} is typing...`}
                </div>
            )
        }
        return <div/>
    }
}

export default TypingIndicator;