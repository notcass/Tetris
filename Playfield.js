class Playfield {
  constructor() {
    this.x = width / 5;
    this.y = height / 10;
    this.w = this.x * 3;
    this.h = height - this.y;
    this.cubeSize = this.w / 10;
    this.deadBlocks = [];
    this.slowFalling = true;
    this.fastFalling = false;
    this.fallToRow = 0;
    this.fallSpeed = 3;
  }

  show() {
    stroke(190);
    fill(255);
    for (let x = this.x; x < this.x + this.w; x += this.cubeSize) {
      for (let y = this.y; y < this.y + this.h; y += this.cubeSize) {
        rect(x, y, this.cubeSize, this.cubeSize);
      }
    }
  }

  clearRow() {
    // Creating Object for y values and how many occurences
    let yCounts = {};
    let rowsToClear = [];
    for (const b of this.deadBlocks) {
      yCounts[b.y] = yCounts[b.y] ? yCounts[b.y] + 1 : 1;
    }

    // Analysing y counts
    for (let row in yCounts) {
      // console.log(row + ' ' + yCounts[row]);
      if (yCounts[row] > 9) rowsToClear.push(row);
    }

    // Clear row/s
    if (rowsToClear.length != 0) {
      console.log('rows being cleared:');
      console.log(rowsToClear);
      console.log(rowsToClear[0]);

      rowsToClear.forEach((r) => {
        this.deadBlocks = this.deadBlocks.filter((b) => b.y != r);
      });

      //TODO:
      // TRIGGER BLOCKS FALLING AFTER CLEAR
      // BLOCKS ABOVE THE CLEARED ROW ONLY FALL AS FAR AS THE LOWEST CLEARED ROW
      this.fastFalling = true;
      this.fallToRow = rowsToClear[rowsToClear.length - 1];
      // this.fallToRow = rowsToClear[0];
    }

    if (this.fastFalling) {
      this.deadBlocks.forEach((b) => {
        b.y += this.fallSpeed;
        if (b.y == this.fallToRow) {
          this.fastFalling = false;
          this.fallToRow = 0;
        }
      });
    }
  }

  // Create a block for each segment of a tetromino
  killTetro(t) {
    let type = t.type;
    let block = t.blocks[type];

    // Color
    let r = 0;
    let g = 0;
    let b = 0;
    if (type == 2 || type == 3 || type == 6) r = 255;
    if (type == 5) r = 155;
    if (type == 0 || type == 3 || type == 4) g = 255;
    if (type == 2) g = 125;
    if (type == 0 || type == 1) b = 255;
    if (type == 5) b = 155;

    // Creating each block
    let x = t.x;
    let y = t.y;

    y = t.y - this.cubeSize;
    for (let i = 0; i < block[0].length; i++) {
      x = t.x - this.cubeSize;

      for (let j = 0; j < block[0].length; j++) {
        let cur = block[i][j];
        if (cur == 1) {
          // Block Template
          let newBlock = {
            x: x,
            y: y,
            r: r,
            g: g,
            b: b,
            size: this.cubeSize,
            show: function () {
              fill(this.r, this.g, this.b);
              square(this.x, this.y, this.size);
            },
          };

          // Adding blocks to list
          this.deadBlocks.push(newBlock);
        }
        x += this.cubeSize;
      }
      y += this.cubeSize;
    }
    // Spawn New Tetro
    let randBlock = floor(random(7));
    curBlock = new Tetromino(this, randBlock);
  }

  showDeadBlocks() {
    this.deadBlocks.forEach((b) => {
      b.show();
      fill(255, 255, 0);
      circle(b.x, b.y, 25);
    });
  }

  collision(coords) {
    let hit = false;

    coords.forEach((v) => {
      this.deadBlocks.forEach((b) => {
        if (v.x == b.x && v.y == b.y) {
          hit = true;
          // console.log(`Hit on ${v.x}, ${v.y}`);
        }
      });
    });
    return hit;
  }

  fall(cur) {
    if (frameCount % 60 == 0 && this.slowFalling) {
      cur.y += this.cubeSize;
      cur.updateCoords(cur.blocks[cur.type]);

      let atFloor = false;
      cur.coords.forEach((c) => {
        if (c.y == playfield.y + playfield.h - this.cubeSize) {
          atFloor = true;
        }
      });

      // If we're at the floor, spawn new block
      // If we collide with other blocks, move back and spawn new tetro

      if (this.collision(cur.coords)) {
        cur.y -= this.cubeSize;
        this.killTetro(cur);
      }

      if (atFloor) {
        this.killTetro(cur);
      }
    }
  }
}
