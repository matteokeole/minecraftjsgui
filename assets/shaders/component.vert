#version 300 es

layout(location = 0) in vec2 a_position;
layout(location = 1) in mat3 a_world;
layout(location = 4) in mat3 a_texture;
layout(location = 7) in float a_layer;

uniform mat3 u_projection;

out float v_layer;
out vec2 v_uv;

void main() {
	vec3 position = vec3(a_position, 1);

	gl_Position = vec4(u_projection * a_world * position, 1);

	v_layer = a_layer;
	v_uv = (a_texture * position).xy;
}