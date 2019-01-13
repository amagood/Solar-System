var gl;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 1;
var theta = [ 0, 0, 0 ];
var paused = 0;
var depthTest = 1;

var obj_count = 10;

var all_obj = [];
var obj_tex = [];

var width,height;
// event handlers for mouse input (borrowed from "Learning WebGL" lesson 11)
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

//event trigger
function eventListenerRegister() {
  // event listeners for buttons 
  //document.getElementById('pause-button').addEventListener('click', handlePause);
  document.getElementById('fullscreen-button').addEventListener('click', handleFullscreen);
  gl.canvas.addEventListener('mousemove', handleCanvasMouseMove);
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  document.addEventListener('fullscreenchange', handleFullScreenChange);
  document.addEventListener('mozfullscreenchange', handleFullScreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
  document.addEventListener('msfullscreenchange', handleFullScreenChange);
  window.addEventListener('resize', handleWindowResize);
}




function handleMouseDown(event) {
    mouseDown = true;
    lastMouseX = event.clientX;
	lastMouseY = event.clientY;
}

function handleMouseUp(event) {
    mouseDown = false;
}



var mouseSensitiveXEle;
var mouseSensitiveYEle;


var mouseMove = [0, 0];
function handleCanvasMouseMove(event) {
  //console.log(mouseSensitiveXEle.value);
  //console.log('process');
  mouseMove[0] += event.movementX/(10-mouseSensitiveXEle.value);
  mouseMove[1] += event.movementY/(10-mouseSensitiveYEle.value);
}





//from teacher
/*
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
*/

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

var eyePosition   = vec4( 0.0, 1.0, 2.0, 1.0 );
var lookPos=[0,0,0];
var upPos=[0,1,0];
var lightPosition = vec4( 10.0, 10.0, 20.0, 1.0 );

var materialAmbient = vec4( 0.25, 0.25, 0.25, 1.0 );
var materialDiffuse = vec4( 0.8, 0.8, 0.7, 1.0);
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 100.0;


function configureTexture( image , program) {
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



var draw_time = 10;

var sun = new obj_sphere(0.2,0,0,0,draw_time);
var mec = new obj_sphere(0.1,0.05,0,0,draw_time);
var ven = new obj_sphere(0.1,0.1,0,0,draw_time);
var ear = new obj_sphere(0.1,0.15,0,0,draw_time);
var mar = new obj_sphere(0.1,0.2,0,0,draw_time);
var jub = new obj_sphere(0.1,0.25,0,0,draw_time);
var sat = new obj_sphere(0.1,0.3,0,0,draw_time);
var ura = new obj_sphere(0.1,0.35,0,0,draw_time);
var net = new obj_sphere(0.1,0.4,0,0,draw_time);
var bor = new obj_sphere(0.1,0.45,0,0,draw_time);

 function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "./shaders/vShader.glsl", "./shaders/fShaders.glsl" );
    gl.useProgram( program );

    let sun_sphere = new obj_buffer_tex(program);
    var sun_image = new Image();
    sun_image.onload = function() { 
        sun_sphere.TEXture( sun_image );
    }
    sun_sphere.the_buffer(sun,program);
    sun_image.src = "8k_sun.jpg";
    all_obj.push(sun_sphere);

    let mec_sphere = new obj_buffer_tex(program);
    var mec_image = new Image();
    mec_image.onload = function() { 
        mec_sphere.TEXture( mec_image );
    }
    mec_sphere.the_buffer(mec,program);
    mec_image.src = "mec.jpg";
    all_obj.push(mec_sphere);

    let ven_sphere = new obj_buffer_tex(program);
    var ven_image = new Image();
    ven_image.onload = function() { 
        ven_sphere.TEXture( ven_image );
    }
    ven_sphere.the_buffer(ven,program);
    ven_image.src = "ve.jpg";
    all_obj.push(ven_sphere);

    let ear_sphere = new obj_buffer_tex(program);
    var ear_image = new Image();
    ear_image.onload = function() { 
        ear_sphere.TEXture( ear_image );
    }
    ear_sphere.the_buffer(ear,program);
    ear_image.src = "moon.jpg";
    all_obj.push(ear_sphere);

    let mar_sphere = new obj_buffer_tex(program);
    var mar_image = new Image();
    mar_image.onload = function() { 
        mar_sphere.TEXture( mar_image );
    }
    mar_sphere.the_buffer(mar,program);
    mar_image.src = "mars.jpg";
    all_obj.push(mar_sphere);

    let jub_sphere = new obj_buffer_tex(program);
    var jub_image = new Image();
    jub_image.onload = function() { 
        jub_sphere.TEXture( jub_image );
    }
    jub_sphere.the_buffer(jub,program);
    jub_image.src = "ju.jpg";
    all_obj.push(jub_sphere);

    let sat_sphere = new obj_buffer_tex(program);
    var sat_image = new Image();
    sat_image.onload = function() { 
        sat_sphere.TEXture( sat_image );
    }
    sat_sphere.the_buffer(sat,program);
    sat_image.src = "sa.jpg";
    all_obj.push(sat_sphere);

    let ura_sphere = new obj_buffer_tex(program);
    var ura_image = new Image();
    ura_image.onload = function() { 
        ura_sphere.TEXture( ura_image );
    }
    ura_sphere.the_buffer(ura,program);
    ura_image.src = "moon.jpg";
    all_obj.push(ura_sphere);

    let net_sphere = new obj_buffer_tex(program);
    var net_image = new Image();
    net_image.onload = function() { 
        net_sphere.TEXture( net_image );
    }
    net_sphere.the_buffer(net,program);
    net_image.src = "moon.jpg";
    all_obj.push(net_sphere);

    let bor_sphere = new obj_buffer_tex(program);
    var bor_image = new Image();
    bor_image.onload = function() { 
        bor_sphere.TEXture( bor_image );
    }
    bor_sphere.the_buffer(bor,program);
    bor_image.src = "moon.jpg";
    all_obj.push(bor_sphere);

    
    	
    

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
	mouseSensitiveXEle=document.getElementById("x_sensitivity");
	mouseSensitiveYEle=document.getElementById("y_sensitivity");
	// event handlers for mouse input (borrowed from "Learning WebGL" lesson 11)
	canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    //document.onmousemove = handleMouseMove;
	eventListenerRegister()
    render(canvas,program);
};

// onload function
(function() { window.addEventListener('load', init) })();

function render(program) {
	var canvas = gl.canvas;
	modeling = mult(rotate(theta[xAxis], 1, 0, 0),
	                mult(rotate(theta[yAxis], 0, 1, 0),rotate(theta[zAxis], 0, 0, 1)));
	
	//吳尚齊教我的WWWW    轉滑鼠視角XD
	let step = 1;

    if (keyboardState['ArrowUp'])
      mouseMove[1] -= step;
    if (keyboardState['ArrowDown'])
      mouseMove[1] += step;
    if (keyboardState['ArrowLeft'])
      mouseMove[0] -= step;
    if (keyboardState['ArrowRight'])
      mouseMove[0] += step;
	
	var direction = [];
	for(var i=0;i<3;i++)
		direction[i]=lookPos[i]-eyePosition[i];
	direction=normalize(direction);
	
	
	if (-direction[1] * Math.sign(mouseMove[1]) > 0.8)
      mouseMove[1] = 0;
  
			
	var rotateMatrix = mult(rotate(mouseMove[0] / 4, [0, -1, 0]),
                    rotate(mouseMove[1] / 4, [direction[2], 0, -direction[0]]));
		
	
	mouseMove[0] = 0;
    mouseMove[1] = 0;
	
	var newDirection = [0, 0, 0];
	for (let i = 0; i < 3; ++i)
		for (let j = 0; j < 3; ++j)
			newDirection[i] += rotateMatrix[i][j] * direction[j];
	newDirection = normalize(newDirection);
	
	
    var moveDirection = [0, 0, 0];
	if (keyboardState['KeyW']) {
      moveDirection[0] += newDirection[0];
      moveDirection[2] += newDirection[2];
      //moveDirection[1] += newDirection[1];
    }

    if (keyboardState['KeyS']) {
      moveDirection[0] -= newDirection[0];
      moveDirection[2] -= newDirection[2];
      //moveDirection[1] -= newDirection[1];
    }

    if (keyboardState['KeyA']) {
      moveDirection[0] += newDirection[2];
      moveDirection[2] -= newDirection[0];
    }

    if (keyboardState['KeyD']) {
      moveDirection[0] -= newDirection[2];
      moveDirection[2] += newDirection[0];
    }
	if (keyboardState['Space']) {
      moveDirection[1] -= newDirection[1];
      
    }
	if (keyboardState['ShiftLeft']) {
      moveDirection[1] += newDirection[1];
      
    }
	
	var newPosition = eyePosition.slice();
    var newLookAt = [];
	for (var i = 0; i < 3; ++i) {
      newPosition[i] += 0.05 * moveDirection[i];
      newLookAt[i] = newPosition[i] + newDirection[i];
    }
	
	eyePosition=newPosition.slice();
	lookPos=newLookAt.slice();
	//console.log('newPos' + newPosition);
	//console.log('newDir' + newDirection);
	
	//if (paused)	modeling = moonRotationMatrix;
	//console.log(eyePosition +'     ' + lookPos +'     ' + upPos);
	//console.log(lookPos);
	//console.log(upPos);	
	
	viewing = lookAt(vec3(eyePosition), lookPos, upPos);//eyePosition  lookPos upPos

	projection = perspective(60, canvas.width/canvas.height, 0.1, 1000.0);  /// (FOV, proportion, nearest(smaller is better),farest(larger is better))

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    if (! paused) theta[axis] += 0.2;
	if (depthTest) gl.enable(gl.DEPTH_TEST); else gl.disable(gl.DEPTH_TEST);

    for(let i = 0;i < obj_count;i++)
    {
        //let render_obj = all_obj[i];
        gl.uniformMatrix4fv( modelingLoc,   0, flatten(modeling) );
        gl.uniformMatrix4fv( viewingLoc,    0, flatten(viewing) );
        gl.uniformMatrix4fv( projectionLoc, 0, flatten(projection) );
        all_obj[i].the_attribute(program);
        gl.drawArrays( gl.TRIANGLES, 0, sun.numVertices );

        
        //gl.drawArrays( gl.TRIANGLES, 129600, ball.numVertices-259200 );
        //gl.drawArrays( gl.LINE_LOOP, ball.numVertices-129600, 129600 );
        //gl.drawArrays( gl.LINE_LOOP, 0, sun.numVertices);
        //gl.drawArrays( gl.TRIANGLES, 0, ball.numVertices);
    }

    requestAnimFrame( render );
}
