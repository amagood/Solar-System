/**
usage:
require declaration of gl
ex: var gl = WebGLUtils.setupWebGL( canvas );
require call function of eventListenerRegister() at the end of init() functions
require variable declaration of (projectionLoc) which is the projection matrix of the shader
ex:  var projectionLoc=gl.getUniformLocation(......)
*/





///full screen code
let keyboardState = {};
function handleFullscreen() {
  //(document.cancelFullscreen||document.webkitCancelFullScreen)
  if (document.fullscreenElement)
    document.webkitCancelFullScreen();
  else
    document.documentElement.requestFullscreen();
}
function handleFullScreenChange() {
  if (document.fullscreenElement) {
    gl.canvas.classList.add('fullscreen');
    handleWindowResize();
    gl.canvas.requestPointerLock();
  } else {
    gl.canvas.classList.remove('fullscreen');
    gl.canvas.width = '1280';
    gl.canvas.height = '720';
    handleWindowResize();
    document.exitPointerLock();
  }
}

function handleWindowResize() {
  handleCanvasResize();
}

function handleCanvasResize() {
	var width = width || gl.canvas.clientWidth;
    var height = height || gl.canvas.clientHeight;

    gl.canvas.width = width;
    gl.canvas.height = height;
    gl.viewport(0, 0, width, height);
    gl.uniformMatrix4fv(projectionLoc, 0,
        flatten(perspective(70, width / height, 0.1, 1000)));
		
		
  console.log('resize canvas to: ' + gl.canvas.width + ' x ' + gl.canvas.height +
      ' (' + Math.floor(gl.canvas.width * window.devicePixelRatio) + ' x ' +
      Math.floor(gl.canvas.height * window.devicePixelRatio) + ') @' + window.devicePixelRatio);
}

function handleKeyDown(event) {
  keyboardState[event.code] = true;
  switch (event.key) {
  case 'f':
    handleFullscreen();
    break;
  case 'p':
    if (document.pointerLockElement)
      document.exitPointerLock();
    else
      gl.canvas.requestPointerLock();
    break;
  }
}

function handleKeyUp(event) {
  delete keyboardState[event.code];
}
function eventListenerRegister() {
  // event listeners for buttons 
  //document.getElementById('pause-button').addEventListener('click', handlePause);
  document.getElementById('fullscreen-button').addEventListener('click', handleFullscreen);
  //gl.canvas.addEventListener('mousemove', handleCanvasMouseMove);
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  document.addEventListener('fullscreenchange', handleFullScreenChange);
  document.addEventListener('mozfullscreenchange', handleFullScreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
  document.addEventListener('msfullscreenchange', handleFullScreenChange);
  window.addEventListener('resize', handleWindowResize);
}

// onload function
(function() { window.addEventListener('load', init) })();


///full screen end