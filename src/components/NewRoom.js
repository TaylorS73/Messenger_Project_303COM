import React from "react";

class NewRoom extends React.Component {

    constructor(props) {
        super(props);

        this.state ={
            roomName: ''
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(event){
        this.setState({
            roomName: event.target.value
        });
    }

    onSubmit(event){
        event.preventDefault();
        this.props.createRoom(this.state.roomName);
        this.setState({roomName: ''})
    }

    render(){
        return(
            <div className="new-room-container">
                <div className="new-room-form">
                    <form onSubmit={this.onSubmit} >
                        <input className="room-form-input" type="text" placeholder="Create New Room" value={this.state.roomName} onChange={this.onChange} />
                    </form>
                </div>

            </div>
        );
    }

}

export default NewRoom;