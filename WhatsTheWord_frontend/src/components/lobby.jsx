import "./lobby.css";
import React from "react";
import image from '../images/blank-profile-picture-gc85d0d682_640.png'

export default class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.startGame = this.startGame.bind(this)
    //this.getImage = this.getImage.bind(this)
    }

  // getCookie(name){
  //     var cookieValue = null;
  //     if(document.cookie && document.cookie !== ''){
  //       var cookies = document.cookie.split(';')
  //       for(var i =0; i<cookies.length;i++){
  //         var cookie =cookies[i].trim()
  //         if(cookie.substring(0,name.length+1)===(name+'=')){
  //           cookieValue= decodeURIComponent(cookie.substring(name.length+1))
  //           break
  //         }
  //       }
  //     }
  //   }
  componentWillMount(){
      //this.getImage(this.props.game.players[0].image)
      this.props.socket.on('users-changed', (game) => {
          console.log(game)
          this.props.setGameInfo(game)
      })
      this.props.socket.on('game-started',(game) => {
        this.props.setGameInfo(game)
        this.props.goToGame()  
      })
  }

  startGame(){
      this.props.socket.emit('game-started')
  }

  // getImage(image){
  //   console.log(image)
  //   const csrftoken = this.getCookie("csrftoken");
  //   const url = `http://localhost:5000/image/${image}`
  //   fetch(url,{
  //     method:"GET",
  //     headers: {
  //       "Content-type": "image/png",
  //       "X-CSRFToken": csrftoken,
  //     }
  //   })
  //     .then(response => response.blob() )
  //     .then(imageBlob => {
  //       const imageObjectURL = URL.createObjectURL(imageBlob);
  //       this.setState({image:imageObjectURL})
  //       console.log("DSADS")
  //       console.log(imageObjectURL)
  //     })
  // }
  render() {
    return (
      <div>
        <div className="title">
          What's The Word
        </div>
        <div className="main">
            <div className="left-div">
              <img src={image} alt="" className="main-avatar" />
              <div className="name">{this.props.username}</div>
              {this.props.username === this.props.game.host  && <button id="button" className=" btn btn-success btn-lg btn-block" onClick={this.startGame}>Start Game</button>} 
              <div className="game-code" >{this.props.game.room}</div>
          </div>
            
          <div className="right-div">
            {this.props.game.players.map((player) =>{
            return(
              <div className="player1">
                <img src={image} alt="" className="player-image" />
                <div className="player-name">{player.name}</div>
              </div>
            )
            })} 
          </div>
        </div>
      </div>
    );
  }
}
