import * as resMan from './resourceManager.js';
import * as sprRen from './spriteRenderer.js';
import * as game from './game.js';
import { vsSource, fsSource } from './shaderSource.js';
import { vec3 } from 'gl-matrix';
import { createElement } from 'react';

//
// Start here
//
export function main() {

  if (document == null) { 
    return null;
  }

  var canvas = null;

  if (document.getElementById("glcanvas") == null) {
    return null;
  } else {
    canvas = document.getElementById("glcanvas");
  }

  var select = 'Particle';
  var color = vec3.fromValues(0.9, 0.9, 0.7);

  // const canvas = document.querySelector('glcanvas');
  window.width = canvas.width;
  window.height = canvas.height;
  window.particleSize = 5;
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

    gm.update(deltaTime, particles, avgDt);

    gm.render(deltaTime, particles);

    document.getElementById('SelectionDisplay1')
            .innerHTML = ' ' + (particles.size - (2 * (window.width + window.height) / window.particleSize));

    var fpsRatio = window.targetFPS / (1 / deltaTime);
    var speed = (fpsRatio == 0) ? 1 : fpsRatio;

    document.getElementById('SelectionDisplay2')
            .innerHTML = ' ' + Math.floor(1 / avgDt);

    document.getElementById('SelectionDisplay3')
            .innerHTML = ' ' + select;
    
    document.getElementById('SelectionDisplay4')
            .innerHTML = ' ' + speed.toPrecision(1);
    
    requestAnimationFrame(renderLoop);
  }
  requestAnimationFrame(renderLoop);

  var xPos; var yPos;
  var coord = { x: 0, y: 0 };
  var mouseIsDown = false;

  canvas.addEventListener('mousemove', function(event) {
    xPos = event.pageX - canvas.offsetLeft;
    yPos = event.pageY - canvas.offsetTop;
    xPos -= xPos % window.particleSize; yPos -= yPos % window.particleSize;
    xPos = Math.floor(xPos); yPos = Math.floor(yPos);
    draw();
  }, false);

  canvas.onmousedown = function(event) {
      event.preventDefault();
      mouseIsDown = true;
      coord.x = event.pageX - canvas.offsetLeft;
      coord.y = event.pageY - canvas.offsetTop;
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
          case 81: //q
              select = 'Particle';
              color = vec3.fromValues(0.9, 0.9, 0.7);
              break;
          case 87: //w
              select = 'Water';
              color = vec3.fromValues(0.1, 0.5, 1.0);
              break;
          case 69: //e
              select = 'Lava';
              color = vec3.fromValues(1.0, 0.6, 0.0);
              break;
          case 65: //a
              select = 'Steam';
              color = vec3.fromValues(0.7, 0.7, 0.7);
              break;
          case 83: //s
              select = 'Stone';
              color = vec3.fromValues(0.6, 0.6, 0.6);
              break;
      }
  }

  function onKeyDown(event) {
      var keyCode = event.keyCode;
      KeyEvent(keyCode);
  }

  document.getElementById("sand-select").addEventListener("click", sandSelect);
  function sandSelect() {
    select = 'Particle';
    color = vec3.fromValues(0.9, 0.9, 0.7);
  }

  document.getElementById("water-select").addEventListener("click", waterSelect);
  function waterSelect() {
    select = 'Water';
    color = vec3.fromValues(0.1, 0.5, 1.0);
  }

  document.getElementById("lava-select").addEventListener("click", lavaSelect);
  function lavaSelect() {
    select = 'Lava';
    color = vec3.fromValues(1.0, 0.6, 0.0);
  }

  document.getElementById("steam-select").addEventListener("click", steamSelect);
  function steamSelect() {
    select = 'Steam';
    color = vec3.fromValues(0.7, 0.7, 0.7);
  }

  document.getElementById("stone-select").addEventListener("click", stoneSelect);
  function stoneSelect() {
    select = 'Stone';
    color = vec3.fromValues(0.6, 0.6, 0.6);
  }

  return null;
}