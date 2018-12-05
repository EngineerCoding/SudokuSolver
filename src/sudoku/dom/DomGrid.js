import Grid from "../Grid";
import DomCell, {VALUE_BACKSPACE, VALUE_DELETE} from "./DomCell";


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
      createdCells.push(new DomCell(x, y, cell));
    });
    cells.push(createdCells);
  });

  return cells;
}


export default class DomGrid extends Grid {

  constructor(sudokuGrid) {
    super(extractCells(sudokuGrid));
    this.checker = null;

    liveSudokuGrids.push(this);
    bindKeypressListener();
  }

  bindChecker(checker) {
    this.checker = checker;
  }

  setHoveringCellValue(value) {
    const checker = this.checker;
    this.iterateCells(cell => {
      if (cell.isHoveredOver()) {
        cell.setValue(value);
        if (checker) checker.checkCell(cell);
        return true;
      }
    });
  }

  clear() {
    super.clear();
    if (this.checker) this.checker.reset();
  }

}
