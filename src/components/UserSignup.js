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
            <div className="login">
                <div className="login-triangle">
            </div>
                <h1 className="login-header">Welcome</h1>
                <form className="login-container" onSubmit={this.onSubmit}>
                    <input type="text" placeholder="Username" onChange={this.onChange} required="required"/>
                    <input type="password" placeholder="Password"/>
                    <input type="submit"/>
                </form>
            </div>
        )
    }
}

export default UserSignup;