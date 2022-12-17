#version 300 es

layout(location = 0) in vec2 a_position;

uniform mat3 u_matrix;
uniform mat3 u_textureMatrix;

out vec2 v_uv;

void main() {
	gl_Position = vec4(a_position, 0, 1);
	// vec3 position = vec3(a_position, 1);

	// gl_Position = vec4(u_matrix * position, 1);

	// v_uv = (u_textureMatrix * position).xy;
}