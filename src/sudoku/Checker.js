

export default class Checker {

  constructor(grid, applyBackgroundColors) {
    this.grid = grid;
    this.backgroundColorMode = !!applyBackgroundColors;

    this.validCellTracker = [];
    this.reset();

    this.checkCell = this.checkCell.bind(this);
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
    this.grid.cellMatrix.forEach(row => {
      checker.validCellTracker.push([...Array(row.length).keys()].map(idx => true));
    });
  }

  applyBackgroundColor() {
    const checker = this;
    this.grid.iterateCells(cell => {
      const position = cell.getPosition();
      if (checker.validCellTracker[position.x][position.y]) {
        cell.setCorrectValue();
      } else {
        cell.setIncorrectValue();
      }
    });
  }

  resetBackground() {
    this.grid.iterateCells(cell => cell.resetBackgroundColor());
  }

  checkCell(cell, dontCascade, checkedCells) {
    // Check if value is even available
    const value = cell.getValue();
    cell.resetBackgroundColor();

    checkedCells = checkedCells || [];
    checkedCells.push(cell);
    let validCell = value !== null;

    const position = cell.getPosition();
    const positionString = JSON.stringify(position);
    const parent = this;

    const compareWithCell = otherCell => {
      if (positionString !== JSON.stringify(otherCell.getPosition())) {
        if (value !== null && value === otherCell.getValue()) {
          otherCell.setIncorrectValue();
          cell.setIncorrectValue();
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
    if (validCell && this.backgroundColorMode) cell.setCorrectValue();
    return validCell;
  }

}
