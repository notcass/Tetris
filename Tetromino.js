class Tetromino {
  constructor(playfield, type) {
    this.x = playfield.x + playfield.cubeSize * 4;
    this.y = playfield.y + playfield.cubeSize * 7;
    this.cubeSize = playfield.cubeSize;
    this.coords = [];
    this.dead = false;
    this.type = type;
    this.blocks = [
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
    this.updateCoords(this.blocks[this.type]);
  }
}

Tetromino.prototype.show = function () {
  stroke(0);
  strokeWeight(1);
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

  let block = this.blocks[this.type];

  y = this.y - this.cubeSize;
  for (let i = 0; i < block[0].length; i++) {
    x = this.x - this.cubeSize;

    for (let j = 0; j < block[0].length; j++) {
      let cur = block[i][j];
      if (cur == 1) {
        square(x, y, this.cubeSize);
      }
      x += this.cubeSize;
    }
    y += this.cubeSize;
  }
};

//FIXME:
// After changing the vertices to just x,y coords
// we can rotate into the RIGHT and BOTTOM wall
Tetromino.prototype.rotate = function () {
  if (this.type != 3) {
    let block = this.blocks[this.type];
    const LEN = block.length;
    let copy = [];
    for (let n = 0; n < LEN; n++) {
      copy.push([]);
    }

    // Store rotated matrix in copy
    for (let i = 0; i < LEN; i++) {
      for (let j = 0; j < LEN; j++) {
        copy[j][LEN - 1 - i] = block[i][j];
      }
    }

    // Check for wall collision, rotate and move block
    let collisionLeft = false;
    let collisionRight = false;
    let collisionBottom = false;
    let bump = 0;
    this.updateCoords(copy);
    this.coords.forEach((v) => {
      // Right side overhang
      if (v.x > playfield.x + playfield.w) {
        let overHang = v.x - (playfield.x + playfield.w);
        if (overHang > bump) bump = overHang;
        collisionRight = true;
      }

      // Left side overhang
      if (v.x < playfield.x) {
        let overHang = playfield.x - v.x;
        if (overHang > bump) bump = overHang;
        collisionLeft = true;
      }

      // Bottom overhang
      if (v.y > playfield.y + playfield.h) {
        let overHang = v.y - (playfield.y + playfield.h);
        if (overHang > bump) bump = overHang;
        collisionBottom = true;
      }
    });
    // Push tetromino back inside playfield
    if (collisionRight) {
      this.x -= bump;
    } else if (collisionLeft) {
      this.x += bump;
    } else if (collisionBottom) {
      this.y -= bump;
    }

    // Update matrix
    if (!playfield.collision(this)) {
      this.blocks[this.type] = copy;
    }
  }
  // Update coords
  this.updateCoords(this.blocks[this.type]);
};

Tetromino.prototype.move = function (key) {
  let moveable = true;

  switch (key) {
    case 'w':
      this.y -= this.cubeSize;
      break;

    // Left
    case 'a':
      this.coords.forEach((v) => {
        if (v.x == playfield.x) moveable = false;
      });
      if (moveable) this.x -= this.cubeSize; // Move Left
      this.updateCoords(this.blocks[this.type]); // Update coords
      if (playfield.collision(this)) this.x += this.cubeSize; // Move back if any collision
      break;

    // Right
    case 'd':
      this.coords.forEach((v) => {
        if (v.x == playfield.x + playfield.w - this.cubeSize) moveable = false;
      });
      if (moveable) this.x += this.cubeSize; // Move right
      this.updateCoords(this.blocks[this.type]); // Update coords
      if (playfield.collision(this)) this.x -= this.cubeSize; // Move back if any collision
      break;

    // Down
    case 's':
      this.coords.forEach((v) => {
        if (v.y == playfield.y + playfield.h - this.cubeSize) moveable = false;
      });
      if (moveable) this.y += this.cubeSize; // Move down
      this.updateCoords(this.blocks[this.type]); // Update coords
      if (playfield.collision(this)) this.y -= this.cubeSize; // Move back if any collision
      break;
  }
  this.updateCoords(this.blocks[this.type]);
};

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

        // this.coords.push(createVector(x + this.cubeSize, y));

        // this.coords.push(createVector(x, y + this.cubeSize));

        // this.coords.push(createVector(x + this.cubeSize, y + this.cubeSize));
      }
      x += this.cubeSize;
    }
    y += this.cubeSize;
  }

  // Filter duplicate coords -- (copied from stack overflow)
  this.coords = this.coords.filter((coord, index, self) => index === self.findIndex((c) => c.x === coord.x && c.y === coord.y));
};

Tetromino.prototype.drawCoords = function () {
  this.coords.forEach((v) => {
    fill(255, 255, 0);
    circle(v.x, v.y, 25);
  });
};

Tetromino.prototype.rotateBackup = function () {
  if (this.type != 3) {
    let block = this.blocks[this.type];
    const LEN = block.length;
    let copy = [];
    for (let n = 0; n < LEN; n++) {
      copy.push([]);
    }

    for (let i = 0; i < LEN; i++) {
      for (let j = 0; j < LEN; j++) {
        copy[j][LEN - 1 - i] = block[i][j];
      }
    }

    // Check for wall collision, rotate and move block
    let collisionLeft = false;
    let collisionRight = false;
    let bump = 0;
    this.updateCoords(copy);
    this.coords.forEach((v) => {
      // Right side overhang
      if (v.x > playfield.x + playfield.w) {
        let overHang = v.x - (playfield.x + playfield.w);
        if (overHang > bump) bump = overHang;
        collisionRight = true;
        // console.log(`Overhang RIGHT: ${overHang}`);
      }

      // Left side overhang
      if (v.x < playfield.x) {
        let overHang = playfield.x - v.x;
        if (overHang > bump) bump = overHang;
        collisionLeft = true;
        // console.log(`Overhang LEFT: ${overHang}`);
      }
    });
    // Push tetromino back inside playfield
    if (collisionRight) {
      this.x -= bump;
    } else if (collisionLeft) {
      this.x += bump;
    }

    // Update matrix
    this.blocks[this.type] = copy;
  }
  // Update coords
  this.updateCoords(this.blocks[this.type]);
};

Tetromino.prototype.moveBackup = function (key) {
  let moveable = true;
  switch (key) {
    case 'w':
      this.y -= this.cubeSize;
      break;

    // Left
    case 'a':
      this.coords.forEach((v) => {
        if (v.x == playfield.x) moveable = false;
      });
      if (moveable) this.x -= this.cubeSize;
      break;

    // Right
    case 'd':
      this.coords.forEach((v) => {
        if (v.x == playfield.x + playfield.w) moveable = false;
      });
      if (moveable) this.x += this.cubeSize;
      break;

    // Down
    case 's':
      this.coords.forEach((v) => {
        if (v.y == playfield.y + playfield.h) moveable = false;
      });
      if (moveable) this.y += this.cubeSize;
      break;
  }
  this.updateCoords(this.blocks[this.type]);
};
