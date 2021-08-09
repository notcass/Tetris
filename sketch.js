/// <reference path="libraries/p5.global-mode.d.ts" />

/**
 * TODO LIST
 * 1. DONE -- Collision with walls
 *
 * 2. DONE -- Array of all tetros on screen
 *
 * 3. DONE -- Collision with other tetrominos
 *
 * 4. DONE -- Row Clearing
 *
 * 5. Collision check inside rotate function
 *
 * 6. Falling Animation
 *
 * 7. When tetro gets to 'floor', set to dead, spawn new
 *
 * 8. Instead of random block, generate a random sequence of each block, pick next block in sequence
 *
 */

let playfield;
let curBlock;

function setup() {
  let canvas = createCanvas(750, 950);
  canvas.parent('sketch-holder');
  playfield = new Playfield();

  // bottom blocks for removal testing
  curBlock = new Tetromino(playfield, 0);
  curBlock.x = 330;
  curBlock.y = 905;
  playfield.killTetro(curBlock);

  curBlock = new Tetromino(playfield, 2);
  curBlock.x = 195;
  curBlock.y = 905;
  playfield.killTetro(curBlock);

  curBlock = new Tetromino(playfield, 6);
  curBlock.x = 465;
  curBlock.y = 905;
  playfield.killTetro(curBlock);

  // Active Block
  let randBlock = floor(random(7));
  curBlock = new Tetromino(playfield, 0);
  curBlock.x = 510;
  curBlock.y = 770;
}

function draw() {
  background(0);
  playfield.show();
  curBlock.show();
  curBlock.drawCoords();

  // Draw dead blocks
  playfield.showDeadBlocks();
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
    console.log(mouseX, mouseY);
  }
}
