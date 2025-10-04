const display = document.getElementById('display');
const history = document.getElementById('history');
const buttons = document.querySelectorAll('button');
const advancedRows = document.querySelectorAll('.advanced-row');
const modeButtons = document.querySelectorAll('.toggle-btn');

let currentMode = 'deg';
let lastResult = null;

// Mode toggle
modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    modeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const mode = btn.getAttribute('data-mode');

    if (mode === 'advanced') {
      advancedRows.forEach(row => row.classList.add('show'));
    } else {
      advancedRows.forEach(row => row.classList.remove('show'));
    }
  });
});

// Button click events
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.getAttribute('data-value');
    const action = button.getAttribute('data-action');
    const func = button.getAttribute('data-func');

    handleInput(value, action, func);
  });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  e.preventDefault();
  
  const key = e.key;

  if (/[0-9+\-*/().]/.test(key)) {
    handleInput(key, null, null);
  } else if (key === 'Enter' || key === '=') {
    handleInput(null, 'calculate', null);
  } else if (key === 'Backspace') {
    handleInput(null, 'delete', null);
  } else if (key === 'Escape') {
    handleInput(null, 'clear', null);
  } else if (key === '%') {
    handleInput(null, null, 'percent');
  }
});

function handleInput(value, action, func) {
  if (action === 'clear') {
    display.value = '';
    history.textContent = '';
    lastResult = null;
  } else if (action === 'delete') {
    display.value = display.value.slice(0, -1);
  } else if (action === 'calculate') {
    calculate();
  } else if (value) {
    if (display.value === '0' && value !== '.') {
      display.value = value;
    } else {
      display.value += value;
    }
  } else if (func) {
    handleFunction(func);
  }
}

function handleFunction(func) {
  try {
    const input = parseFloat(display.value) || 0;
    let result;

    switch (func) {
      case 'sin': result = Math.sin(toRadians(input)); break;
      case 'cos': result = Math.cos(toRadians(input)); break;
      case 'tan': result = Math.tan(toRadians(input)); break;
      case 'asin': result = toDegrees(Math.asin(input)); break;
      case 'acos': result = toDegrees(Math.acos(input)); break;
      case 'atan': result = toDegrees(Math.atan(input)); break;
      case 'log': result = Math.log10(input); break;
      case 'ln': result = Math.log(input); break;
      case 'sqrt': result = Math.sqrt(input); break;
      case 'square': result = input ** 2; break;
      case 'cube': result = input ** 3; break;
      case 'pi': display.value += Math.PI; return;
      case 'e': display.value += Math.E; return;
      case 'percent': result = input / 100; break;
      case 'factorial': result = factorial(input); break;
      case 'inverse': result = 1 / input; break;
      case 'exp': result = Math.exp(input); break;
      case 'pow10': result = Math.pow(10, input); break;
      case 'power': display.value += '**'; return;
      default: result = 'Error';
    }

    history.textContent = `${func}(${input}) =`;
    display.value = formatResult(result);
  } catch (error) {
    display.value = 'Error';
  }
}

function calculate() {
  try {
    if (display.value.trim() !== '') {
      const expression = display.value.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
      history.textContent = display.value + ' =';
      const result = eval(expression);
      display.value = formatResult(result);
      lastResult = result;
    }
  } catch (error) {
    display.value = 'Error';
  }
}

function formatResult(result) {
  if (isNaN(result) || !isFinite(result)) return 'Error';
  return Math.round(result * 10000000000) / 10000000000;
}

function toRadians(degree) {
  return degree * (Math.PI / 180);
}

function toDegrees(radian) {
  return radian * (180 / Math.PI);
}

function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

// Allow input field to be editable
display.addEventListener('input', (e) => {});
