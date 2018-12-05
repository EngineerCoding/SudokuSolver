import Grid from "../Grid";


class SolveOptions {

  constructor(x, y, cell, mode) {
    this.position = {x: x, y: y};
    this.mode = mode;

    this.cell = cell;
    this.options = null;
    this.reset();
  }

  getPosition() {
    return this.position;
  }

  removeOption(option) {
    const idx = this.options.indexOf(option);
    if (idx !== -1) {
      this.options.splice(idx, 1);
      if (this.isFinalized()) {
        this.cell.setValue(this.getFinalizedValue());
        return true;
      }
    }
    return false;
  }

  isFinalized() {
    return this.options.length === 1;
  }

  getFinalizedValue() {
    return this.options[0];
  }

  reset() {
    this.cell.setValue(null);
    this.options = [...Array(this.mode ** 2).keys()]
      .map(value => value + 1);
  }

}


export default class Solver {

  constructor(grid) {
    this.grid = grid;
    this.optionsGrid = this.indexGrid();
  }

  indexGrid() {
    this.grid.iterateCells(cell => {
      cell.setFixed(cell.getValue() !== null);
    });

    const mode = this.grid.getMode();
    const size = mode ** 2;

    const matrix = [];
    for (let x = 0; x < size; x++) {
      const row = [];
      for (let y = 0; y < size; y++) {
        const cell = this.grid.getCell(x, y);
        const value = cell.getValue();

        row.push(value === null ? new SolveOptions(x, y, cell, mode) : value);
      }
      matrix.push(row);
    }
    return new Grid(matrix);
  }

  checkCell(x, y, removedValue) {
    // If already a number or finalized, stop
    const cell = this.optionsGrid.getCell(x, y);
    if (Number.isInteger(cell) || cell.isFinalized()) return;

    const fixedValues = [];
    const hasRemovedValue = Number.isInteger(removedValue);

    // Collect all cells which cross this cell
    let crossingCells = [];
    crossingCells.push(...this.optionsGrid.getColumn(y));
    crossingCells.push(...this.optionsGrid.getRow(x));
    crossingCells.push(...this.optionsGrid.getSubGridCells(x, y));

    if (!hasRemovedValue) fixedValues.push(...crossingCells.filter(Number.isInteger));

    // Filter the cells
    const positions = [];

    crossingCells = crossingCells
      // Filter cells which are numbers
      .filter(cell => !Number.isInteger(cell))
      // Filter cells with the current position
      .filter(cell => !(cell.x === x && cell.y === y))
      // Filter duplicates
      .filter(cell => {
        const position = cell.getPosition();
        const idx = positions.indexOf(position);
        if (idx === -1) {
          positions.push(position);
          return true;
        }
        return false;
      });

    // Collect the finalized cells
    if (hasRemovedValue) {
      fixedValues.push(removedValue);
    } else {
      crossingCells
        .filter(cell => cell.isFinalized())
        .forEach(cell => fixedValues.push(cell.getFinalizedValue()));
    }

    // Remove the values from the current cell
    for (let value of new Set(fixedValues).values()) {
      if (cell.removeOption(value)) {
        crossingCells.forEach(cell => {
          const {x, y} = cell.getPosition();
          this.checkCell(x, y, value);
        });
        break;
      }
    }
  }

  solve() {
    // first check all cells
    const size = this.grid.getMode() ** 2;
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        this.checkCell(x, y);
      }
    }
  }
}
