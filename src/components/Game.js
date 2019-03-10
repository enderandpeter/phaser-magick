import Phaser from 'phaser';
import React, { Component } from 'react';
import PlayGame from '../Scenes/PlayGame';

export const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 320,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug: false
        }
    },
    scene: [PlayGame],
    parent: 'game',
    title: 'Magick?',
}

export const options = {
    playerSpeed: 120,
    playerJumpSpeed: {
        x: 30,
        y: -100
    },
    tileSize: 32,
    changeDirectionRange: 32,
    playerGravity: 400
};


export default class Game extends Component {
    componentWillMount(){
        this.props.initializeGame(new Phaser.Game(config));
    }
    render(){
        return <div id="game"></div>;
    }
}