#version 300 es

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
	vec3 color = mix(texture.rgb, v_color_mask / 255.0, v_color_mask_weight);

	FragColor = vec4(color, texture.a);
}