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
    then = now;

    gm.update(deltaTime, particles);

    gm.render(deltaTime, particles);

    document.getElementById('SelectionDisplay')
            .innerHTML = 'Particles: ' + (particles.size - 422) +
                         ' FPS: ' + Math.floor(1 / deltaTime);

    requestAnimationFrame(renderLoop);
  }
  requestAnimationFrame(renderLoop);

  canvas.addEventListener("mousedown", start);
  canvas.addEventListener("mouseup", stop);

  var xPos; var yPos;
  var coord = { x: 0, y: 0 };

  function draw(event) {
      xPos = event.clientX - canvas.offsetLeft;
      yPos = event.clientY - canvas.offsetTop;
      xPos -= xPos % 5;        yPos -= yPos % 5;
      xPos = Math.floor(xPos); yPos = Math.floor(yPos);

      let hash = (xPos * 1000) + yPos;

      if (!particles.has(hash)) particles.set(hash, { x: xPos, y: yPos });
  }

  function start(event) {
      canvas.addEventListener("mousemove", draw);
      reposition(event);
  }

  function stop() {
      canvas.removeEventListener("mousemove", draw);
  }

  function reposition(event) {
      coord.x = event.clientX - canvas.offsetLeft;
      coord.y = event.clientY - canvas.offsetTop;
  }
}