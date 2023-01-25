class Tetromino {
  constructor(playfield, type) {
    this.x = playfield.x + playfield.cubeSize * 4;
    this.y = playfield.y + playfield.cubeSize;
    this.cubeSize = playfield.cubeSize;
    this.coords = [];
    this.dead = false;
    this.type = type;
    this.aliveTime = 0;
    this.slideTimer = 0;
    this.tetros = [
      [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],

      [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
      ],

      [
        [0, 1, 1],
        [0, 1, 1],
        [0, 0, 0],
      ],

      [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
      ],

      [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],

      [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
      ],
    ];
    this.updateCoords(this.tetros[this.type]);
  }
}

Tetromino.prototype.show = function () {
  stroke(0);
  strokeWeight(4);
  switch (this.type) {
    case 0: // I
      fill(0, 255, 255);
      break;
    case 1: // J
      fill(0, 0, 255);
      break;
    case 2: // L
      fill(255, 125, 0);
      break;
    case 3: // O
      fill(255, 255, 0);
      break;
    case 4: // S
      fill(0, 255, 0);
      break;
    case 5: // T
      fill(155, 0, 155);
      break;
    case 6: // Z
      fill(255, 0, 0);
      break;
    default:
      fill(0);
      break;
  }
  let x = this.x;
  let y = this.y;
  const TETRO = this.tetros[this.type];

  y = this.y - this.cubeSize;
  for (let i = 0; i < TETRO[0].length; i++) {
    x = this.x - this.cubeSize;

    for (let j = 0; j < TETRO[0].length; j++) {
      let cur = TETRO[i][j];
      if (cur == 1) {
        square(x, y, this.cubeSize);
      }
      x += this.cubeSize;
    }
    y += this.cubeSize;
  }

  // DOWNWARD SLAM + LEFT AND RIGHT SLIDES
  //FIXME: The controls can be a little wonky if you really try to break them
  if (keyIsPressed && this.aliveTime > 25) {
    if (key == 'a' || key == 'd') {
      this.slideTimer++;
      if (this.slideTimer > 5 && frameCount % 2 == 0) {
        this.move(key);
      }
    } else if (key == 's') {
      this.move('s');
    }
  }

  this.aliveTime++;
};

Tetromino.prototype.keyReleased = function (key) {
  if (key == 'a' || key == 'd') {
    this.slideTimer = 0;
  }
};

Tetromino.prototype.move = function (key) {
  let moveable = true;

  switch (key) {
    // Left
    case 'a':
      this.coords.forEach((c) => {
        if (c.x == playfield.x) moveable = false;
      });
      if (moveable) this.x -= this.cubeSize; // Move Left
      this.updateCoords(this.tetros[this.type]); // Update coords
      if (playfield.collision(this.coords)) this.x += this.cubeSize; // Move back if any collision
      break;

    // Right
    case 'd':
      this.coords.forEach((c) => {
        if (c.x == playfield.x + playfield.w - this.cubeSize) moveable = false;
      });
      if (moveable) this.x += this.cubeSize; // Move right
      this.updateCoords(this.tetros[this.type]); // Update coords
      if (playfield.collision(this.coords)) this.x -= this.cubeSize; // Move back if any collision
      break;

    // Down
    case 's':
      // Check if any part of tetro is at the bottom
      this.coords.forEach((c) => {
        if (c.y == playfield.y + playfield.h - this.cubeSize) moveable = false;
      });

      // Move down if possible
      if (moveable) this.y += this.cubeSize;

      // Update coords
      this.updateCoords(this.tetros[this.type]);

      // Move back if any collision
      if (playfield.collision(this.coords)) this.y -= this.cubeSize;

      break;
  }
  this.updateCoords(this.tetros[this.type]);
};

// Update the coords for the blocks that make up a tetromino
Tetromino.prototype.updateCoords = function (block) {
  this.coords = new Array();
  let x = this.x;
  let y = this.y;

  y = this.y - this.cubeSize;
  for (let i = 0; i < block[0].length; i++) {
    x = this.x - this.cubeSize;

    for (let j = 0; j < block[0].length; j++) {
      let cur = block[i][j];
      if (cur == 1) {
        this.coords.push(createVector(x, y));
      }
      x += this.cubeSize;
    }
    y += this.cubeSize;
  }

  // Filter duplicate coords -- (copied from stack overflow)
  // This is still needed even after we switched from vertices
  // Edit 1/24/23: Is it still needed though?
  this.coords = this.coords.filter(
    (coord, index, self) =>
      index === self.findIndex((c) => c.x === coord.x && c.y === coord.y)
  );
};

Tetromino.prototype.rotate = function () {
  if (this.type != 3) {
    const TETRO = this.tetros[this.type];
    const LEN = TETRO.length;
    let copy = [];
    for (let n = 0; n < LEN; n++) {
      copy.push([]);
    }

    // Store rotated matrix in copy
    for (let i = 0; i < LEN; i++) {
      for (let j = 0; j < LEN; j++) {
        copy[j][LEN - 1 - i] = TETRO[i][j];
      }
    }

    // Update coords to analyze
    this.updateCoords(copy);

    // Check for overhang, store any bumps needed
    let bumps = this.bumpCheck();

    // If the coords of the rotated tetro don't collide with anything, then update to the rotated tetro
    if (!playfield.collision(this.coords)) {
      this.tetros[this.type] = copy;

      // If they do collide, then don't update, and revert the bump.
    } else {
      this.x -= bumps.xBump;
      this.y -= bumps.yBump;
    }

    this.updateCoords(this.tetros[this.type]);
  }
};

/*
BumpCheck() is a helper for when we rotate a piece that is next to a wall.
Imagine an "I" piece up against the right wall like so
               |
             []|
             []|
             []|
             []|
               |
We can't rotate it in place because of clipping,
so we "bump" it away
               |                                |
            [][][][]   is bumped to     [][][][]|
               |                                |
               |                                |
This applies to side walls and the floor
*/
Tetromino.prototype.bumpCheck = function () {
  let xBump = 0;
  let yBump = 0;

  this.coords.forEach((c) => {
    // Right
    if (c.x >= playfield.x + playfield.w) {
      xBump = -this.cubeSize;
      if (c.x == playfield.x + playfield.w + this.cubeSize) xBump *= 2;
    }

    // Left
    if (c.x < playfield.x) {
      if (this.cubeSize > xBump) xBump = this.cubeSize;
      if (c.x == playfield.x - this.cubeSize * 2) xBump = this.cubeSize * 2;
    }

    // Bottom
    if (c.y >= playfield.y + playfield.h) {
      if (yBump < this.cubeSize) yBump = -this.cubeSize;
      if (c.y == playfield.y + playfield.h + this.cubeSize)
        yBump = -(this.cubeSize * 2);
    }
  });

  // Bump block away from the edge and update coords to the rotated tetro
  this.x += xBump;
  this.y += yBump;
  return { xBump, yBump };
};

// Debug function
Tetromino.prototype.drawCoords = function () {
  this.coords.forEach((v) => {
    fill(255, 255, 0);
    circle(v.x, v.y, 25);
  });
};
