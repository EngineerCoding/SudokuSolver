
function deferMode(cellMatrix) {
  const requiredLength = cellMatrix.length;
  cellMatrix.forEach(row => {
    if (row.length !== requiredLength) {
      throw new Error('Incorrect matrix found, not square');
    }
  });

  return Math.sqrt(requiredLength);
}

export default class Grid {

  constructor(cellMatrix) {
    this.cellMatrix = cellMatrix;
    this.mode = deferMode(this.cellMatrix);
  }

  iterateCells(func) {
    let dontBreak = true;
    for (let x = 0; x < this.cellMatrix.length && dontBreak; x++) {
      for(let y = 0; y < this.cellMatrix[x].length && dontBreak; y++) {
        const cell = this.cellMatrix[x][y];
        if (func(cell)) {
          dontBreak = false;
        }
      }
    }
  }

  getMode() {
    return this.mode;
  }

  getRow(x) {
    return this.cellMatrix[x];
  }

  getColumn(y) {
    return this.cellMatrix.map(row => row[y]);
  }

  getCell(x, y) {
    return this.cellMatrix[x][y];
  }

  getSubGridCells(x, y) {
    const cells = [];
    const subGridXPosition = Math.floor(x / this.mode) * this.mode;
    const subGridYPosition = Math.floor(y / this.mode) * this.mode;

    for (let row = subGridXPosition; row < subGridXPosition + this.mode; row++) {
      for (let column = subGridYPosition; column < subGridYPosition + this.mode; column++) {
        cells.push(this.cellMatrix[row][column]);
      }
    }

    return cells;
  }

}
