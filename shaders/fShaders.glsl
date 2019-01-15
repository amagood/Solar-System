precision mediump float;

// Note that the following are interpolated between vertices.
varying vec4 fPosition;
varying vec4 fPosition_weed;
varying vec4 fColor;  
varying vec4 fNormal;
varying vec2 fTexCoord;

uniform sampler2D texture;

uniform mat4 modelingMatrix;
uniform mat4 viewingMatrix;
uniform mat4 projectionMatrix;
uniform vec4 eyePosition;
uniform vec4 lightPosition;
uniform vec4 materialAmbient;
uniform vec4 materialDiffuse;
uniform vec4 materialSpecular;
uniform float shininess;

uniform float enable_light;
uniform float enable_shadow;


//FXAA Learnded form Armin Ronacher
#define FXAA_REDUCE_MIN   (1.0/ 128.0)
#define FXAA_REDUCE_MUL   (1.0 / 8.0)
#define FXAA_SPAN_MAX     8.0

vec4 applyFXAA(vec2 fragCoord, sampler2D tex)
{
    vec4 color;
    vec2 inverseVP = vec2(1.0 / fragCoord.x, 1.0 / fragCoord.y);
    vec3 rgbNW = texture2D(tex, (fragCoord + vec2(-1.0, -1.0)) * inverseVP).xyz;
    vec3 rgbNE = texture2D(tex, (fragCoord + vec2(1.0, -1.0)) * inverseVP).xyz;
    vec3 rgbSW = texture2D(tex, (fragCoord + vec2(-1.0, 1.0)) * inverseVP).xyz;
    vec3 rgbSE = texture2D(tex, (fragCoord + vec2(1.0, 1.0)) * inverseVP).xyz;
    vec3 rgbM  = texture2D(tex, fragCoord  * inverseVP).xyz;
    vec3 luma = vec3(0.299, 0.587, 0.114);
    float lumaNW = dot(rgbNW, luma);
    float lumaNE = dot(rgbNE, luma);
    float lumaSW = dot(rgbSW, luma);
    float lumaSE = dot(rgbSE, luma);
    float lumaM  = dot(rgbM,  luma);
    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));
    vec2 dir;
    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));
    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *
                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);
    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);
    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),
              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),
              dir * rcpDirMin)) * inverseVP;
    vec3 rgbA = 0.5 * (
        texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +
        texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);
    vec3 rgbB = rgbA * 0.5 + 0.25 * (
        texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +
        texture2D(tex, fragCoord * inverseVP + dir * 0.5).xyz);
    float lumaB = dot(rgbB, luma);
    if ((lumaB < lumaMin) || (lumaB > lumaMax))
        color = vec4(rgbA, 1.0);
    else
        color = vec4(rgbB, 1.0);
    return color;
}

void main()
{
    vec4 L;
    if(enable_light > 0.0)
    {
        L = normalize( lightPosition - fPosition ); // Light vector
    }
    else
    {
        L = -3.0*normalize( fPosition ); // Light vector
    }

    //vec4 L = -2.0*normalize( fPosition ); // Light vector
    //vec4 L = normalize( lightPosition - fPosition ); // Light vector
    //vec4 L = -normalize( lightPosition - fPosition ); // Light vector
    vec4 N = fNormal;   // Normal vector
    vec4 V = normalize( eyePosition - fPosition );      // Eye vector.
    vec4 H = normalize( L + V );  // Halfway vector in the modified Phong model

    // Normal variation stored in the texture is within [0,1]. Convert it to [-1, 1]
    vec4 texel = texture2D( texture, fTexCoord ) * 2.0 - 1.0;
    
    // *** Lab Exercise 2: How do you modify N here?
    //...
    //N.xyz += texel.xyz;
    
    // Make sure N is normalized.
    N = normalize( N );
    
    // Compute terms in the illumination equation
    vec4 ambient = materialAmbient;

    float Kd1 = max( dot(L, N), 0.0 );
    //float Kd = pow(clamp( dot(V, N), 0.0 ,1.0),10.0);//正常
    //float Kd = pow(clamp( dot(V, N), 0.0 ,1.0),5.0*(sin(fPosition_weed.y*3.14)+1.0));//zooming
    float Kd = pow(clamp( dot(V, N), 0.0 ,1.0),10.0*(sin((fPosition_weed.y*50.0*3.14+1.0+(sin((fPosition_weed.x)*50.0*3.14)+1.0)))));//weed
    vec4  diffuse = Kd1 * materialDiffuse;

    float Ks = pow( max(dot(N, H), 0.0), shininess );
    vec4  specular = Ks * materialSpecular;
    vec4 black = vec4(0.0,0.0,0.0,1.0);
    // *** Lab Exercise 2: You will need to change the next line too.
    //gl_FragColor = (ambient + diffuse) * texture2D( texture, fTexCoord );
    
    //gl_FragColor = Kd*((diffuse)*texture2D( texture, fTexCoord ))+ specular+(1.0-Kd)*black;// * fColor;//漸層
    //gl_FragColor = (ambient + diffuse + specular)*texture2D( texture, fTexCoord );// * fColor;
    //gl_FragColor = texture2D( texture, fTexCoord );// * fColor;
    //gl_FragColor = (ambient + diffuse + specular) * fColor;

    if(enable_shadow > 0.0)
    {
        gl_FragColor = texture2D( texture, fTexCoord );// * fColor;
    }
    else
    {
        gl_FragColor = (ambient + diffuse + specular)*texture2D( texture, fTexCoord );// * fColor;
    }
	gl_FragColor.a*=fColor.a;
	//gl_FragColor=applyFXAA(fTexCoord,texture);
}