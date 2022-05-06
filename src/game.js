export class Game {

    constructor(gl, sr, sp, rm, canvas) {
        this.gl = gl;
        this.sr = sr;
        this.sp = sp;
        this.rm = rm;
        this.canvas = canvas;
    }

    init(particles) {
        for (var x = 0; x <= 600; x += 5) {
            particles.set(x * 1000, { x: x, y: 0, type: 1 });
            particles.set(x * 1000 + 450, { x: x, y: 450, type: 1 });
        }
        for (var y = 0; y <= 450; y += 5) {
            particles.set(y, { x: 0, y: y, type: 1 });
            particles.set(x * 1000 + y, { x: 600, y: y, type: 1 });
        }
    }

    update(dt, particles) {
        let stall = new Set();
        particles.forEach(function(value, key) {
            if (
                !particles.has((value.x * 1000) + value.y + 5) &&
                value.type != 1 &&
                !stall.has(key)
            ) {
                particles.set(key + 5, { x: value.x, y: value.y + 5, type: 2 });
                stall.add(key + 5);
                particles.delete(key);
            }
        });
    }

    render(dt, particles) {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        this.gl.clearDepth(1.0);                 // Clear everything
        this.gl.enable(this.gl.DEPTH_TEST);           // Enable depth testing
        this.gl.depthFunc(this.gl.LEQUAL);            // Near things obscure far things

        // Clear the canvas before we start drawing on it.
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        let sprRen = this.sr;
        let gl = this.gl;
        let sp = this.sp;
        
        particles.forEach(function(value, key) {
            let color = (value.type == 1) ?
                vec3.fromValues(0.4, 0.4, 0.4) : vec3.fromValues(0.0, 0.3, 1.0);
            sprRen.drawSprite(gl,
                              sp,
                              vec2.fromValues(value.x, value.y),
                              vec2.fromValues(5, 5),
                              color); 
        });
    }
}