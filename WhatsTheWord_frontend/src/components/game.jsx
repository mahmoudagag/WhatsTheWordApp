import './game.css';
import React from 'react'
import heart from '../images/PikPng.com_pixel-heart-png_1787846.png'
import star from '../images/PinClipart.com_clipart-app_337440.png'
import bomb from '../images/—Pngtree—black-lit bombs_4284015.png'

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        gameOver:false,
        turn:0,
    }
    this.createCircle = this.createCircle.bind(this)
    this.onWordEnter = this.onWordEnter.bind(this)
    this.changeWord = this.changeWord.bind(this)
    this.activateInput = this.activateInput.bind(this)
    }

    componentDidMount() {
        // console.log(this.props.game)
        const username = this.props.username
        // console.log(username)
        this.createCircle(this.props.game)

        this.props.socket.on('new-word',(word) => {
            document.querySelector('#wordInput').value = word
        })

        this.props.socket.on("next-player", (game) =>{
            this.props.setGameInfo(game)
            this.activateInput(game.current,game.turn,game,username)
            //console.log(this.state.turn)
            //this.setState( (prevstate) => ({ turn: prevstate.turn+1}))
            
        })
        this.props.socket.on('users-changed', (game)=> {
            this.props.setGameInfo(game)
            this.createCircle(game)
        }) 
        this.props.socket.on('game-over', (game,winner) => {
            console.log( " game over ") 
            // this.props.setGameInfo(game)
            // console.log(game)
            this.props.resetGame(game,winner)
            this.setState( {gameOver:true})
        })
        this.activateInput(0,0,this.props.game,username)
    }
    createCircle(game){
        const center = document.querySelector('#center')
        center.style.height = `100vh`
        center.style.width = `100vh`
        center.style.margin = `auto`
        // center.style.border = `1px solid`
        const numOfPlayers = game.players.length

        const r = (center.offsetHeight /2) -10
        const degrees = 360/numOfPlayers
        const radian = Math.PI/180
        for(var i=0;i<numOfPlayers;i++){
              let player = document.getElementById(i)
              let displaceX = player.offsetWidth / 2
              let displaceY = player.offsetHeight / 2
              player.style.left = `${r*Math.cos((degrees*(i+1))*radian) + r - displaceX }px`
              player.style.top = `${r*Math.sin((degrees*(i+1))*radian) + r - displaceY}px`
        } 
    }

    createHearts(n){
        const arr = []
        for(var i=0;i<n;i++){
          arr.push(0)
        }
        const hearts = arr.map(() =>{
          return(<img src={heart} alt="" className="hearts" />)
        })
        return hearts
    }

    activateInput(curr,turn,game,username){
        // console.log(username)
        // const t = turn
        const wordInput = document.querySelector('#wordInput')
        wordInput.value = ''
        if(game.players[curr].name !== username){
            wordInput.disabled = true
        }else{
            wordInput.disabled = false
            wordInput.focus()
            setTimeout( () => {
                // if answer is sumbitted correctly and the game state couldnt change in
                // time, it might call the emit wrong
                // if (this.props.game.turn === t && !this.state.gameOver){ //this.props.players
                //     // console.log(`emited ${username}`)
                //     this.props.socket.emit('wrong',username)
                // }
                this.props.socket.emit('next-player',username,turn,'wrong')
            }, Math.floor(Math.random() * 4000 ) + 6000)
        }
    }

    changeWord(e){
        let word = e.target.value
        this.props.socket.emit('update-word',word)
    }

    onWordEnter(e){
        if(e.key === 'Enter'){
          //first check if letters in e.target.value
            let letters = this.props.game.letters
            let word = e.target.value
            if(! word.includes(letters)){
                this.wrongWord()
            }else{
                const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
                fetch(url)
                .then( (response) => response.json() )
                .then( (data) => {
                    if(Array.isArray(data)){ 
                        this.props.socket.emit("next-player",this.props.username,0,'correct') 
                    }else{ throw new Error() }
                })
                .catch( error => this.wrongWord())
            }
        }
    }

    wrongWord(){
        //if the word is wrong make red and shake
        const input = document.getElementById('wordInput')
        input.classList.add("animation")
        setTimeout( () => {input.classList.remove("animation")},830)
    }

  render() {
    return (
        <div>
            <div id="center" className="center"> 
            <div className="game">
                <div className="letters">"{this.props.game.letters}"</div>
                <input autoComplete='off' id="wordInput" /* disabled */ className="wordInput" type="text" onChange={this.changeWord} onKeyDown={this.onWordEnter}/>
            </div>
            {this.props.game.players.map( (player ,i) =>{
                return(
                    <div id={i} className="player">
                        {/* {i === this.props.game.current &&
                            <img src={bomb} alt="" className="bomb" />
                        } */}
                        <div className="player-name">{player.name}</div>
        
                        <div className="player-hearts">
                        {
                            this.createHearts(player.lives)
                        }
                        </div>
                    </div>
                )
            })}   
            </div>
        </div>     
    );
  }
}
