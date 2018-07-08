import Cell, {VALUE_BACKSPACE, VALUE_DELETE} from './Cell';

const liveSudokuGrids = [];

function bindKeypressListener() {
  if (liveSudokuGrids.length === 1) {
    window.addEventListener('keyup', event => {
      let value = null;
      if (/[0-9]/.test(event.key)) {
        value = parseInt(event.key, 10);
      } else if (event.key === 'Delete') {
        value = VALUE_DELETE;
      } else if (event.key === 'Backspace') {
        value = VALUE_BACKSPACE;
      }

      if (value !== null) {
        liveSudokuGrids.forEach(
          grid => grid.setHoveringCellValue(value))
      }
    });
  }
}

function extractCells(domElement) {
  const rows = domElement.getElementsByClassName('sudoku-row');
  const cells = [];

  Array.from(rows).forEach((row, x) => {
    const foundCells = row.getElementsByClassName('sudoku-cell');
    const createdCells = [];
    Array.from(foundCells).forEach((cell, y) => {
      createdCells.push(new Cell(x, y, cell));
    });
    cells.push(createdCells);
  });

  return cells;
}

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

  constructor(sudokuGrid) {
    this.cellMatrix = extractCells(sudokuGrid);
    this.mode = deferMode(this.cellMatrix);
    liveSudokuGrids.push(this);
    bindKeypressListener();
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

  setHoveringCellValue(value) {
    this.iterateCells(cell => {
        if (cell.isHoveredOver()) {
          cell.setValue(value);
          return true;
        }
    });
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

  clear() {
    this.iterateCells(cell => cell.clear());
  }

}
