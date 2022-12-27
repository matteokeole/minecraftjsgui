#version 300 es

layout(location = 0) in vec2 a_position;

out vec2 v_uv;

void main() {
	gl_Position = vec4(a_position, 0, 1);

	// @todo Find a better way to convert [-1, 1] to [0, 1]
	v_uv = clamp(a_position, vec2(0), vec2(1));
}