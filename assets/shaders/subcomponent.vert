#version 300 es

layout(location = 0) in vec2 a_position;
layout(location = 1) in mat3 a_world;
layout(location = 4) in mat3 a_texture;
layout(location = 7) in uint a_index;

uniform mat3 u_projection;

flat out uint v_index;
out vec2 v_uv;

void main() {
	vec3 position = vec3(a_position, 1);

	gl_Position = vec4(u_projection * a_world * position, 1);

	v_index = a_index;
	v_uv = (a_texture * position).xy;
}