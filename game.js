var game;
var gameOptions = {
  birdGravity: 800,
  birdSpeed: -125,
  minPipeHeight: 50, // minimum pipe height, in pixels. Affects hole position
  pipeHole: [100, 130], // hole range between pipes, in pixels
  birdFlapPower: 150, // flap thrust
  cloudSpeed: -30
};
var score = 0;
var scoreText;
var gameOver;
var bg;

//The playGame class holds a game scene
class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }

  preload() {
    //Load assests (images, sprites, sounds, etc) - Runs once
    this.load.image("bird", "assets/birdie.png");
    this.load.image("pipe", "assets/pipie.png");
    this.load.image("cloud", "assets/cloud.png");
    this.load.image("background", "assets/background.png");
  }

  create() {
    bg = this.add.tileSprite(400, 400, 800, 400, "background");
    //Initialize the scene (place assests on the screen) - Runs once
    this.bird = this.physics.add.sprite(80, 240, "bird");
    this.bird.body.gravity.y = gameOptions.birdGravity;

    this.pipetop = this.physics.add.sprite(400, 200, "pipe");
    this.pipebot = this.physics.add.sprite(400, 300, "pipe");

    this.pipetop.setFlipY(true);

    this.pipetop.setOrigin(0, 1); // Use the bottom left corner as the origin
    this.pipebot.setOrigin(0, 0); // Use the top left corner as the origin

    this.pipetop.setVelocityX(gameOptions.birdSpeed);
    this.pipebot.setVelocityX(gameOptions.birdSpeed);

    this.cloud = this.physics.add.sprite(400, 30, "cloud");
    
    this.cloud.setVelocityX(gameOptions.cloudSpeed);
    

    scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "20px",
      fill: "#F00"
    });

    gameOver = this.add.text(300, 300, "", {
      fontSize: "20px",
      fill: "#F00"
    });

    this.input.on("pointerdown", this.flap, this);

    this.physics.add.overlap(this.bird, this.pipetop, this.die, null, this); //When touching top pipe?
    this.physics.add.overlap(this.bird, this.pipebot, this.die, null, this); //When touching bottom pipe?

    this.bird.setCollideWorldBounds(true); //Turn on world bounds collisions
    this.bird.body.onWorldBounds = true; //Turn the event listener
    this.physics.world.on("worldbounds", this.die, this); //When touching world bounds
  }

  update() {
    bg.tilePositionX += 0.5;
    if (this.pipetop.getBounds().right < 0) {
      //If pipe has reached the left side of the screen
      score += 1;
      scoreText.setText("Score: " + score);
      this.pipetop.x = game.config.width + 30; //Move to the right side
      this.pipebot.x = game.config.width + 30; //Move to the right side

      let pipeHoleHeight = Phaser.Math.Between(
        gameOptions.pipeHole[0],
        gameOptions.pipeHole[1]
      ); //Random gap size
      let pipeHolePosition = Phaser.Math.Between(
        gameOptions.minPipeHeight + pipeHoleHeight / 2,
        game.config.height - gameOptions.minPipeHeight - pipeHoleHeight / 2
      ); //Random gap position
      this.pipetop.y = pipeHolePosition - pipeHoleHeight / 2;
      this.pipebot.y = pipeHolePosition + pipeHoleHeight / 2;
    }

    if (this.cloud.getBounds().right < 0) {
      //If cloud has reached the left side of the screen

      this.cloud.x = game.config.width + 30; //Move to the right side
    }
  }

  flap() {
    this.bird.body.velocity.y = -gameOptions.birdFlapPower;
  }

  die() {
    this.scene.pause("PlayGame");
    gameOver.setText("Game Over, ha ha ha!");
  }
}

let gameConfig = {
  width: 600,
  height: 480,
  backgroundColor: "#5fcde4",
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 0
      }
    }
  },
  parent: "game", // Create the game inside the <div id='game'>
  scene: playGame, //The class containing the methods to create our game (preload, create, update)
  audio: { disableWebAudio: true } // Use HTML5 audio instead of WebAudio
};
game = new Phaser.Game(gameConfig); //Start Phase
