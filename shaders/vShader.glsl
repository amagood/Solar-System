precision mediump float;

attribute vec4 vPosition;
attribute vec4 vColor;
attribute vec4 vNormal;
attribute vec2 vTexCoord;

varying vec4 fPosition;
varying vec4 fPosition_weed;
varying vec4 fColor;
varying vec4 fNormal;
varying vec2 fTexCoord;

uniform mat4 modelingMatrix;
uniform mat4 viewingMatrix;
uniform mat4 projectionMatrix;
uniform float colorch;

void main()
{
    vec4 N = normalize( modelingMatrix * vNormal ); // Normal vector
    //vec4 vColor = vec4(cos(colorch),sin(colorch),1.0-cos(colorch),1.0);
    fPosition = modelingMatrix * vPosition;
    fPosition_weed = vPosition;
    fColor = vColor;
    fNormal = N;
    fTexCoord = vTexCoord;
    vec4 just_weed = projectionMatrix * viewingMatrix * modelingMatrix * vPosition;
    //just_weed.x += sin((vPosition.y+1.0)*3.14*10.0);
    //just_weed.y += 0.05*sin((vPosition.y+1.0)*3.14*10.0);//explode
    gl_Position = just_weed;
}