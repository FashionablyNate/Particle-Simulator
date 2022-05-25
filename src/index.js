import * as game from './main.js';

function component() {
    const element = document.createElement('div');
  
    element.innerHTML = game.main();
}

document.body.appendChild(component());