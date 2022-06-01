export const vsSource = 
`
attribute vec4 aVertexPosition;

uniform mat4 uModelViewMatrix;

uniform mat4 uProjectionMatrix;
void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}
`

export const fsSource = 
`
precision mediump float;

uniform vec4 spriteColor;

void main() {
  gl_FragColor = vec4(spriteColor.x, spriteColor.y, spriteColor.z, spriteColor.w);
}
`
                        