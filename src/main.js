main();

import * as resMan from './resourceManager.js';
import * as sprRen from './spriteRenderer.js';
import * as game from './game.js';
import { vsSource, fsSource } from './shaderSource.js';

//
// Start here
//
function main() {

  class Renderable extends ApeECS.Component {}
  Renderable.properties = {
    xPos: 0,
    yPos: 0,
    xSize: 0,
    ySize: 0
  }

  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl');
  const rm = new resMan.ResourceManager();

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
  const sr = new sprRen.SpriteRenderer(shaderProgram);
  const buffers = sr.initBufferData(gl)

  var then = 0;

  var world = new ApeECS.World({
    trackChanges: true,
    entityPool: 3,
    cleanupPools: true,
    useApeDestroy: true
  });
  world.registerComponent(Renderable);

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = function(ev) { click(ev, world) }

  const gm = new game.Game(gl, sr, buffers, shaderProgram, rm, canvas, world);

  // Draw the scene repeatedly
  function renderLoop(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    gm.update(deltaTime);

    gm.render(deltaTime);

    requestAnimationFrame(renderLoop);
  }
  requestAnimationFrame(renderLoop);
}

function click(ev, world) {
  world.createEntity({
    c: {
      Renderable: {
        xPos: ev.clientX - 11,
        yPos: ev.clientY - 12,
        xSize: 2,
        ySize: 2
      }
    }
  })
}