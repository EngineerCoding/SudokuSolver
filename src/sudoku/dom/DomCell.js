import Cell from "../Cell";
import {resetCellBackground} from "../CellUtils";


function getCellTextElement(domElement) {
  const cellTextCollection = domElement.getElementsByClassName('cell-text');
  if (cellTextCollection.length !== 1) {
    throw new Error('Expected a single cell-text span');
  }
  return cellTextCollection[0];
}

export default class DomCell extends Cell {

  constructor(x, y, domElement) {
    super(x, y);

    this.entered = false;

    this.cellElement = domElement;
    this.cellTextElement = getCellTextElement(domElement);

    this.bindEvents();
  }

  bindEvents() {
    // Update the value
    const text = this.cellTextElement.innerText.trim();
    this.setValue(text.length > 0 ? parseInt(text, 10) : null);
    // Bind the keypress
    const _this = this;
    this.cellElement.addEventListener('mouseenter', () => {
      _this.entered = true;
    });
    this.cellElement.addEventListener('mouseleave', () => {
      _this.entered = false;
    });
  }

  getDomElement() {
    return this.cellElement;
  }

  getTextDomElement() {
    return this.cellTextElement;
  }

  isHoveredOver() {
    return this.entered;
  }

  setValue(value) {
    if (!super.setValue(value) && this.value !== null) {
      let stringValue = this.value.toString();
      if (value === VALUE_BACKSPACE) {
        stringValue = stringValue.substring(0, stringValue.length - 1);
      } else if (value === VALUE_DELETE) {
        stringValue = stringValue.substring(1);
      }
      if (stringValue.length === 0) {
        this.value = null;
      } else {
        this.value = parseInt(stringValue, 10);
      }
    }

    if (this.value === null) {
      this.cellElement.classList.remove('value-set');
      this.cellTextElement.innerText = '';
    } else {
      if (this.fixed) this.cellElement.classList.add('value-set');
      this.cellTextElement.innerText = this.value.toString();
    }
  }

  clear() {
    super.clear();
    resetCellBackground(this);
  }

}

export const VALUE_BACKSPACE = -1;
export const VALUE_DELETE = -1;
