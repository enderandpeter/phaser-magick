import React, { Component } from 'react';
import './App.css';
import Game from "./components/Game";

class App extends Component {
    state = {
        game: null,
        height: window.innerHeight,
        width: window.innerWidth
    }
    initializeGame(game){
        this.setState({ game })
    }
    preload(){
        this.load.tilemapTiledJSON("map", "assets/map.json");
        this.load.image("tiles", "assets/tiles.png");
        this.load.image("player", "assets/player.png");
    }
    render() {
        return (
            <div className="App">
              <h1>{this.state.game && this.state.game.config ? this.state.game.config.gameTitle : ''}</h1>
              <Game
                  game={this.state.game}
                  initializeGame={this.initializeGame.bind(this)}
              />
            </div>
        );
    }
}

export default App;
