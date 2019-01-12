precision mediump float;

attribute vec4 vPosition;
attribute vec4 vColor;
attribute vec4 vNormal;
attribute vec2 vTexCoord;

varying vec4 fPosition;
varying vec4 fColor;
varying vec2 fTexCoord;
varying vec4 fNormal;

uniform mat4 modelingMatrix;
uniform mat4 viewingMatrix;
uniform mat4 projectionMatrix;



//uniform float rt_w; // GeeXLab built-in
//uniform float rt_h; // GeeXLab built-in

void main()
{
    vec4 N = normalize( modelingMatrix * vNormal );	// Normal vector

	fPosition = modelingMatrix * vPosition;
    fColor = vColor;
	fNormal = N;
	fTexCoord = vTexCoord;
    gl_Position = projectionMatrix * viewingMatrix * modelingMatrix * vPosition;
}