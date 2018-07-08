import Grid from './sudoku/Grid';

const sudokuGrid = new Grid(document.body.getElementsByClassName('sudoku-grid')[0]);

const gridInteractionButtons = {
  solve: document.getElementById('solve'),
  check: document.getElementById('check'),
  clear: document.getElementById('clear')
};


function disableAndRun(func) {
  return function(event) {
    Object.values(gridInteractionButtons).forEach(button => button.disabled = true);
    func(event);
    Object.values(gridInteractionButtons).forEach(button => button.disabled = false);
  }
}

gridInteractionButtons.clear.addEventListener('click',
  disableAndRun(sudokuGrid.clear.bind(sudokuGrid)));
