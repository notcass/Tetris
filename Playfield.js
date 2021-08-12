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
      if (frameCount % 60 == 0) {
        // console.log(row + ' ' + yCounts[row]);
      }
      if (yCounts[row] > 9) {
        // console.log(`row ${row} > 9`);

        rowsToClear.push(row);
      }
    }

    // Clear row/s
    if (rowsToClear.length != 0) {
      // console.log('rows being cleared:');
      // console.log(rowsToClear);

      rowsToClear.forEach((r) => {
        this.deadBlocks = this.deadBlocks.filter((b) => b.y != r);
      });

      this.fastFalling = true;
      this.fallToRow = rowsToClear[rowsToClear.length - 1];
      console.log(`fallToRow ${this.fallToRow}`);
    }

    if (this.fastFalling) {
      this.deadBlocks.forEach((b) => {
        if (b.y == this.fallToRow) {
          this.fastFalling = false;
          this.fallToRow = 0;
        }
        if (b.y <= this.fallToRow) {
          b.y += this.fallSpeed;
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

    console.log('~Dead Blocks~');
    console.log(this.deadBlocks);
  }

  showDeadBlocks() {
    this.deadBlocks.forEach((b) => {
      b.show();
      // fill(255, 255, 0);
      // circle(b.x, b.y, 25);
    });
  }

  collision(coords) {
    let hit = false;

    coords.forEach((c) => {
      this.deadBlocks.forEach((b) => {
        if (c.x == b.x && c.y == b.y) {
          hit = true;
          // console.log(`Hit on ${c.x}, ${c.y}`);
        }

        // Clipping through floor fix?
        // if (c.y >= this.y + this.h) {
        // hit = true;
        // }
      });
    });
    return hit;
  }

  fall(cur) {
    if (frameCount % 30 == 0 && this.slowFalling) {
      // console.log(`falling ${frameCount}`);

      cur.y += this.cubeSize;
      cur.updateCoords(cur.blocks[cur.type]);

      let atFloor = false;
      let passedFloor = false;
      cur.coords.forEach((c) => {
        if (c.y == playfield.y + playfield.h - this.cubeSize) {
          atFloor = true;
        }
        if (c.y >= playfield.y + playfield.h) {
          console.log('%c TRIGGERED passed floor', 'color: red');

          passedFloor = true;
        }
      });

      // If we're at the floor, spawn new block
      // If we collide with other blocks, move back and spawn new tetro
      // if (this.collision(cur.coords)) {
      //   cur.y -= this.cubeSize;
      //   this.killTetro(cur);
      // } else if (atFloor) {
      //   console.log('at floor');

      //   if (passedFloor) {
      //     console.log('passed floor');

      //     // cur.y -= this.cubeSize;
      //     cur.y = 860;
      //   }
      //   this.killTetro(cur);
      // }

      if (this.collision(cur.coords)) {
        cur.y -= this.cubeSize;
        this.killTetro(cur);
      } else if (atFloor) {
        console.log('at floor');
      }
      if (passedFloor) {
        console.log('%c noticed passed floor', 'color: green');
        // LEFT OFF HERE
        cur.y = 905; // This works for a horizontal I block that gets passed.
        // But will need to be dynamic depending on the block and rotation
        // cur.coords.forEach(c => if c.y ?? something something something)
      }

      if (atFloor || passedFloor) {
        if (!this.collision(cur.coords)) {
          this.killTetro(cur);
        }
      }
    }
  }
}
