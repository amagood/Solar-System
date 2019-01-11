precision mediump float;

varying vec4 fPosition;
varying vec4 fColor;  // Note that this will be interpolated between vertices.
varying vec4 fNormal;

uniform mat4 modelingMatrix;
uniform mat4 viewingMatrix;
uniform mat4 projectionMatrix;
uniform vec4 eyePosition;
uniform vec4 lightPosition;
uniform vec4 materialAmbient;
uniform vec4 materialDiffuse;
uniform vec4 materialSpecular;
uniform float shininess;

varying vec2 fTexCoord;

uniform sampler2D texture;

void main()
{
    vec4 L = normalize( lightPosition - fPosition ); // Light vector
    vec4 N = fNormal;	// Normal vector
	vec4 V = normalize( eyePosition - fPosition );		// Eye vector.
    vec4 H = normalize( L + V );  // Halfway vector in the modified Phong model

	N.w = 0.0;
	N = normalize(N);
	
    // Compute terms in the illumination equation
    vec4 ambient = materialAmbient;

    float Kd = max( dot(L, N), 0.0 );
    vec4  diffuse = Kd * materialDiffuse;

	float Ks = pow( max(dot(N, H), 0.0), shininess );
    vec4  specular = Ks * materialSpecular;

	// Ignoring fColor for objects that have no color attributes
    gl_FragColor = (ambient + diffuse)*texture2D( texture, fTexCoord ) + specular;
}