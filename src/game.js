export class Game {

    constructor(gl, sr, buff, sp, rm, canvas, world) {
        this.gl = gl;
        this.sr = sr;
        this.buff = buff;
        this.sp = sp;
        this.rm = rm;
        this.canvas = canvas;
        this.world = world;
    }

    update(dt) {
        this.world.tick();
    }

    render(dt) {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        this.gl.clearDepth(1.0);                 // Clear everything
        this.gl.enable(this.gl.DEPTH_TEST);           // Enable depth testing
        this.gl.depthFunc(this.gl.LEQUAL);            // Near things obscure far things

        // Clear the canvas before we start drawing on it.
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        const Renderables = this.world.getEntities('Renderable');

        let sprRen = this.sr;
        let gl = this.gl;
        let sp = this.sp;
        let buff = this.buff;

        Renderables.forEach(function(entity) {
            let yPos = entity.c.Renderable.yPos;
            yPos = (yPos < 479) ? yPos + dt * 100 : 479;
            entity.c.Renderable.yPos = yPos;
            sprRen.drawSprite(gl,
                sp,
                buff,
                vec2.fromValues(entity.c.Renderable.xPos, entity.c.Renderable.yPos),
                vec2.fromValues(entity.c.Renderable.xSize, entity.c.Renderable.ySize),
                vec3.fromValues(1.0, 1.0, 1.0));
        })
    }
}