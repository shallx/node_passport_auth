var fs = document.getElementById('btnFS');

fs.addEventListener('click', goFullScreen);

function goFullScreen() {
	var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement ||
document.webkitFullscreenElement || document.msFullscreenElement;
	if(fullscreenElement){
  	exitFullscreen();
  }else {
  	launchIntoFullscreen(document.getElementById('vid_container'));
  }
  
}

// From https://davidwalsh.name/fullscreen
// Find the right method, call on correct element
function launchIntoFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

// Whack fullscreen
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}
