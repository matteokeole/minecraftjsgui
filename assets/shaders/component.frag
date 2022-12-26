#version 300 es

precision mediump float;
precision mediump sampler2DArray;

in vec2 v_uv;

uniform sampler2DArray u_textures;

out vec4 FragColor;

void main() {
	FragColor = vec4(1, .2, 0, 1);
	// FragColor = texture(u_textures, vec3(v_uv, 0));
}