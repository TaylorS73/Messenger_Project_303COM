import React from 'react';

class UserSignup extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: null
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(event) {
        this.setState({
            username: event.target.value
            }
        )
    }

    onSubmit (event){
        event.preventDefault();
        this.props.onSubmit(this.state.username)
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <input type="text" placeholder="What is your Username?" onChange={this.onChange}/>
                    <input type="submit"/>
                </form>
            </div>

        )
    }
}

export default UserSignup;