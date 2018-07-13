
function getCellTextElement(domElement) {
  const cellTextCollection = domElement.getElementsByClassName('cell-text');
  if (cellTextCollection.length !== 1) {
    throw new Error('Expected a single cell-text span');
  }
  return cellTextCollection[0];
}


export default class Cell {

  constructor(x, y, domElement) {
    this.x = x;
    this.y = y;

    this.value = null;
    this.fixed = true;
    this.entered = false;

    this.cellElement = domElement;
    this.cellTextElement = getCellTextElement(domElement);

    this.bindEvents();
  }

  getPosition() {
    return {x: this.x, y: this.y};
  }

  setFixed(fixed) {
    this.fixed = !!fixed;
    return this.fixed;
  }

  isFixed() {
    return this.fixed;
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

  isHoveredOver() {
    return this.entered;
  }

  setValue(value) {
    if (value === null || value > 0) {
      this.value = value;
    } else if (this.value !== null) {
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

  getValue() {
    return this.value;
  }

  setCorrectValue() {
    this.resetBackgroundColor();
    this.cellElement.classList.add('correct-value');
  }

  setIncorrectValue() {
    this.resetBackgroundColor();
    this.cellElement.classList.add('incorrect-value');
  }

  resetBackgroundColor() {
    this.cellElement.classList.remove('correct-value', 'incorrect-value');
  }

  clear() {
    this.setValue(null);
    this.setFixed(true);
    this.resetBackgroundColor();
  }

}

export const VALUE_BACKSPACE = -1;
export const VALUE_DELETE = -1;
