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
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Garden = __webpack_require__(1);
	
	var _Garden2 = _interopRequireDefault(_Garden);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	let video = null;
	let videoOutput = null;
	let streaming = false;
	let canvas = null;
	let frames = [];
	let garden = null;
	
	function addEnergy(spaces) {
	  return new Promise((res, rej) => {
	    const ctx = canvas.getContext('2d');
	
	    spaces.forEach(space => {
	      const newSpace = (videoOutput.width - space) * (canvas.width / videoOutput.width);
	      ctx.beginPath();
	      ctx.strokeStyle = 'green';
	      ctx.lineWidth = 5;
	      ctx.moveTo(newSpace, 0);
	      ctx.lineTo(newSpace, canvas.height);
	      ctx.stroke();
	      ctx.closePath();
	    });
	
	    res();
	  });
	}
	
	// throw out any temporarily absent or present faces.
	// smooth out jumps in face presence.
	function processSpaces(newFrame) {
	  return new Promise((res, rej) => {
	    if (!frames.length) {
	      frames.push(newFrame);
	      res(newFrame);
	    }
	
	    if (frames.length >= 10) {
	      frames.shift();
	    }
	
	    let processedFrame = [];
	    newFrame.forEach(face => {
	      processedFrame.push((videoOutput.width - newFrame) / videoOutput.width);
	    });
	    res(processedFrame);
	  });
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
	
	  const spaces = [];
	  faces.forEach(function (face) {
	    spaces.push(face.x + face.width / 2);
	  });
	
	  processSpaces(spaces).then(filteredSpaces => {
	    return garden.addEnergy(filteredSpaces);
	  }).then(() => {
	    window.requestAnimationFrame(function () {
	      drawToCanvas();
	    });
	  });
	}
	
	window.onload = function () {
	  video = document.getElementById('video');
	  videoOutput = document.getElementById('videoOutput');
	  canvas = document.getElementById('canvas');
	
	  garden = new _Garden2.default(canvas);
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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Segment = __webpack_require__(2);
	
	var _Segment2 = _interopRequireDefault(_Segment);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	const startingEnergy = 10;
	const entropy = 0.5;
	const totalSegments = 10;
	
	class Garden {
	  constructor(canvas) {
	    this.canvas = canvas;
	    this.ctx = canvas.getContext('2d');
	    this.width = window.innerWidth;
	    this.height = window.innerHeight;
	    this.histogram = [];
	
	    this.init();
	  }
	
	  addEnergy(data) {
	    return new Promise((res, rej) => {
	      const active = [];
	      data.forEach(datum => {
	        active.push(Math.floor(datum * 10));
	        // const num = Math.floor((this.width / (this.width * datum)) * 100) / totalSegments;
	        // console.log(num);
	        // this.ctx.beginPath();
	        // this.ctx.strokeStyle = 'green';
	        // this.ctx.lineWidth = 5;
	        // this.ctx.moveTo(newSpace, 0);
	        // this.ctx.lineTo(newSpace, this.height);
	        // this.ctx.stroke();
	        // this.ctx.closePath();
	      });
	      if (active.length) {
	        this.histogram.forEach((segment, index) => {
	          if (active.indexOf(index) > -1) {
	            segment.increase();
	          } else {
	            segment.decrease(totalSegments - active.length);
	          }
	        });
	      }
	      res();
	    });
	  }
	
	  renderBg() {
	    this.ctx.fillStyle = 'aliceblue';
	    this.ctx.fillRect(0, 0, this.width, this.height);
	    this.ctx.fillStyle = '#5CC121';
	    this.ctx.fillRect(0, this.height - 50, this.width, 50);
	  }
	
	  renderSegments() {
	    const width = Math.floor(this.width / this.histogram.length);
	    this.histogram.forEach((segment, index) => {
	      this.ctx.fillStyle = 'black';
	      this.ctx.strokeStyle = 'red';
	      this.ctx.lineWidth = 2;
	      const startX = index * width;
	      this.ctx.strokeRect(startX, this.height - 50, width, 50);
	      this.ctx.fillText(`+${ segment.posHealth }/-${ segment.negHealth }`, startX + 4, this.height - 20, width);
	    });
	  }
	
	  render() {
	    this.renderBg();
	    this.renderSegments();
	
	    requestAnimationFrame(() => {
	      this.render();
	    });
	  }
	
	  init() {
	    this.canvas.width = this.width;
	    this.canvas.height = this.height;
	
	    for (let i = 0; i < totalSegments; i++) {
	      this.histogram.push(new _Segment2.default(startingEnergy, entropy, totalSegments));
	    }
	
	    requestAnimationFrame(() => {
	      this.render();
	      // this.renderBg();
	    });
	  }
	}
	exports.default = Garden;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	class Segment {
	  constructor(startingEnergy, entropy, totalSegments) {
	    this.entropy = entropy;
	    this.totalSegments = totalSegments;
	    this.posHealth = startingEnergy;
	    this.negHealth = 0;
	  }
	
	  increase() {
	    this.posHealth += this.entropy;
	  }
	
	  decrease() {
	    let numSegments = arguments.length <= 0 || arguments[0] === undefined ? this.totalSegments - 1 : arguments[0];
	
	    const intermediate = Number(this.negHealth) + Number(this.entropy / Number(numSegments));
	    this.negHealth = intermediate.toFixed(1);
	  }
	}
	exports.default = Segment;

/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map