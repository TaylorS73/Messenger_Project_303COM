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
            <div>
                <form onSubmit={this.onSubmit} >
                    <input value={this.state.roomName} onChange={this.onChange} type="text" placeholder="Enter New Room"/>
                        <input type='submit'/>
                </form>
            </div>
        );
    }

}

export default NewRoom;