// Initialize game states
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided;
var ground, invisibleGround, groundImg;

var brickImg,bricksGroup;
var obstacleImg,obstaclesGroup;

var score;

var gameOver, restart;


function preload(){
  // load assets of the game
  bg = loadImage("bg.png");
  mario_running =   loadAnimation("mario00.png","mario01.png","mario02.png","mario03.png");
  mario_collided = loadAnimation("collided.png");
  
  groundImg = loadImage("ground2.png");
  
  brickImg = loadImage("brick.png");
  
  obstacleImg = loadAnimation("obstacle1.png","obstacle2.png","obstacle3.png","obstacle4.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  
  createCanvas(600, 400);
  
  mario = createSprite(50,330);
  
  mario.addAnimation("running",mario_running);
  mario.addAnimation("collided",mario_collided);
  mario.scale = 2;
  //mario.debug=true
  
  ground = createSprite(300,370,600,20);
  ground.addImage("ground",groundImg);
  ground.x = ground.width /2;
 
  
  gameOver = createSprite(300,200);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  
  restart = createSprite(300,240);
  restart.addImage(restartImg);
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(300,340,600,10);
  invisibleGround.visible = false;
  
  bricksGroup = new Group();
  obstaclesGroup = new Group();
 
  score = 0;
}

function draw() {
  
    background(bg);
   
    fill("black");
    textSize(22);
    text("Score: "+ score, 400,30);
  
  if (gameState===PLAY){
    
    // move the ground
      ground.velocityX = -6;
    // infinite scrolling ground
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

       
    if(score>0 && score%10 === 0){
       checkPointSound.play() 
    }
    
    //console.log(mario.y);
    // jump mario when space key is pressed
    if(keyDown("space") && mario.y >= 297) {
      mario.velocityY = -12;
      jumpSound.play();
    }
    mario.velocityY = mario.velocityY + 0.5;
  
    spawnBricks();
    spawnObstacles();
    
    for (var i = 0; i < bricksGroup.length; i++) {
    
      if(bricksGroup.get(i).isTouching(mario)){
        bricksGroup.get(i).remove()
        score = score+1;
    }
    }
    
    
    if(obstaclesGroup.isTouching(mario)){
        gameState = END;
        jumpSound.play();
    }
    mario.collide(invisibleGround);
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    mario.velocityY = 0;
    
    obstaclesGroup.setVelocityXEach(0);
    bricksGroup.setVelocityXEach(0);
    
    //change the animation
    mario.changeAnimation("collided",mario_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    bricksGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function reset(){
  
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  bricksGroup.destroyEach();
  
  mario.changeAnimation("running",mario_running);
    
  score = 0;
  
}

function spawnBricks() {
  //write code here to spawn the brick
  if (frameCount % 80 === 0) {
    var brick = createSprite(600,random(150,180));
   
    brick.addImage(brickImg);
    brick.velocityX = -3;
    
     //assign lifetime to the variable
    brick.lifetime = 300;   
    
    //adjust the depth
    brick.depth = mario.depth;
    mario .depth = mario.depth + 1;
    
    //add each brick to the group
    bricksGroup.add(brick);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,305);
    //obstacle.debug = true;
    
    obstacle.addAnimation("obstacles",obstacleImg )
    obstacle.velocityX = -6;
    
    //assign scale and lifetime to the obstacle           
    obstacle.lifetime = 200;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

