import DomCell from "./dom/DomCell";


class CellUtils {

  constructor(cell) {
    this.cell = cell;
  }

  setBackgroundCorrect() {}
  setBackgroundIncorrect() {}
  resetBackground() {}
}


class DomCellUtils extends CellUtils {

  getClassList() {
    return this.cell.getDomElement().classList
  }

  setBackgroundCorrect() {
    this.resetBackground();
    this.getClassList().add('correct-value');
  }

  setBackgroundIncorrect() {
    this.resetBackground();
    this.getClassList().add('incorrect-value');
  }

  resetBackground() {
    this.getClassList().remove('correct-value', 'incorrect-value');
  }

}

export default function getCellUtils(cell) {
  if (cell instanceof DomCell) return new DomCellUtils(cell);
  return new CellUtils(cell);
}

/** Proxy methods **/

export function setCellBackgroundCorrect(cell) {
  if (cell.getValue() === null || !cell.isFixed()) return;
  getCellUtils(cell).setBackgroundCorrect();
}

export function setCellBackgroundIncorrect(cell) {
  if (cell.getValue() === null || !cell.isFixed()) return;
  getCellUtils(cell).setBackgroundIncorrect();
}

export function resetCellBackground(cell) {
  getCellUtils(cell).resetBackground();
}
