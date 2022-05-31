import * as resMan from './resourceManager.js';
import * as sprRen from './spriteRenderer.js';
import * as game from './game.js';
import { vsSource, fsSource } from './shaderSource.js';
import { vec2, vec3 } from 'gl-matrix';
import * as types from './types.json';


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

  var select = 'Sand';
  var size = 1;

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
            .innerHTML = ' ' + (particles.size);

    var fpsRatio = window.targetFPS / (1 / deltaTime);
    var speed = (fpsRatio == 0) ? 1 : fpsRatio;

    document.getElementById('SelectionDisplay2')
            .innerHTML = ' ' + Math.floor(1 / avgDt);

    document.getElementById('SelectionDisplay3')
            .innerHTML = ' ' + select;
    
    document.getElementById('SelectionDisplay4')
            .innerHTML = ' ' + size;

    document.getElementById('SelectionDisplay5')
            .innerHTML = ' ' + xPos;

    document.getElementById('SelectionDisplay6')
            .innerHTML = ' ' + yPos;
    
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
      var hash = (xPos * 1000) + yPos;
      if (select !== 'Erase') {        
        if (size == 1) {
          if (!particles.has(hash)) particles.set(hash, {
            x: xPos, y: yPos, type: select, matrix: false, lastMove: 0, size: 1
          });
        } else {
          var offset = Math.ceil(size / 2) - 1;
          offset *= window.particleSize;
          for (var x = xPos - offset; x < xPos + (window.particleSize * size) - offset; x += window.particleSize) {
            for (var y = yPos - offset; y < yPos + (window.particleSize * size) - offset; y += window.particleSize) {
              hash = (x * 1000) + y;
              if (
                !particles.has(hash) &&
                (hash < (window.width * 1000) + window.particleSize) &&
                (hash > window.particleSize * 1000) &&
                ((hash - (x * 1000)) < window.height - window.particleSize) &&
                ((hash - (x * 1000)) > window.particleSize)
              ) {
                particles.set(hash, {
                  x: x, y: y, type: select, matrix: false, lastMove: 0, size: 1
                });
              }
            }
          }
        }
      } else {
        var offset = Math.ceil(size / 2) - 1;
          offset *= window.particleSize;
          for (var x = xPos - offset; x < xPos + (window.particleSize * size) - offset; x += window.particleSize) {
            for (var y = yPos - offset; y < yPos + (window.particleSize * size) - offset; y += window.particleSize) {
              hash = (x * 1000) + y;
              if (particles.has(hash)) {
                particles.delete(hash);
              }
            }
          }
      }
    }
    if (size % 2 == 0) {
      particles.set(999999, {
        x: xPos + (window.particleSize - 2), y: yPos + (window.particleSize - 2), type: 'Pointer', matrix: false, lastMove: 0, size: size
      });
    } else {
      particles.set(999999, {
        x: xPos, y: yPos, type: 'Pointer', matrix: false, lastMove: 0, size: size
      });
    }
  }

  window.addEventListener("keydown", onKeyDown, false);

  function KeyEvent(keyCode) {
      switch (keyCode) {
          case 81: //q
              select = 'Sand';
              break;
          case 87: //w
              select = 'Water';
              break;
          case 69: //e
              select = 'Lava';
              break;
          case 65: //a
              select = 'Steam';
              break;
          case 83: //s
              select = 'Stone';
              break;
          case 68: //d
              select = 'Border';
              break;
          case 88: //x
              select = 'Erase';
              break;
          case 49: //1
              if (size > 1) {
                size -= 1;
              }
              break;
          case 50: //2
              size += 1;
              break;
      }
  }

  function onKeyDown(event) {
      var keyCode = event.keyCode;
      KeyEvent(keyCode);
  }

  document.getElementById("eraser").addEventListener("click", eraser);
  function eraser() {
    select = 'Erase';
  }

  document.getElementById("brush-decrease").addEventListener("click", brushDecrease);
  function brushDecrease() {
    if (size > 1) {
      size -= 1;
    }
  }

  document.getElementById("brush-increase").addEventListener("click", brushIncrease);
  function brushIncrease() {
    size += 1;
  }

  document.getElementById("sand-select").addEventListener("click", sandSelect);
  function sandSelect() {
    select = 'Sand';
  }

  document.getElementById("water-select").addEventListener("click", waterSelect);
  function waterSelect() {
    select = 'Water';
  }

  document.getElementById("lava-select").addEventListener("click", lavaSelect);
  function lavaSelect() {
    select = 'Lava';
  }

  document.getElementById("steam-select").addEventListener("click", steamSelect);
  function steamSelect() {
    select = 'Steam';
  }

  document.getElementById("stone-select").addEventListener("click", stoneSelect);
  function stoneSelect() {
    select = 'Stone';
  }

  document.getElementById("border-select").addEventListener("click", borderSelect);
  function borderSelect() {
    select = 'Border';
  }

  return null;
}