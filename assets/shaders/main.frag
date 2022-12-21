#version 300 es

precision mediump float;

in vec2 v_uv;

// @todo replace with a texture array
uniform sampler2D u_texture;

out vec4 FragColor;

void main() {
	FragColor = texture(u_texture, v_uv);
}