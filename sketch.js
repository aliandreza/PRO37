var PLAY = 1;
var END = 0;
var gameState = PLAY;

var sonic, sonic1, sonic_collided, sonic_running;
// var ground, invisibleground, groundImage;

var eggmanGroup, eggman1, eggman2, eggman3;
var cloudsGroup, cloudImage;

var gameover, gameoverImage;
var restart, restartImage;

var score = 0;

var music; 

function preload() {
    sonic_running = loadImage("images/sonic1.png");
    sonic_collided = loadImage("images/sonic_collided.png");

    // groundImage = loadImage("images/ground.png");

    cloudImage = loadImage("images/cloud.png");

    bgimg = loadImage("images/bg.png");

    eggman1 = loadImage("images/eggman1.png");
    eggman2 = loadImage("images/eggman2.png");
    eggman3 = loadImage("images/eggman3.png");

    gameoverimg = loadImage("images/gameover.jpg");
    restartimg = loadImage("images/restart.jpg");

    music = loadSound("sound/creepymusic.mp3")
}

function setup() {
    createCanvas(600, 200);

    music.play();

    sonic = createSprite(50, 100, 20, 50);
    sonic.addImage("sonic_running", sonic_running);
    sonic.scale = 0.08;

    ground = createSprite(0, 180, 3000, 20);
    ground.shapeColor = "black"
    // ground.addImage("ground", groundImage);
    ground.x = ground.width / 2;
    ground.velocityX = -(6 + (3 * score) / 100);
    ground.scale = 0.5

    gameover = createSprite(300, 100);
    gameover.addImage("gameover", gameoverimg);
    gameover.scale = 0.21;
    gameover.visible = false;

    restart = createSprite(300, 180);
    restart.addImage("restart", restartimg);
    restart.scale = 0.11;
    restart.visible = false;

    invisibleGround = createSprite(200, 190, 400, 10);
    invisibleGround.visible = false;

    cloudsGroup = new Group();
    eggmansGroup = new Group();

    score = 0;
}

function draw() {
    background(0);

    text("Score: " + score, 500, 50);

    if (gameState === PLAY) {
        score = score + Math.round(getFrameRate() / 60);
        ground.velocityX = -(6 + (3 * score) / 100);
        if (keyDown("space")) {
            sonic.velocityY = -10;
        }

        sonic.velocityY = sonic.velocityY + 0.8;

        if (ground.x < 0) {
            ground.x =  100;
        }

        sonic.collide(invisibleGround);
        spawnClouds();
        spawneggmans();

        if (eggmansGroup.isTouching(sonic)) {
            gameState = END;
        }
    } else if (gameState === END) {
        gameover.visible = true;
        restart.visible = true;

        ground.velocityX = 0;
        sonic.velocityY = 0;
        eggmansGroup.setVelocityXEach(0);
        cloudsGroup.setVelocityXEach(0);

        //change the trex animation
        // sonic.changeAnimation("collided", sonic_collided);

        //set lifetime of the game objects so that they are never destroyed
        eggmansGroup.setLifetimeEach(-1);
        cloudsGroup.setLifetimeEach(-1);

        if (mousePressedOver(restart)) {
            reset();
        }
    }

    drawSprites();
}

function reset() {
    gameState = PLAY;
    gameover.visible = false;
    restart.visible = false;

    eggmansGroup.destroyEach();
    cloudsGroup.destroyEach();
    score = 0;
}

function spawnClouds() {
    //write code here to spawn the clouds
    if (frameCount % 60 === 0) {
        var cloud = createSprite(600, 120, 40, 10);
        cloud.y = Math.round(random(80, 120));
        cloud.addImage("cloud", cloudImage);
        cloud.scale = 0.05;
        cloud.velocityX = -3;

        //assign lifetime to the variable
        cloud.lifetime = 200;

        //adjust the depth
        cloud.depth = sonic.depth;
        sonic.depth = sonic.depth + 1;

        //add each cloud to the group
        cloudsGroup.add(cloud);
    }
}

function spawneggmans() {
    if (frameCount % 60 === 0) {
        var eggman = createSprite(600, 165, 10, 40);
        eggman.velocityX = -(6 + (3 * score) / 100);

        //generate random eggmans
         var rand = Math.round(random(1, 2));
         switch (rand) {
          //  case 1:
          //    eggman.addImage("eggman1", eggman1);
             // break;
           case 1:
             eggman.addImage("eggman2", eggman2);
             eggman.scale = 0.05
             break;
           case 2:
             eggman.addImage("eggman3", eggman3);
             eggman.scale = 0.10;
             break;
           default:
             break;
         }

        // assign scale and lifetime to the eggman
        eggman.lifetime = 300;
        //add each eggman to the group
        eggmansGroup.add(eggman);
    }
}