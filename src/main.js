main();

import * as resMan from './resourceManager.js';
import * as sprRen from './spriteRenderer.js';
import * as game from './game.js';
import { vsSource, fsSource } from './shaderSource.js';

//
// Start here
//
function main() {

  const canvas = document.querySelector('#glcanvas');
  window.width = canvas.width;
  window.height = canvas.height;
  const gl = canvas.getContext('webgl');
  const rm = new resMan.ResourceManager();

  var particles = new Map();

  // If we don't have a GL context, give up now
  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // compile and store shaders under the keys in arg 4
  rm.loadShader(gl, gl.VERTEX_SHADER, vsSource, 'vShader');
  rm.loadShader(gl, gl.FRAGMENT_SHADER, fsSource, 'fShader');
  // link the program with the compiled shaders by providing their key names
  const shaderProgram = rm.loadProgram(gl, 'vShader', 'fShader', 'shaderProgram');
  const sr = new sprRen.SpriteRenderer(shaderProgram, gl);
  sr.initBufferData(gl, shaderProgram)

  var then = 0;

  const gm = new game.Game(gl, sr, shaderProgram, rm, canvas);
  gm.init(particles);

  // Draw the scene repeatedly
  function renderLoop(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;

    if (70 >= Math.floor(1 / deltaTime)) {
      then = now;

      draw();

      gm.update(deltaTime, particles);

      gm.render(deltaTime, particles);

      document.getElementById('SelectionDisplay')
              .innerHTML = 'Particles: ' +
                          (particles.size - (2 * (window.width + window.height) / 5)) +
                          ' FPS: ' + Math.floor(1 / deltaTime);
    }
    requestAnimationFrame(renderLoop);
  }
  requestAnimationFrame(renderLoop);

  // canvas.addEventListener("mousedown", start);
  // canvas.addEventListener("mouseup", stop);

  var xPos; var yPos;
  var coord = { x: 0, y: 0 };
  var mouseIsDown = false;

  canvas.addEventListener('mousemove', function(event) {
    xPos = event.clientX - canvas.offsetLeft;
    yPos = event.clientY - canvas.offsetTop;
    xPos -= xPos % 5;        yPos -= yPos % 5;
    xPos = Math.floor(xPos); yPos = Math.floor(yPos);
    draw();
  }, false);

  canvas.onmousedown = function(event) {
      event.preventDefault();
      mouseIsDown = true;
      coord.x = event.clientX - canvas.offsetLeft;
      coord.y = event.clientY - canvas.offsetTop;
  }

  canvas.onmouseup = function() {
      mouseIsDown = false;
  }

  function draw() {
    if (mouseIsDown) {
      let hash = (xPos * 1000) + yPos;
      if (!particles.has(hash)) particles.set(hash, { x: xPos, y: yPos });
    }
  }
}