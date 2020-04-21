import React from "react";
import ReactDOM from 'react-dom';

class MessageList extends React.Component {

    componentWillUpdate(nextProps, nextState) {
        const node = ReactDOM.findDOMNode(this);
        this.shouldScrollToBottom = node.scrollTop + node.clientHeight + 100 >= node.scrollHeight
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.shouldScrollToBottom) {
            const node = ReactDOM.findDOMNode(this);
            node.scrollTop = node.scrollHeight
        }
    }

    render () {
        return(
            <div className="message-list-container">
                {this.props.messages.map((message, index) => {
                        return <div key={index}>
                            <div className="message-item">
                                <span>{this.props.currentUser.id === message.senderId ? <strong className="special-text">{message.senderId}</strong> : <strong>{message.senderId}</strong>}</span>
                                <br/>
                                <ul className="message-list-text">{message.text}</ul>
                            </div>
                            <br/>
                        </div>
                    }
                )}
            </div>
        )
    }
}

export default MessageList;