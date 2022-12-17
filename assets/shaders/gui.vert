#version 300 es

layout(location = 0) in vec2 a_position;

// uniform vec2 u_resolution;

out vec2 v_uv;

void main() {
	// vec2 position = a_position / u_resolution;
	gl_Position = vec4(a_position, 0, 1);

	// gl_Position = vec4(position, 0, 1);

	// v_uv = clamp(a_position, vec2(0), vec2(1));
	v_uv = a_position;
}