import "./gameover.css";
import React from "react";
import image from '../images/blank-profile-picture-gc85d0d682_640.png'

export default class GameOver extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
    }
    componentDidMount(){
        setTimeout( ()=>{
            this.props.goToLobby()
        } ,5000)
    }
    render(){
        return(
            <div className="menu">
                <div className="title">Winner</div>
                <img src={image} alt="" className="image" />
                <div className="winner">{this.props.winner.name}</div>
            </div>
        )
    }
}
