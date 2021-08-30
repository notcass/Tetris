class Playfield {
  constructor() {
    this.x = width / 5 + 75;
    this.y = 95; //height / 10;
    this.w = 450; // 540; // this.x * 3;
    this.h = height - this.y;
    this.cubeSize = 45; //this.w / 10;
    this.deadBlocks = [];
    this.slowFalling = true;
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

  showBorder() {
    stroke(0);
    strokeWeight(4);
    noFill();
    rect(this.x, this.y, this.w, this.h);
  }

  update() {
    this.fall(curTetro);
    this.clearRow();
    this.makeRowsFall();
    this.showDeadBlocks();
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

    // Draw tetro
    let x = 90;
    let y = 125;
    const TETRO = this.upcomingTetro;

    for (let i = 0; i < TETRO[0].length; i++) {
      for (let j = 0; j < TETRO[0].length; j++) {
        let cur = TETRO[i][j];
        if (cur === 1) {
          square(x, y, this.cubeSize);
        }
        x += this.cubeSize;
      }
      x = 90;
      y += this.cubeSize;
    }
  }

  // Create a block for each segment of a tetro
  killTetro(t) {
    const TYPE = t.type;
    const TETRO = t.tetros[TYPE];

    // Color
    let r = 0;
    let g = 0;
    let b = 0;
    if (TYPE == 2 || TYPE == 3 || TYPE == 6) r = 255;
    if (TYPE == 5) r = 155;
    if (TYPE == 0 || TYPE == 3 || TYPE == 4) g = 255;
    if (TYPE == 2) g = 125;
    if (TYPE == 0 || TYPE == 1) b = 255;
    if (TYPE == 5) b = 155;

    // Creating each block
    let x = t.x;
    let y = t.y;

    y = t.y - this.cubeSize;
    for (let i = 0; i < TETRO[0].length; i++) {
      x = t.x - this.cubeSize;

      for (let j = 0; j < TETRO[0].length; j++) {
        let cur = TETRO[i][j];
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
    this.upcomingTetro = curTetro.tetros[nextType];
  }

  spawnTetro() {
    curTetro = new Tetromino(this, this.sequence[this.sequenceCounter]);
    // curTetro = new Tetromino(this, 0); // testing
    this.sequenceCounter++;

    if (this.sequenceCounter == 7) {
      this.sequence = this.nextSequence;
      this.nextSequence = this.genSequence();
    }
  }

  clearRow() {
    // Creating Object for y values and how many occurences
    /*
        yCounts = {
          815: 1,
          860: 6,
          905: 9
        }
    */
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

      if (rowsToClear.length === 4) {
        console.log('TETRIS');
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

  // If there is an empty row, the rows above it should go down
  // Check all rows from top to bottom
  // For each row, check if any blocks are there
  // If no blocks in that row, then move all blocks above it down by gamespeed each frame
  makeRowsFall() {
    let rows = [];
    let lowestEmptyRow = 0;
    // Add rows to array
    for (
      let y = this.y + this.h - this.cubeSize;
      y >= this.y;
      y -= this.cubeSize
    ) {
      rows.push(y);
    }

    // Find lowest empty row
    rows.forEach((row) => {
      let emptyRow = true;
      this.deadBlocks.forEach((block) => {
        if (block.y == row) {
          emptyRow = false;
        }
      });
      if (emptyRow && row > lowestEmptyRow) lowestEmptyRow = row;
    });

    // Move any blocks above the lowest row down
    this.deadBlocks.forEach((block) => {
      if (block.y < lowestEmptyRow) block.y += this.fallSpeed;
    });
  }

  showDeadBlocks() {
    stroke(0);
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
      cur.updateCoords(cur.tetros[cur.type]);

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
