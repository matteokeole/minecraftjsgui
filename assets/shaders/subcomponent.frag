#version 300 es

precision mediump float;
precision mediump sampler2DArray;

flat in uint v_index;
in vec2 v_uv;

uniform sampler2DArray u_sampler;

out vec4 FragColor;

void main() {
	FragColor = texture(u_sampler, vec3(v_uv, v_index));
}