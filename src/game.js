export class Game {

    constructor(gl, sr, sp, rm, canvas) {
        this.gl = gl;
        this.sr = sr;
        this.sp = sp;
        this.rm = rm;
        this.canvas = canvas;
    }

    init(particles) {
        for (var x = 0; x <= window.width; x += 5) {
            particles.set(x * 1000, { x: x, y: 0, type: 1 });
            particles.set(x * 1000 + window.height, { x: x, y: window.height, type: 1 });
        }
        for (var y = 0; y <= window.height; y += 5) {
            particles.set(y, { x: 0, y: y, type: 1 });
            particles.set(window.width * 1000 + y, { x: window.width, y: y, type: 1 });
        }
    }

    update(dt, particles) {
        let stall = new Set();
        particles.forEach(function(value, k) {
            var key = k;
            var dx; var rand = Math.floor(Math.random() * 5);
            var dy = 5;
            
            if (rand == 4) dx = 5;
            else if (rand == 0) dx = -5;
            else dx = 0;

            if (
                !particles.has((value.x * 1000) + value.y + dy) &&
                value.type != 1 &&
                !stall.has(key)
            ) {
                particles.set(key + dy, { x: value.x, y: value.y + dy, type: 2 });
                stall.add(key + dy);
                particles.delete(k);
                key = k + dy;
            }
            if (
                !particles.has(((value.x + dx) * 1000) + value.y) &&
                value.type != 1 &&
                !stall.has(key)
            ) {
                particles.set(key + (1000 * dx), { x: value.x + dx, y: value.y, type: 2 });
                stall.add(key + (1000 * dx));
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