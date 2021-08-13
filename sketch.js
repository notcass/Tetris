/// <reference path="libraries/p5.global-mode.d.ts" />

/**
 * TODO LIST
 *  DONE -- Collision with walls
 *
 *  DONE -- Array of all tetros on screen
 *
 *  DONE -- Collision with other tetrominos
 *
 *  DONE -- Row Clearing
 *
 *  DONE -- Collision check inside rotate function
 *
 *  DONE -- Falling Animation
 *
 *  DONE -- When tetro gets to 'floor', set to dead, spawn new
 *
 *  DONE -- Add Quick fall when 's' key held
 *
 *  DONE -- Instead of random block, generate a random sequence of each block, pick next block in sequence
 *
 *  DONE -- Add upcoming tetro
 *
 *  -- Add 3 upcoming tetros
 *
 *  -- Score
 *
 *  -- Hold 'a' or 'd' key to slide left and right
 */

/**
 * BUG LIST
 *  FIXED -- Can collide past the floor
 *
 *   -- VERY RARELY a single block will fall slightly too far
 *             This seems to happen during the fastfall animation
 */

let playfield;
let curBlock;
let song;

function preload() {
  soundFormats('mp3');
  song = loadSound('Tetris.mp3');
}

function setup() {
  let canvas = createCanvas(1000, 950);
  canvas.parent('sketch-holder');
  resetGame();
  // song.play();
}

function resetGame() {
  playfield = new Playfield();

  // Testing Blocks at the bottom
  // curBlock = new Tetromino(playfield, 0);
  // curBlock.x = 330;
  // curBlock.y = 905;
  // playfield.killTetro(curBlock);

  // curBlock = new Tetromino(playfield, 2);
  // curBlock.x = 195;
  // curBlock.y = 905;
  // playfield.killTetro(curBlock);

  // curBlock = new Tetromino(playfield, 6);
  // curBlock.x = 465;
  // curBlock.y = 905;
  // playfield.killTetro(curBlock);

  // curBlock = new Tetromino(playfield, 4);
  // curBlock.x = 195;
  // curBlock.y = 860;
  // playfield.killTetro(curBlock);

  // curBlock = new Tetromino(playfield, 1);
  // curBlock.x = 330;
  // curBlock.y = 860;
  // playfield.killTetro(curBlock);

  // curBlock = new Tetromino(playfield, 1);
  // curBlock.rotate();
  // curBlock.rotate();
  // curBlock.x = 465;
  // curBlock.y = 815;
  // playfield.killTetro(curBlock);

  // Active Block
  playfield.spawnTetro();
  playfield.upcomingTetro = curBlock.blocks[playfield.upcomingTetroType];

  curBlock.updateCoords(curBlock.blocks[curBlock.type]);
}

function draw() {
  background(0);
  playfield.show();
  curBlock.show();

  // Fall animation
  playfield.fall(curBlock);
  playfield.clearRow();

  // Draw dead blocks
  playfield.showDeadBlocks();

  // Testing
  // curBlock.drawCoords();
  // showRowVals();
  playfield.showUpcoming();
  // playfield.hideTetro();
}

function keyPressed() {
  if (key === 'w' || key === 'a' || key === 'd') {
    curBlock.move(key);
  }
  if (key === 'e') {
    curBlock.rotate();
  }
  if (key === '1') {
    if (curBlock.type > 0) curBlock.type--;
  }
  if (key === '2') {
    if (curBlock.type < 6) curBlock.type++;
  }
  if (key === '3') {
    curBlock.x = mouseX;
    curBlock.y = mouseY;
    // playfield.showUpcoming();
  }
  if (key === '4') {
    playfield.killTetro(curBlock);
    let randBlock = floor(random(7));
    curBlock = new Tetromino(playfield, randBlock);
  }
  if (key === 'q') {
    isLooping() ? noLoop() : loop();
  }
  if (key === 'r') {
    redraw();
  }
  if (key === 't') {
    for (let i = 0; i < playfield.deadBlocks.length; i++) {
      playfield.deadBlocks[i].y -= i * 3;
    }
  }
}

// Testing Functions
function showRowVals() {
  for (let y = playfield.y; y <= height; y += 45) {
    fill(255);
    text(y, playfield.x - 45, y + 20);
  }
}

function logRows(y) {
  let rows = [];
  playfield.deadBlocks.forEach((b) => {
    if (b.y == y) {
      console.log(b);
      rows.push(b);
    }
  });
  return rows;
}
