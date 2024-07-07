import logo from './logo.svg';
import './App.css';
import React from 'react'
import Home from './components/home'
import Lobby from './components/lobby'
import Game from './components/game'
import GameOver from './components/gameover'
import io from 'socket.io-client'

const socket = io.connect('http://localhost:5000/')

const pages = {home : 0, lobby : 1, game : 2, gameOver : 3}

export default class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {socket, page: pages.home, winner:"vfvxcv" }
    this.setGameInfo = this.setGameInfo.bind(this)
    this.setPlayerName = this.setPlayerName.bind(this)
    this.goToLobby = this.goToLobby.bind(this)
    this.goToGame = this.goToGame.bind(this)
    this.updateWord = this.updateWord.bind(this)
    this.resetGame = this.resetGame.bind(this)
    this.goToGameOver = this.goToGameOver.bind(this)
  }

  setGameInfo(game){
    this.setState({game})
  }

  setPlayerName(username){
    this.setState({username})
  }

  goToLobby(){
    this.setState({page:pages.lobby})
  }

  goToGame(){
    this.setState({page:pages.game})
  }
  goToGameOver(){
    this.setState({page:pages.gameOver})
  }

  updateWord(word){
    this.setState((prevstate) => ({
      ...prevstate,
      game:{
        ...prevstate.game,
        word
      }
    }))
  }

  resetGame(game,winner){
    
    this.setState({
      game,
      winner
    }, this.goToGameOver())
  }

  render (){
    return(
      <div>
        <link href="https://fonts.googleapis.com/css2?family=Mochiy+Pop+P+One&display=swap" rel="stylesheet"/>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
          integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
          crossorigin="anonymous"
        />
        {/* < GameOver winner={this.state.winner} /> */}
        { this.state.page === pages.home && <Home socket={this.state.socket} setGameInfo={this.setGameInfo} setPlayerName={this.setPlayerName} goToLobby={this.goToLobby} goToGame={this.goToGame} /> }
        { this.state.page === pages.lobby && <Lobby socket={this.state.socket} setGameInfo={this.setGameInfo}  username={this.state.username} game={this.state.game} goToGame={this.goToGame} /> }
        { this.state.page === pages.game && <Game socket={this.state.socket} username={this.state.username} game={this.state.game} setGameInfo={this.setGameInfo} resetGame={this.resetGame}/> }
        {this.state.page === pages.gameOver && < GameOver winner={this.state.winner} goToLobby={this.goToLobby}/>}
        </div>

    )
  }
}
