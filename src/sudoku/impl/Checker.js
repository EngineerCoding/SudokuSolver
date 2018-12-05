import {
  resetCellBackground,
  setCellBackgroundCorrect,
  setCellBackgroundIncorrect
} from "../CellUtils";


export default class Checker {

  constructor(grid, applyBackgroundColors) {
    this.grid = grid;
    this.backgroundColorMode = true;

    this.validCellTracker = [];
    this.reset();

    this.checkCell = this.checkCell.bind(this);
    this.setBackgroundColorMode(!!applyBackgroundColors);
  }

  setBackgroundColorMode(backgroundColorMode) {
    this.backgroundColorMode = !!backgroundColorMode;
    if (this.backgroundColorMode) {
      this.applyBackgroundColor();
    } else {
      this.resetBackground();
    }
  }

  getBackgroundColorMode() {
    return this.backgroundColorMode;
  }

  isValid() {
    return this.validCellTracker.map(row => row.every(item => item)).every(item => item);
  }

  reset() {
    const checker = this;
    this.grid.cellMatrix.forEach((row, idx) => {
      checker.validCellTracker[idx] = [...Array(row.length).keys()].map(key => true);
    });
  }

  applyBackgroundColor() {
    const checker = this;
    this.grid.iterateCells(cell => {
      const position = cell.getPosition();
      if (checker.validCellTracker[position.x][position.y]) {
        setCellBackgroundCorrect(cell);
      } else {
        setCellBackgroundIncorrect(cell);
      }
    });
  }

  resetBackground() {
    this.grid.iterateCells(resetCellBackground);
  }

  checkCell(cell, dontCascade, checkedCells) {
    // Check if value is even available
    const value = cell.getValue();
    resetCellBackground(cell);

    checkedCells = checkedCells || [];
    checkedCells.push(cell);
    let validCell = value !== null;

    const position = cell.getPosition();
    const positionString = JSON.stringify(position);
    const parent = this;

    const compareWithCell = otherCell => {
      if (positionString !== JSON.stringify(otherCell.getPosition())) {
        if (value !== null && value === otherCell.getValue()) {
          setCellBackgroundIncorrect(otherCell);
          setCellBackgroundIncorrect(cell);
          validCell = false;
        } else if (!dontCascade && checkedCells.indexOf(otherCell) === -1) {
          parent.checkCell(otherCell, !!dontCascade, checkedCells);
        }
      }
    };

    this.grid.getRow(position.x).forEach(compareWithCell);
    this.grid.getColumn(position.y).forEach(compareWithCell);
    this.grid.getSubGridCells(position.x, position.y).forEach(compareWithCell);

    this.validCellTracker[position.x][position.y] = value === null || validCell;
    if (validCell && this.backgroundColorMode) setCellBackgroundCorrect(cell);
    return validCell;
  }

}
