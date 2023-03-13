#version 300 es

precision mediump float;

const vec2 TEXTURE_SIZE = vec2(256);
const vec2 TEXTURE_UV = vec2(200, 150);

in vec2 v_uv;

uniform sampler2D u_sampler;
uniform vec2 u_viewport;

out vec4 FragColor;

void main() {
	vec2 uv = v_uv * u_viewport;

	if (v_uv.x > .5) uv.x += TEXTURE_UV.x - u_viewport.x;
	uv.y += TEXTURE_UV.y;

	FragColor = texture(u_sampler, uv / TEXTURE_SIZE);
}