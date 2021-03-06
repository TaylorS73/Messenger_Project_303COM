import React from 'react';

class SendMessage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            text: ''
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(event) {
        this.setState({text: event.target.value});
        if (this.props.onChange) {
            this.props.onChange()
        }
    }

    onSubmit (event){
        event.preventDefault();
        this.props.onSubmit(this.state.text);
        this.setState({text: ''})
    }

    render() {
        return (
            <div className="message-form-container">
                <div className="message-form">
                    <form onSubmit={this.onSubmit}>
                        <input className="message-form-input" type="text" placeholder={"Message #" + this.state.currentRoom} onChange={this.onChange} value={this.state.text}/>
                    </form>
                </div>
                {this.state.text.length > 2 ? <div className="message-form-return">Hit Enter to Send</div> : ""}
            </div>
        )
    }
}

export default SendMessage;