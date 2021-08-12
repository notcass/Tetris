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
 *  -- Add Quick fall when 's' key held
 *
 *  -- Instead of random block, generate a random sequence of each block, pick next block in sequence
 *
 *  -- Score
 */

/**
 * BUG LIST
 *  Can collide past the floor
 *
 *  Sometimes a single block will fall slightly too far
 */

let playfield;
let curBlock;

function setup() {
  let canvas = createCanvas(750, 950);
  canvas.parent('sketch-holder');
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
  let randBlock = floor(random(7));
  curBlock = new Tetromino(playfield, 0);
  // curBlock.x = 555;
  curBlock.y = 680;
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
  showRowVals();
}

function keyPressed() {
  if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
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
    playfield.clearRow();
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
