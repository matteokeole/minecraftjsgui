#version 300 es

layout(location = 0) in vec2 a_position;
layout(location = 1) in mat3 a_world;
layout(location = 4) in uint a_texture_index;
layout(location = 5) in mat3 a_texture;
layout(location = 8) in vec3 a_color_mask;
layout(location = 9) in float a_color_mask_weight;

uniform mat3 u_projection;

flat out uint v_texture_index;
out vec2 v_uv;
out vec3 v_color_mask;
out float v_color_mask_weight;

void main() {
	vec3 position = vec3(a_position, 1);

	gl_Position = vec4(u_projection * a_world * position, 1);

	v_texture_index = a_texture_index;
	v_uv = (a_texture * position).xy;
	v_color_mask = a_color_mask;
	v_color_mask_weight = a_color_mask_weight;
}