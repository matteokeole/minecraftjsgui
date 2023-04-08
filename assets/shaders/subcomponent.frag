#version 300 es

#define NORMALIZE_HEX 1.0 / 255.0

precision mediump float;
precision mediump sampler2DArray;

flat in uint v_texture_index;
in vec2 v_uv;
in vec3 v_color_mask;
in float v_color_mask_weight;

uniform sampler2DArray u_sampler;

out vec4 FragColor;

void main() {
	vec4 texture = texture(u_sampler, vec3(v_uv, v_texture_index));
	vec3 color = mix(texture.rgb, v_color_mask * NORMALIZE_HEX, v_color_mask_weight);

	FragColor = vec4(color, texture.a);
}