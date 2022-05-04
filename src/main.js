main();

import * as resMan from './resourceManager.js';
import * as sprRen from './spriteRenderer.js';
import { vsSource, fsSource } from './shaderSource.js';

let height = 100;

//
// Start here
//
function main() {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl');
  let rm = new resMan.ResourceManager();

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
  let sr = new sprRen.SpriteRenderer(shaderProgram);
  const buffers = sr.initBufferData(gl)

  var then = 0;

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    drawScene(gl, shaderProgram, buffers, sr, deltaTime);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

//
// Draw the scene.
//
function drawScene(gl, shaderProgram, buffers, sr, dt) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  height += dt * 30
  
  sr.drawSprite(gl,
                shaderProgram,
                buffers,
                vec2.fromValues(100, height),
                vec2.fromValues(10, 10), 
                vec3.fromValues(1.0, 1.0, 1.0));

  sr.drawSprite(gl,
                shaderProgram,
                buffers,
                vec2.fromValues(200, height),
                vec2.fromValues(10, 10), 
                vec3.fromValues(1.0, 1.0, 1.0));

}