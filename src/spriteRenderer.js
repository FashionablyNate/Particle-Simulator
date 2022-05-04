export class SpriteRenderer {

    constructor(program) {
        this.program = program;
    }

    initBufferData(gl) {

        // Create a buffer for the square's positions.
        const positionBuffer = gl.createBuffer();

        // Select the positionBuffer as the one to apply buffer
        // operations to from here out.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Now create an array of positions for the square.
        const positions = [
            1.0,  1.0,
           -1.0,  1.0,
            1.0, -1.0,
           -1.0, -1.0,
        ];

        // Now pass the list of positions into WebGL to build the
        // shape. We do this by creating a Float32Array from the
        // JavaScript array, then use it to fill the current buffer.

        gl.bufferData(gl.ARRAY_BUFFER,
                      new Float32Array(positions),
                      gl.STATIC_DRAW);

        return {
            position: positionBuffer,
        };
    }

    drawSprite(gl, shaderProgram, buffers, position, size, color) {
        const projectionMatrix = mat4.create();

        // note: glmatrix.js always has the first argument
        // as the destination to receive the result.
        mat4.ortho(projectionMatrix, 0.0, 640, 480, 0.0, -1.0, 1.0);

        // Set the drawing position to the "identity" point, which is
        // the center of the scene.
        const modelViewMatrix = mat4.create();

        // Now move the drawing position a bit to where we want to
        // start drawing the square.
        mat4.translate(modelViewMatrix,
            modelViewMatrix,
            vec3.fromValues(position[0], position[1], 0));

        mat4.scale(modelViewMatrix,
                modelViewMatrix,
                vec3.fromValues(-0.5 * size[0], -0.5 * size[1], 0));

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
        shaderProgram.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
        gl.enableVertexAttribArray(
        shaderProgram.attribLocations.vertexPosition);
        }

        // Tell WebGL to use our program when drawing
        gl.useProgram(shaderProgram.program);

        // Set the shader uniforms

        gl.uniformMatrix4fv(
        shaderProgram.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
        gl.uniformMatrix4fv(
        shaderProgram.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);

        {
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
        }
    }
}