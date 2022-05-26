import * as game from './main.js';

function component() {
    const element = document.createElement('div');
  
    // Lodash, now imported by this script
    element.innerHTML = game.main();
  
    return element;
  }
  
  document.body.appendChild(component());