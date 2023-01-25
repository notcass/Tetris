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
 *  DONE -- Hold 'a' or 'd' key to slide tetro left and right
 *
 *  -- Add ability to slide tetro temporarily after touching floor
 *
 *  -- Add 3 upcoming tetros?
 *
 *  -- Add scoring
 *
 *  -- Put curTetro into playfield
 *
 *  -- Add something special for a Tetris (clearing 4 rows at once?)
 *
 *  -- Button to swap current Tetro for upcoming one
 *
 *  -- Reconsider the way we handle key presses. Use array of valid keys,
 *     check which ones are pressed. Go through actions based on a priority.
 */

/**
 * BUG LIST
 *  FIXED -- Can collide past the floor
 *
 *   -- VERY RARELY a single or a few blocks will fall slightly too far
 *          This seems to happen during the fastfall animation.
 *          Hacky fix could be to check for deadblocks y values
 *          that aren't divisible by cubesize, then bump to nearest
 *          spot.
 */

let playfield;
let curTetro;
let song;
let backgroundImg;

function preload() {
  soundFormats('mp3');
  song = loadSound('assets/Tetris.mp3');
  backgroundImg = loadImage('assets/mountain.jpg');
}

function setup() {
  let canvas = createCanvas(1000, 950);
  canvas.parent('sketch-holder');
  resetGame();
  song.loop();
}

function resetGame() {
  playfield = new Playfield();

  // Active Block
  playfield.spawnTetro();
  playfield.upcomingTetro = curTetro.tetros[playfield.upcomingTetroType];

  curTetro.updateCoords(curTetro.tetros[curTetro.type]);

  // testingSetup();
}

function draw() {
  image(backgroundImg, 0, 0, width, height);
  playfield.show();
  playfield.update();
  playfield.showUpcoming();
  curTetro.show();

  // Testing
  // curTetro.drawCoords();
  // showRowVals();
  // playfield.hideTetro();
}

function keyPressed() {
  if (key === 'w' || key === 'a' || key === 'd') {
    curTetro.move(key);
  }
  if (key === 'e') {
    curTetro.rotate();
  }
  if (key === 'q') {
    isLooping() ? noLoop() : loop();
    song.isPlaying() ? song.pause() : song.loop();
  }
  if (key === 'r') {
    redraw();
  }
  if (key === 't') {
    console.log(window._downKeys);
  }
}

function keyReleased() {
  curTetro.keyReleased(key);
}

//Debug functions
function testingSetup() {
  curTetro = new Tetromino(playfield, 1);
  curTetro.x = 320;
  curTetro.y = 905;
  playfield.killTetro(curTetro);
  curTetro = new Tetromino(playfield, 2);
  curTetro.x = 320;
  curTetro.y = 815;
  playfield.killTetro(curTetro);
  curTetro = new Tetromino(playfield, 3);
  curTetro.x = 410;
  curTetro.y = 905;
  playfield.killTetro(curTetro);
  curTetro = new Tetromino(playfield, 3);
  curTetro.x = 500;
  curTetro.y = 905;
  playfield.killTetro(curTetro);
  curTetro = new Tetromino(playfield, 3);
  curTetro.x = 590;
  curTetro.y = 905;
  playfield.killTetro(curTetro);
  curTetro = new Tetromino(playfield, 0);
  curTetro.x = 455;
  curTetro.y = 815;
  playfield.killTetro(curTetro);
  curTetro = new Tetromino(playfield, 3);
  curTetro.x = 590;
  curTetro.y = 815;
  playfield.killTetro(curTetro);
}

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
