import React from "react";


class MessageList extends React.Component {

    render() {
        return (
            <div className="MessageListContainer">
            <ul className="MessageListulElement">
            {this.props.messages.map((message, index) => (
                <li className="MessageListliElement" key={index}>
                    <div>
                        <span className="MessageListSenderUsername">{message.senderId}</span>
                        <p className="MessageListMessage">{message.text}</p>
                    </div>
                </li>
            ))}
            </ul>
            </div>
        )
    }
}

export default MessageList;