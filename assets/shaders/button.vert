#version 300 es

layout(location = 0) in vec2 a_position;

out vec2 v_uv;

void main() {
	gl_Position = vec4(a_position * 2.0 - 1.0, 0, 1);

	v_uv = a_position;
}