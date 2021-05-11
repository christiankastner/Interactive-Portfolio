varying vec2 vUv;
uniform sampler2D uImage;
uniform float u_time;
uniform vec2 u_resolution;
uniform float uScrollSpeed;

void main() {

    vec4 color = texture2D(uImage, vUv + .003 * uScrollSpeed);
    vec4 color2 = texture2D(uImage, vUv);
    vec4 color3 = texture2D(uImage, vUv + - .003 * uScrollSpeed);
    color.g = .0;
    color.b = 0.;
    color3.g = 0.;
    color3.r = 0.;

    vec4 finalColor = vec4(max(color.r, color2.r), max(color.g, color2.g), max(color.b, color2.b), max(color.a, color2.a));
    finalColor = vec4(max(finalColor.r, color3.r), max(finalColor.g, color3.g), max(finalColor.b, color3.b), max(finalColor.a, color3.a));

    gl_FragColor = vec4(finalColor);
}