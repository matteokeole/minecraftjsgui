#version 300 es

layout(location = 0) in vec2 a_position;

uniform mat3 u_projectionMatrix;
uniform mat3 u_worldMatrix;
uniform mat3 u_textureMatrix;

out vec2 v_uv;

void main() {
	vec3 position = vec3(a_position, 1);

	gl_Position = vec4(u_projectionMatrix * u_worldMatrix * position, 1);

	v_uv = (u_textureMatrix * position).xy;
}