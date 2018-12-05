import DomGrid from './sudoku/dom/DomGrid';
import Checker from './sudoku/impl/Checker';
import Solver from './sudoku/impl/Solver';

const sudokuGrid = new DomGrid(document.body.getElementsByClassName('sudoku-grid')[0]);
const sudokuChecker = new Checker(sudokuGrid, true);

sudokuGrid.bindChecker(sudokuChecker);


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


let lastTimeout = null;
const statusText = document.body.getElementsByClassName('status-text')[0];
function setStatusMessage(message, indefinite) {
  clearTimeout(lastTimeout);
  statusText.innerText = message;
  if (!!indefinite) {
    lastTimeout = setTimeout(() => statusText.innerText = '', 5000);
  }
}

gridInteractionButtons.solve.addEventListener('click',
  disableAndRun(() => {
    setStatusMessage('Solving..', true);
    const sudokuSolver = new Solver(sudokuGrid);
    sudokuSolver.solve();
    setStatusMessage('', false);
  }));

gridInteractionButtons.check.addEventListener('click',
  disableAndRun(() => {
    let message = 'valid sudoku';
    if (!sudokuChecker.isValid()) {
      message = 'in' + message;
    }

    setStatusMessage(message.charAt(0).toUpperCase() + message.slice(1));
  }));

gridInteractionButtons.clear.addEventListener('click',
  disableAndRun(sudokuGrid.clear.bind(sudokuGrid)));
