class Playfield {
  constructor() {
    this.x = width / 5 + 75;
    this.y = 95; //height / 10;
    this.w = 450; // 540; // this.x * 3;
    this.h = height - this.y;
    this.cubeSize = 45; //this.w / 10;
    this.deadBlocks = [];
    this.slowFalling = true;
    this.fastFalling = false;
    this.fallToRow = 0;
    this.fallSpeed = 3;
    this.gameSpeed = 30;
    this.totalRowsCleared = 0;
    this.sequenceCounter = 0;
    this.sequence = this.genSequence();
    this.nextSequence = this.genSequence();
    this.upcomingTetroType = this.sequence[1];
    this.upcomingTetro = [];
  }

  show() {
    // Main Grid
    stroke(190);
    fill(255);
    for (let x = this.x; x < this.x + this.w; x += this.cubeSize) {
      for (let y = this.y; y < this.y + this.h; y += this.cubeSize) {
        rect(x, y, this.cubeSize, this.cubeSize);
      }
    }
  }

  genSequence() {
    this.sequenceCounter = 0;
    const nums = [0, 1, 2, 3, 4, 5, 6];
    const sequence = [];
    for (let i = 0; i < 7; i++) {
      let next = random(nums);
      nums.splice(nums.indexOf(next), 1);
      sequence.push(next);
    }
    return sequence;
  }

  showUpcoming() {
    // Set colors
    switch (this.upcomingTetroType) {
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

    // Draw block
    let x = 90;
    let y = 125;
    let block = this.upcomingTetro;

    for (let i = 0; i < block[0].length; i++) {
      for (let j = 0; j < block[0].length; j++) {
        let cur = block[i][j];
        if (cur === 1) {
          square(x, y, this.cubeSize);
        }
        x += this.cubeSize;
      }
      x = 90;
      y += this.cubeSize;
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
            x,
            y,
            r,
            g,
            b,
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
    // Spawn new Tetro from sequence
    this.spawnTetro();

    // Set upcomingTetro from next in the sequence
    let index;
    let nextType;
    if (this.sequenceCounter != 7) {
      index = this.sequenceCounter;
      nextType = this.sequence[index];
    } else {
      index = 0;
      nextType = this.nextSequence[index];
    }
    this.upcomingTetroType = nextType;
    this.upcomingTetro = curBlock.blocks[nextType];
  }

  spawnTetro() {
    curBlock = new Tetromino(this, this.sequence[this.sequenceCounter]);
    this.sequenceCounter++;

    if (this.sequenceCounter == 7) {
      this.sequence = this.nextSequence;
      this.nextSequence = this.genSequence();
    }
  }

  clearRow() {
    // Creating Object for y values and how many occurences
    let yCounts = {};
    let rowsToClear = [];
    for (const b of this.deadBlocks) {
      yCounts[b.y] = yCounts[b.y] ? yCounts[b.y] + 1 : 1;

      // Gameover Trigger
      if (b.y == 95) {
        resetGame();
        console.log('~~== Game Over ==~~');
        break;
      }
    }

    // Analysing y counts
    for (let row in yCounts) {
      if (yCounts[row] > 9) {
        rowsToClear.push(row);
      }
    }

    // Clear row/s
    if (rowsToClear.length != 0) {
      rowsToClear.forEach((r) => {
        this.deadBlocks = this.deadBlocks.filter((b) => b.y != r);
      });

      this.fastFalling = true;
      this.fallToRow = rowsToClear[rowsToClear.length - 1];
    }

    //FIXME:
    // Because we loop through blocks from the highest to lowest,
    // We move blocks that are above the bottom ones even though the bottom should be stopped, we just haven't checked it yet
    // EDIT: I reversed the order but it still happens VERY RARELY
    if (this.fastFalling) {
      for (let i = this.deadBlocks.length - 1; i >= 0; i--) {
        let cur = this.deadBlocks[i];
        if (cur.y == this.fallToRow) {
          this.fastFalling = false;
          this.fallToRow = 0;
        }
        if (cur.y < this.fallToRow) {
          cur.y += this.fallSpeed;
        }
      }
    }

    // Add num of rows cleared to total
    this.totalRowsCleared += rowsToClear.length;
    // Increase fall speed
    if (this.totalRowsCleared >= 10) {
      if (this.gameSpeed > 5) {
        this.gameSpeed -= 5;
        this.totalRowsCleared = 0;
        console.log(`Gamespeed Increased! ${this.gameSpeed}`);
      }
    }
  }

  showDeadBlocks() {
    this.deadBlocks.forEach((b) => {
      b.show();

      // Show x, y positions
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
        }
      });
    });
    return hit;
  }

  fall(cur) {
    if (frameCount % this.gameSpeed == 0 && this.slowFalling) {
      cur.y += this.cubeSize;
      cur.updateCoords(cur.blocks[cur.type]);

      let atFloor = false;
      let passedFloor = false;
      cur.coords.forEach((c) => {
        if (c.y == playfield.y + playfield.h - this.cubeSize) {
          atFloor = true;
        }
        if (c.y >= playfield.y + playfield.h) {
          // console.log('%c TRIGGERED passed floor', 'color: red');
          passedFloor = true;
        }
      });

      // If we're at the floor, spawn new tetro
      // If we collide with other blocks, move back and spawn new tetro

      if (this.collision(cur.coords)) {
        cur.y -= this.cubeSize;
        this.killTetro(cur);
      } else if (atFloor) {
        // console.log('at floor');
      }

      if (passedFloor) {
        // console.log('%c noticed passed floor', 'color: green');
        // cur.y = 905; // This works for a horizontal I block that gets passed.
        // But will need to be dynamic depending on the block and rotation
        // cur.coords.forEach(c => if c.y ?? something something something)

        // I moved the bumping that was inside rotate() into its own function, seems to work great
        cur.bumpCheck();
      }

      if (atFloor || passedFloor) {
        if (!this.collision(cur.coords)) {
          this.killTetro(cur);
        }
      }
    }
  }
}
