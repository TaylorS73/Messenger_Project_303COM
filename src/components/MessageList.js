import React from "react";

class MessageList extends React.Component {

    componentDidUpdate() {
        setInterval(this.updateScroll,1000);
    }

    updateScroll = () => {
        let element = document.querySelector('.message-list-container');
        if (this.props.scrolled === false) {
            element.scrollTop = element.scrollHeight;
        }
    };

    render () {
        return(
            <div className="message-list-container" onScroll={() => this.props.onScroll()}>
                {this.props.messages.map((message, index) => {
                        return <div key={index}>
                            <div className="message-item">
                                <span>{this.props.currentUser.id === message.senderId ? <strong><font className="special-text">{message.senderId}</font></strong> : <strong>{message.senderId}</strong>}</span>
                                <br/>
                                <p className="message-list-text">{message.text}</p>
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