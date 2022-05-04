
export class ResourceManager {
    
    constructor() {
        this.shaders = new Map();
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
}

export function hello() {
    return "Hello World";
}