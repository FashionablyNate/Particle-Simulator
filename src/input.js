
export function mouse(canvas, particles, grid) {
    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mouseup", stop);

    var xPos; var yPos;
    var coord = { x: 0, y: 0 };

    function draw(event) {
        xPos = event.clientX - canvas.offsetLeft;
        yPos = event.clientY - canvas.offsetTop;
        xPos -= xPos % 5;        yPos -= yPos % 5;
        xPos = Math.floor(xPos); yPos = Math.floor(yPos);
    }

    function start(event) {
        canvas.addEventListener("mousemove", draw);
        reposition(event);
    }

    function stop() {
        canvas.removeEventListener("mousemove", draw);
    }

    function reposition(event) {
        coord.x = event.clientX - canvas.offsetLeft;
        coord.y = event.clientY - canvas.offsetTop;
    }

    return particles;
}