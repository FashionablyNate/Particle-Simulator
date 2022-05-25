import { mat4, vec3 } from 'gl-matrix';

export class SpriteRenderer {

    constructor(program, gl) {
        this.program = program;
        const projectionMatrix = mat4.create();

        // note: glmatrix.js always has the first argument
        // as the destination to receive the result.
        mat4.ortho(projectionMatrix, 0.0, window.width, window.height, 0.0, -1.0, 1.0);
        this.projectionMatrix = projectionMatrix;

        this.colorUniform = gl.getUniformLocation(this.program.program, 'spriteColor')

        this.lastColor = vec3.fromValues(0.0, 0.0, 0.0);
    }

    initBufferData(gl, shaderProgram) {
        
        // Now create an array of positions for the square.
        const positions = [
            1.0,  1.0,
           -1.0,  1.0,
            1.0, -1.0,
           -1.0, -1.0,
        ];

        // Create a buffer for the square's positions.
        const positionBuffer = gl.createBuffer();

        // Select the positionBuffer as the one to apply buffer
        // operations to from here out.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Now pass the list of positions into WebGL to build the
        // shape. We do this by creating a Float32Array from the
        // JavaScript array, then use it to fill the current buffer.
        gl.bufferData(gl.ARRAY_BUFFER,
                      new Float32Array(positions),
                      gl.STATIC_DRAW);

        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;

        gl.vertexAttribPointer(
        shaderProgram.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);

        gl.enableVertexAttribArray(
        shaderProgram.attribLocations.vertexPosition);

        // Tell WebGL to use our program when drawing
        gl.useProgram(shaderProgram.program);

        // Set the shader uniforms
        gl.uniformMatrix4fv(
            shaderProgram.uniformLocations.projectionMatrix,
            false,
            this.projectionMatrix
        );
    }

    drawSprite(gl, shaderProgram, value, size) {

        if (!value.matrix) {
            value.matrix = mat4.create();
            // Now move the drawing position a bit to where we want to
            // start drawing the square.
            mat4.translate(value.matrix,
                        value.matrix,
                        vec3.fromValues(value.x, value.y, 0));

            mat4.scale(value.matrix,
                    value.matrix,
                    vec3.fromValues(-0.5 * size[0], -0.5 * size[1], 0));
        }

        gl.uniformMatrix4fv(
            shaderProgram.uniformLocations.modelViewMatrix,
            false,
            value.matrix
        );

        if (value.color[0] != this.lastColor[0] || value.color[1] != this.lastColor[1] ||
            value.color[2] != this.lastColor[2]) {
            gl.uniform3f(
                this.colorUniform,
                value.color[0], value.color[1], value.color[2]
            );
        }

        {
            const offset = 0;
            const vertexCount = 4;
            gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
        }
        this.lastColor = value.color;
    }
}