var gl;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];
var paused = 0;
var depthTest = 1;

var width,height;
// event handlers for mouse input (borrowed from "Learning WebGL" lesson 11)
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

var moonRotationMatrix = mat4();

function handleMouseDown(event) {
    mouseDown = true;
    lastMouseX = event.clientX;
	lastMouseY = event.clientY;
}

function handleMouseUp(event) {
    mouseDown = false;
}

function handleMouseMove(event) {
   if (!mouseDown) {
      return;
    }

    var newX = event.clientX;
    var newY = event.clientY;
    var deltaX = newX - lastMouseX;
    

    var deltaY = newY - lastMouseY;
    

    materialShininess-=deltaY/50.0;
	if(materialShininess >= 40.0)
		materialShininess=40.0;
	else if(materialShininess <= 1.0)
		materialShininess=1.0;
	console.log(materialShininess);

    lastMouseX = newX
    lastMouseY = newY;
}

// event handlers for button clicks
function rotateX() {
	paused = 0;
    axis = xAxis;
};
function rotateY() {
	paused = 0;
	axis = yAxis;
};
function rotateZ() {
	paused = 0;
	axis = zAxis;
};

function unitize(vertices)
{
	var maxCorner = vertices[0];
	var minCorner = vertices[0];
	var center = vertices[0];
 
	for (i = 1; i < vertices.length; i++) { 
		maxCorner = Math.max(vertices[i], maxCorner);
		minCorner = Math.min(vertices[i], minCorner);
	}
	for (j=0; j<3; j++) {
		center = (maxCorner+minCorner)/2.0;
	}
		
	for (i = 0; i < vertices.length; i++) { 
		vertices[i] = (vertices[i] - center) * 2.0 / (maxCorner - minCorner);
	}		
}


var texture;
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];
// ModelView and Projection matrices
var modelingLoc, viewingLoc, projectionLoc,shininessLoc;
var modeling, viewing, projection;

var eyePosition   = vec4( 0.0, 0.0, 2.0, 1.0 );
var lightPosition = vec4( 10.0, 10.0, 20.0, 1.0 );

var materialAmbient = vec4( 0.25, 0.25, 0.25, 1.0 );
var materialDiffuse = vec4( 0.8, 0.8, 0.7, 1.0);
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 30.0;


function configureTexture( image ) {
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, 
         gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

//var testObject = new cube();
//var testObject = new ring();
//var testObject = new uvSphere();
//var testObject = new uvTorus();
//var testObject = new uvCylinder();
//var testObject = new uvCone();
var testObject = teapotModel; unitize(testObject.vertexPositions); // Make teapot unit sized

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // vertex array attribute buffer
    	
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(testObject.vertexPositions), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // color array atrribute buffer	
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
	// Using the normal vectors as colors because the objects don't have colors assigned. 
    gl.bufferData( gl.ARRAY_BUFFER, flatten(testObject.vertexNormals), gl.STATIC_DRAW ); 

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    // normal array atrribute buffer

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(testObject.vertexNormals), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );
	
    // index buffer

	var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, testObject.indices, gl.STATIC_DRAW);
	
	var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(testObject.vertexTextureCoords), gl.STATIC_DRAW );
	
	var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );
	
	var image = new Image();
    image.onload = function() { 
        configureTexture( image );
    }
    image.src = "rimuruSTUNUM.gif";
    

	// uniform variables in shaders
    modelingLoc   = gl.getUniformLocation(program, "modelingMatrix"); 
    viewingLoc    = gl.getUniformLocation(program, "viewingMatrix"); 
    projectionLoc = gl.getUniformLocation(program, "projectionMatrix"); 

    gl.uniform4fv( gl.getUniformLocation(program, "eyePosition"), 
       flatten(eyePosition) );
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"), 
       flatten(lightPosition) );
    gl.uniform4fv( gl.getUniformLocation(program, "materialAmbient"),
       flatten(materialAmbient));
    gl.uniform4fv( gl.getUniformLocation(program, "materialDiffuse"),
       flatten(materialDiffuse) );
    gl.uniform4fv( gl.getUniformLocation(program, "materialSpecular"), 
       flatten(materialSpecular) );	       
    shininessLoc = gl.getUniformLocation(program, "shininess");

    //event listeners for buttons 
    document.getElementById( "xButton" ).onclick = rotateX;
    document.getElementById( "yButton" ).onclick = rotateY;
    document.getElementById( "zButton" ).onclick = rotateZ;
    document.getElementById( "pButton" ).onclick = function() {paused=!paused;};
    document.getElementById( "dButton" ).onclick = function() {depthTest=!depthTest;};
	
	// event handlers for mouse input (borrowed from "Learning WebGL" lesson 11)
	canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;
	eventListenerRegister()
    render(canvas);
};

function render() {
	var canvas = gl.canvas;
	modeling = mult(rotate(theta[xAxis], 1, 0, 0),
	                mult(rotate(theta[yAxis], 0, 1, 0),rotate(theta[zAxis], 0, 0, 1)));

	//if (paused)	modeling = moonRotationMatrix;
	
	viewing = lookAt(vec3(eyePosition), [0,0,0], [0,1,0]);

	projection = perspective(60, canvas.width/canvas.height, 0.1, 1000.0);  /// (FOV, proportion, nearest(smaller is better),farest(larger is better))

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    if (! paused) theta[axis] += 2.0;
	if (depthTest) gl.enable(gl.DEPTH_TEST); else gl.disable(gl.DEPTH_TEST);

    gl.uniformMatrix4fv( modelingLoc,   0, flatten(modeling) );
    gl.uniformMatrix4fv( viewingLoc,    0, flatten(viewing) );
	gl.uniformMatrix4fv( projectionLoc, 0, flatten(projection) );
  
	gl.uniform1f(shininessLoc,materialShininess);
    gl.drawElements( gl.TRIANGLES, testObject.indices.length, gl.UNSIGNED_SHORT, 0 );

    requestAnimFrame( render );
}
