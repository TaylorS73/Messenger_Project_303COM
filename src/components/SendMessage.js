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
        this.setState({
                text: event.target.value
        });
        this.props.onChange()
    }

    onSubmit (event){
        event.preventDefault();
        this.props.onSubmit(this.state.text);
        this.setState({text: ''})
    }

    render() {
        return (
            <div className="MessageContainer">
                <form className="MessageForm" onSubmit={this.onSubmit}>
                    <input className="MessageInput" type="text" placeholder="Type here and press Enter" onChange={this.onChange} value={this.state.text}/>
                </form>
            </div>
        )
    }
}

export default SendMessage;