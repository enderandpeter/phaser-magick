import { options } from '../components/Game';
import Phaser from 'phaser';

const ASSETS_DIR = 'assets';

export default class PlayGame extends Phaser.Scene {
    constructor(){
        super("PlayGame");
    }
    addBlock(event){
        const distanceX = event.x - this.player.x;
        const distanceY = event.y - this.player.y;
        if (
            (distanceX * distanceX + distanceY * distanceY) <
                options.changeDirectionRange * options.changeDirectionRange
        ){
            this.player.direction *= -1;
        }
        else{
            if(!this.map.getTileAtWorldXY(event.x, event.y)){
                if(this.tilePoint){
                    this.map.removeTileAtWorldXY(this.tilePoint.x, this.tilePoint.y);
                }
                this.map.putTileAtWorldXY(2, event.x, event.y);
                this.tilePoint = new Phaser.Math.Vector2(event.x, event.y);
            }
        }
    }
    jump(){
        this.player.body.velocity.y = options.playerJumpSpeed.y;
        this.player.body.velocity.x = options.playerJumpSpeed.x * this.player.direction;
        this.player.isJumping = true;
    }
    movePlayer(){
        if(this.player.body.blocked.down){
            this.player.body.velocity.x = options.playerSpeed * this.player.direction;
            this.player.isJumping = false;
        }
        if(this.player.body.blocked.right && this.player.direction === 1){
            // There is something to the player's right as they are traveling right
            if(
                // See if the player can jump
                (
                    !this.map.getTileAtWorldXY( // There is nothing to the player's top right
                        this.player.x + options.tileSize, this.player.y - options.tileSize
                    )
                    &&
                    !this.map.getTileAtWorldXY( // There is nothing above the player
                        this.player.x, this.player.y - options.tileSize
                    )
                ) || this.player.isJumping // The player is already jumping
            ){
                this.jump();
            }
            else{
                // The player can't jump, so just change direction
                this.player.direction *= -1;
            }
        }
        // Same logic for the left direction
        if(this.player.body.blocked.left && this.player.direction === -1){
            if(
                (
                    !this.map.getTileAtWorldXY(
                        this.player.x - options.tileSize, this.player.y - options.tileSize
                    )
                    &&
                    !this.map.getTileAtWorldXY(
                        this.player.x, this.player.y - options.tileSize
                    )
                ) || this.player.isJumping){
                this.jump();
            }
            else{
                this.player.direction *= -1;
            }
        }
    }
    preload(){
        this.load.tilemapTiledJSON("map", `${ASSETS_DIR}/map.json`);
        this.load.image("tiles", `${ASSETS_DIR}/tiles.png`);
        this.load.image("player", `${ASSETS_DIR}/player.png`);
    }

    create(){
        this.tilePoint = null;
        this.map = this.make.tilemap({
            key: "map"
        });
        var tileSet = this.map.addTilesetImage("tileset01", "tiles");
        this.levelLayer = this.map.createDynamicLayer("myLevel", tileSet);
        this.map.setCollisionBetween(1, 2);
        this.player = this.physics.add.sprite(48, 226, "player");
        this.player.isJumping = false;
        this.player.direction = 1;
        this.player.body.gravity.y = options.playerGravity;
        this.input.on("pointerdown", this.addBlock.bind(this));
    }
    update(){
        this.player.body.velocity.x = 0;
        // Keep the player moving as it collides with the level layer
        this.physics.world.collide(this.player, this.levelLayer, this.movePlayer.bind(this), null);
    }
}