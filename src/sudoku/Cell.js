

export default class Cell {

  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.value = null;
    this.fixed = false;
  }

  getPosition() {
    return {x: this.x, y: this.y};
  }

  setFixed(fixed) {
    return this.fixed = !!fixed;
  }

  isFixed() {
    return this.fixed;
  }

  setValue(value) {
    if (value === null || value > 0) {
      this.value = value;
      return true;
    }
    return false;
  }

  getValue() {
    return this.value;
  }

  clear() {
    this.setValue(null);
    this.setFixed(true);
  }

}
