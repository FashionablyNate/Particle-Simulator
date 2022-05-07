import { adjustVelocity } from './collision.js';

export class Game {

    constructor(gl, sr, sp, rm, canvas) {
        this.gl = gl;
        this.sr = sr;
        this.sp = sp;
        this.rm = rm;
        this.canvas = canvas;
    }

    init(particles) {
        for (var x = 0; x <= window.width; x += window.particleSize) {
            particles.set(x * 1000, { x: x, y: 0, type: 1 });
            particles.set(x * 1000 + window.height, { x: x, y: window.height, type: 1,
                color: vec3.fromValues(1.0, 1.0, 1.0) });
        }
        for (var y = 0; y <= window.height; y += window.particleSize) {
            particles.set(y, { x: 0, y: y, type: 1 });
            particles.set(window.width * 1000 + y, { x: window.width, y: y, type: 1,
                color: vec3.fromValues(1.0, 1.0, 1.0) });
        }
    }

    update(dt, particles) {
        let stall = new Set();
        particles.forEach(function(value, key) {
            var pdx = 0; var pdy = 0;
            var rand = Math.floor(Math.random() * 4);

            switch (value.type) {
                case 'Border': // border
                    break;

                case 'Particle': // particle
                    pdy = window.particleSize;
                    break;

                case 'Water': // water
                    if (rand == 3) pdx = window.particleSize;
                    else if (rand == 0) pdx = -1 * window.particleSize;
                    else pdx = 0;
                    pdy = window.particleSize;
                    break;
            }

            var fpsRatio = Math.floor(window.targetFPS / (1 / dt));
            var speed = (fpsRatio == 0) ? 1 : fpsRatio;
            pdx *= speed; pdy *= speed;

            var dx = (pdx != 0) ? adjustVelocity(dx, pdx, particles, key, true) : 0;
            var dy = (pdy != 0) ? adjustVelocity(dy, pdy, particles, key, false) : 0;
            if (dy != 0 || dx != 0) {
                if (
                    !particles.has(((value.x + dx) * 1000) + value.y + dy) &&
                    !stall.has(key)
                ) {
                    if (value.y + dy > window.height || value.y < 0 ||
                        value.x + dx > window.width  || value.x < 0) {
                        particles.delete(key);
                    } else {
                        particles.set(((value.x + dx) * 1000) + value.y + dy, {
                            x: value.x + dx,
                            y: value.y + dy,
                            type: value.type,
                            color: value.color
                        });
                        stall.add(((value.x + dx) * 1000) + value.y + dy);
                        particles.delete(key);
                    }
                }
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
            if (!value.color) {
                value.color = vec3.fromValues(1.0, 1.0, 1.0);
            }
            sprRen.drawSprite(gl,
                              sp,
                              vec2.fromValues(value.x, value.y),
                              vec2.fromValues(window.particleSize, window.particleSize),
                              value.color); 
        });
    }
}