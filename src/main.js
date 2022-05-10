main();

import * as resMan from './resourceManager.js';
import * as sprRen from './spriteRenderer.js';
import * as game from './game.js';
import { vsSource, fsSource } from './shaderSource.js';

//
// Start here
//
function main() {

  var select = 'Particle';
  var color = vec3.fromValues(0.9, 0.9, 0.7);

  const canvas = document.querySelector('#glcanvas');
  window.width = canvas.width;
  window.height = canvas.height;
  window.particleSize = 3;
  window.targetFPS = 60;
  var dtMem = []; var avgDt;
  const gl = canvas.getContext('webgl', {antialias: false, depth: false});
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

    dtMem.push(deltaTime);

    if (dtMem.length > 100) dtMem.shift();
    avgDt = dtMem.reduce(function(total, num) {
      return total + num;
    }) / dtMem.length

    draw();

    gm.update(deltaTime, particles);

    gm.render(deltaTime, particles);

    document.getElementById('SelectionDisplay1')
            .innerHTML = 'Particles: ' +
                        (particles.size - (2 * (window.width + window.height) / window.particleSize)) +
                        ' FPS: ' + Math.floor(1 / avgDt);

    var fpsRatio = window.targetFPS / (1 / deltaTime);
    var speed = (fpsRatio == 0) ? 1 : fpsRatio;

    document.getElementById('SelectionDisplay2')
            .innerHTML = 'Selection: ' + select + ' Speed: ' + speed.toPrecision(1);
    
    requestAnimationFrame(renderLoop);
  }
  requestAnimationFrame(renderLoop);

  var xPos; var yPos;
  var coord = { x: 0, y: 0 };
  var mouseIsDown = false;

  canvas.addEventListener('mousemove', function(event) {
    xPos = event.clientX - canvas.offsetLeft;
    yPos = event.clientY - canvas.offsetTop;
    xPos -= xPos % window.particleSize; yPos -= yPos % window.particleSize;
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
      if (!particles.has(hash)) particles.set(hash, {
        x: xPos, y: yPos, type: select, color: color, matrix: false, lastMove: 0
      });
    }
  }

  window.addEventListener("keydown", onKeyDown, false);

  function KeyEvent(keyCode) {
      switch (keyCode) {
          case 69: //e
              select = 'Lava';
              color = vec3.fromValues(1.0, 0.6, 0.0);
              break;
          case 81: //q
              select = 'Particle';
              color = vec3.fromValues(0.9, 0.9, 0.7);
              break;
          case 87: //w
              select = 'Water';
              color = vec3.fromValues(0.1, 0.5, 1.0);
              break;
      }
  }

  function onKeyDown(event) {
      var keyCode = event.keyCode;
      KeyEvent(keyCode);
  }
}