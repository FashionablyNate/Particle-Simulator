
export class ResourceManager {
    
    constructor() {
        this.shaders = new Map();
        this.programs = new Map();
    };

    // creates a shader of the given type, uploads the source and compiles it.
    loadShader(gl, type, source, name) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('An error occurred while compiling shaders: ' +
                gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null
        }
        this.shaders.set(name, shader);
        return shader;
    }

    getShader(name) {
        return this.shaders.get(name);
    }

    loadProgram(gl, vsName, fsName, name) {
        const shaderProgram = gl.createProgram();

        const vShader = getShader('vsName');
        const fShader = getShader('fsName');

        gl.attachShader(shaderProgram, vShader);
        gl.attachShader(shaderProgram, fShader);

        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert('Unable to initialize the shader program: ' + gl.getShaderInfoLog(shaderProgram));
            return null;
        }

        // Collect all the info needed to use the shader program.
        // Look up which attribute our shader program is using
        // for aVertexPosition and look up uniform locations.
        const programInfo = {
            program: shaderProgram,
            attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            },
            uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            },
        };

        this.programs.set(name, programInfo);
        return programInfo;
    }

    getProgram(name) {
        return this.programs.get(name);
    }
}

export function hello() {
    return "Hello World";
}