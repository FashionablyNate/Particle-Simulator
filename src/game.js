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
            particles.set(x * 1000 + window.height, { x: x, y: window.height, type: 1 });
        }
        for (var y = 0; y <= window.height; y += window.particleSize) {
            particles.set(y, { x: 0, y: y, type: 1 });
            particles.set(window.width * 1000 + y, { x: window.width, y: y, type: 1 });
        }
    }

    update(dt, particles) {
        let stall = new Set();
        particles.forEach(function(value, k) {
            var key = k;
            var pdx = 0; var pdy = 0;
            var dx = 0; var dy = 0;
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

            dy = (pdy != 0) ? adjustVelocity(dy, pdy, particles, key, false) : 0;
            if (dy != 0) {
                if (
                    !particles.has((value.x * 1000) + value.y + dy) &&
                    !stall.has(key)
                ) {
                    if (value.y + dy > window.height || value.y < 0) {
                        particles.delete(k);
                    } else {
                        particles.set(key + dy, { x: value.x, y: value.y + dy, type: value.type });
                        stall.add(key + dy);
                        particles.delete(k);
                        key = k + dy;
                    }
                }
            }

            dx = (pdx != 0) ? adjustVelocity(dx, pdx, particles, key, true) : 0;
            if (dx != 0) {
                if (
                    !particles.has(((value.x + dx) * 1000) + value.y) &&
                    !stall.has(key)
                ) {
                    if (value.x + dx > window.width || value.x < 0) {
                        particles.delete(k);
                    } else {
                        particles.set(key + (1000 * dx), { x: value.x + dx, y: value.y, type: value.type });
                        stall.add(key + (1000 * dx));
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
            var color = vec3.fromValues(1.0, 1.0, 1.0);
            switch (value.type) {
                case "Border":
                    color = vec3.fromValues(0.4, 0.4, 0.4);
                    break;
                
                case "Particle":
                    color = vec3.fromValues(0.9, 0.9, 0.7);
                    break;
                
                case "Water":
                    color = vec3.fromValues(0.0, 0.3, 1.0);
                    break;
            }
            sprRen.drawSprite(gl,
                              sp,
                              vec2.fromValues(value.x, value.y),
                              vec2.fromValues(window.particleSize, window.particleSize),
                              color); 
        });
    }
}