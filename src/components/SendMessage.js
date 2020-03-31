import React from 'react';

class SendMessage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            text: null
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
        this.props.onSubmit(this.state.text)
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <input type="text" placeholder="What is your Text?" onChange={this.onChange}/>
                    <input type="submit"/>
                </form>
            </div>
        )
    }
}

export default SendMessage;