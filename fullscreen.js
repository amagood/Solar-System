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
    paused=!paused;
	break;
  }
}

function handleKeyUp(event) {
  delete keyboardState[event.code];
}



///full screen end