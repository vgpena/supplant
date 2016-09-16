/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";
	
	let video = null;
	let videoOutput = null;
	let streaming = false;
	
	function addEnergy(spaces, callback) {
	  const ctx = videoOutput.getContext('2d');
	
	  spaces.forEach(space => {
	    ctx.beginPath();
	    ctx.strokeStyle = 'green';
	    ctx.lineWidth = 5;
	    ctx.moveTo(space, 0);
	    ctx.lineTo(space, videoOutput.height);
	    ctx.stroke();
	    ctx.closePath();
	  });
	
	  if (callback) {
	    callback();
	  }
	}
	
	function drawToCanvas() {
	  const ctx = videoOutput.getContext('2d');
	  ctx.clearRect(0, 0, videoOutput.width, videoOutput.height);
	  ctx.globalCompositeOperation = 'source-over';
	
	  ctx.fillStyle = 'blue';
	  ctx.fillRect(0, 0, videoOutput.width, videoOutput.height);
	
	  ctx.drawImage(video, 0, 0, videoOutput.width, videoOutput.height);
	
	  const faces = ccv.detect_objects({
	    canvas: ccv.pre(videoOutput),
	    cascade: cascade,
	    interval: 2,
	    min_neighbors: 1
	  });
	
	  if (faces.length) {
	    const spaces = [];
	    faces.forEach(function (face) {
	      spaces.push(face.x + face.width / 2);
	    });
	    addEnergy(spaces, () => {
	      window.requestAnimationFrame(function () {
	        drawToCanvas();
	      });
	    });
	  } else {
	    window.requestAnimationFrame(function () {
	      drawToCanvas();
	    });
	  }
	}
	
	window.onload = function () {
	  video = document.getElementById('video');
	  videoOutput = document.getElementById('videoOutput');
	
	  navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	
	  navigator.getMedia({
	    video: true,
	    audio: false
	  }, function (stream) {
	    if (navigator.mozGetUserMedia) {
	      video.mozSrcObject = stream;
	    } else {
	      const vendorURL = window.URL || window.webkitURL;
	      video.src = vendorURL.createObjectURL(stream);
	    }
	    video.play();
	  }, function (err) {
	    alert(err);
	  });
	
	  video.addEventListener('canplay', function (e) {
	    const width = 320;
	    let height = null;
	
	    if (!streaming) {
	      height = video.videoHeight / (video.videoWidth / width);
	    }
	
	    video.setAttribute('width', width);
	    video.setAttribute('height', height);
	    videoOutput.setAttribute('width', width);
	    videoOutput.setAttribute('height', height);
	    streaming = true;
	
	    window.requestAnimationFrame(drawToCanvas);
	  }, false);
	};

/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map