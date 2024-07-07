import "./home.css";
import React from "react";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.createGame = this.createGame.bind(this)
    this.joinGame = this.joinGame.bind(this)
    this.createGameInfo = this.createGameInfo.bind(this)
    }

    createUserName(){
        return document.querySelector('#nameInput').value || "Guest" + (Math.floor(Math.random() * 1000) + 1000);
    }

    makeid(length) {
        var result           = '';
        //var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
     charactersLength));
       }
       return result;
    }

    createGame(){
        let username = this.createUserName()
        let room = this.makeid(6)
        this.props.socket.emit('create-room', username, room, (data) => { this.createGameInfo(data,username) })
    }

    joinGame(){
        let username = this.createUserName()
        let room = document.querySelector('#gameCodeInput').value
        this.props.socket.emit('join-room', username, room, (res) => {
            if (res.error){ 
                this.setState({error:true,msg:res.msg})             
            }else{
                this.createGameInfo(res,username)
            }
        })
    }

    createGameInfo(data,username){
        this.props.setGameInfo(data)
        this.props.setPlayerName(username)
        if(data.isplaying){
          this.props.goToGame()
        }else{
          this.props.goToLobby()
        }
        
    }


  render() {
    return (
      <div>
        <div class="title">What's The Word</div>
        <div class="settings">
          <input id="nameInput" type="text" class="input enter-name" placeholder="Enter your name" autocomplete="off" />
          <button id="createGameButton" class=" btn btn-success btn-lg btn-block button" onClick={this.createGame} > Create Game </button>
          <input id="gameCodeInput" type="text" class="input game-code" placeholder="Game code" autocomplete="off"/>
          <button id="joinGameButton" class="btn btn-info btn-lg btn-block button join-game" onClick={this.joinGame}> Join Game</button>
          {this.state.error && (
            <div className="error">
              {this.state.msg}
            </div>
          )} 
        </div>
      </div>
    );
  }
}
