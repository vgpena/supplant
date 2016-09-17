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
	let mouseSegments = [];
	let socket = null;
	
	// function addEnergy(spaces) {
	//   return new Promise((res, rej) => {
	//     const ctx = canvas.getContext('2d');
	//
	//     spaces.forEach((space) => {
	//       const newSpace = (videoOutput.width - space) * (canvas.width / videoOutput.width);
	//       ctx.beginPath();
	//       ctx.strokeStyle = 'green';
	//       ctx.lineWidth = 5;
	//       ctx.moveTo(newSpace, 0);
	//       ctx.lineTo(newSpace, canvas.height);
	//       ctx.stroke();
	//       ctx.closePath();
	//     });
	//
	//     res();
	//
	//   });
	// }
	
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
	
	    let processedFrame = [].concat(mouseSegments);
	
	    newFrame.forEach(face => {
	      processedFrame.push(Math.floor((videoOutput.width - newFrame) * 10 / videoOutput.width));
	    });
	
	    // console.log(processedFrame);
	
	    res(processedFrame);
	  });
	}
	//
	// function getFaceData() {
	//   const ctx = videoOutput.getContext('2d');
	//   ctx.clearRect(0, 0, videoOutput.width, videoOutput.height);
	//   // ctx.globalCompositeOperation = 'source-over';
	//   //
	//   // ctx.fillStyle = 'blue';
	//   ctx.fillRect(0, 0, videoOutput.width, videoOutput.height);
	//   //
	//   // ctx.drawImage(video, 0, 0, videoOutput.width, videoOutput.height);
	//
	//   const faces = ccv.detect_objects({
	//     canvas: ccv.pre(videoOutput),
	//     cascade: cascade,
	//     interval: 2,
	//     min_neighbors: 1
	//   });
	//
	//   const spaces = [];
	//   faces.forEach(function(face) {
	//     spaces.push(face.x + (face.width / 2));
	//   });
	//
	//   processSpaces(spaces).then((filteredSpaces) => {
	//     return garden.addEnergy(filteredSpaces);
	//   }).then(() => {
	//     window.requestAnimationFrame(function() {
	//       getFaceData();
	//     });
	//   });
	// }
	
	function foundPeople(data) {
	  processSpaces(data).then(filteredSpaces => {
	    return garden.addEnergy(filteredSpaces);
	  });
	}
	
	function addSocketEvents() {
	  socket = io();
	
	  socket.on('foundPeople', data => {
	    foundPeople(data);
	  });
	}
	
	window.onload = function () {
	  addSocketEvents();
	
	  // video = document.getElementById('video');
	  // videoOutput = document.getElementById('videoOutput');
	  canvas = document.getElementById('canvas');
	  //
	  garden = new _Garden2.default(canvas);
	  // navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	  //
	  // navigator.getMedia({
	  //   video: true,
	  //   audio: false
	  // }, function(stream) {
	  //   if (navigator.mozGetUserMedia) {
	  //     video.mozSrcObject = stream;
	  //   } else {
	  //     const vendorURL = window.URL || window.webkitURL;
	  //     video.src = vendorURL.createObjectURL(stream);
	  //   }
	  //   video.play();
	  // }, function(err) {
	  //   alert(err);
	  // });
	  //
	  // video.addEventListener('canplay', function(e) {
	  //   const width = 320;
	  //   let height = null;
	  //
	  //   if (!streaming) {
	  //     height = video.videoHeight / (video.videoWidth / width);
	  //   }
	  //
	  //   video.setAttribute('width', width);
	  //   video.setAttribute('height', height);
	  //   videoOutput.setAttribute('width', width);
	  //   videoOutput.setAttribute('height', height);
	  //   streaming = true;
	  //
	  //   window.requestAnimationFrame(getFaceData);
	  // }, false);
	};
	
	window.addEventListener('mousedown', event => {
	  const x = event.clientX;
	  let seg = Math.floor(x / canvas.width * 10);
	  let index = mouseSegments.indexOf(seg);
	  if (index !== -1) {
	    mouseSegments.splice(index, 1);
	  } else {
	    mouseSegments.push(seg);
	  }
	});

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
	
	const startingEnergy = 0;
	const entropy = 0.001;
	const totalSegments = 10;
	const totalEnergy = 500;
	
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
	        active.push(datum);
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
	
	  setAttributes(element, attributes, callback) {
	    for (let key in attributes) {
	      element.setAttribute(key, attributes[key]);
	    }
	
	    if (callback) {
	      callback();
	    }
	  }
	
	  renderSegment(startX, width, segment, index) {
	    // const height = (width / 326) * 903.1;
	    // const snap = Snap(width, height);
	    // snap.attr({
	    //   'id': `snap-${ index }`,
	    //   'class': 'snap'
	    // });
	    //
	    // // console.log(snap.node);
	    // // snap.node.setAttribute("transform", "translate(" + startX + ", " + (window.innerHeight - height) + ")");
	    //
	    // Snap.load('flower.svg', (fragment) => {
	    //   snap.append(fragment);
	    // });
	  }
	
	  renderSegments() {
	    const width = this.width / this.histogram.length;
	    this.histogram.forEach((segment, index) => {
	      // this.ctx.fillStyle = 'black';
	      // this.ctx.strokeStyle = 'red';
	      // this.ctx.lineWidth = 2;
	      const startX = index * width;
	      // this.ctx.strokeRect(startX, this.height - 50, width, 50);
	      this.renderSegment(startX, width, segment, index);
	    });
	  }
	
	  render() {
	    // this.renderBg();
	    this.renderSegments();
	
	    // requestAnimationFrame(() => {
	    //   this.render();
	    // });
	  }
	
	  init() {
	    this.canvas.width = this.width;
	    this.canvas.height = this.height;
	
	    for (let i = 0; i < totalSegments; i++) {
	      this.histogram.push(new _Segment2.default(startingEnergy, entropy, totalSegments, i));
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
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Flower = __webpack_require__(4);
	
	var _Flower2 = _interopRequireDefault(_Flower);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	const energyCeiling = 1;
	
	class Segment {
	  constructor(startingEnergy, entropy, totalSegments, segIndex) {
	    this.entropy = entropy;
	    this.totalSegments = totalSegments;
	    this.currEnergy = startingEnergy;
	    this.maxEnergy = this.currEnergy;
	    this.index = segIndex;
	    this.flower = new _Flower2.default(entropy, undefined, window.innerWidth / totalSegments, segIndex);
	  }
	
	  updateEnergy(newEnergy) {
	    this.flower.updateEnergy(newEnergy);
	  }
	
	  increase() {
	    console.log(this.index);
	    this.currEnergy = Math.min(energyCeiling, this.currEnergy + this.entropy);
	    this.maxEnergy = Math.max(this.currEnergy, this.maxEnergy);
	    this.updateEnergy(this.currEnergy);
	  }
	
	  decrease() {
	    let numSegments = arguments.length <= 0 || arguments[0] === undefined ? this.totalSegments - 1 : arguments[0];
	
	    this.currEnergy -= Number(this.entropy / Number(numSegments)) * (this.totalSegments - numSegments);
	
	    if (this.currEnergy < this.entropy) {
	      this.currEnergy = this.entropy;
	      this.maxEnergy = this.currEnergy;
	    }
	
	    this.updateEnergy(this.currEnergy);
	  }
	}
	exports.default = Segment;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	const colorSchemes = exports.colorSchemes = [{
	  "main": "rgb(203,174,210)",
	  "outer": "rgb(238,233,240)",
	  "lines": "rgb(149,28,74)",
	  "center": "rgb(251,235,134)",
	  "stem": "rgb(127,194,65)"
	}, {
	  "main": "rgb(216,127,39)",
	  "outer": "rgb(244,182,26)",
	  "lines": "rgb(251,231,82)",
	  "center": "rgb(253,242,194)",
	  "stem": "rgb(110,190,68)"
	}, {
	  "main": "rgb(152,26,53)",
	  "outer": "rgb(249,213,223)",
	  "lines": "rgb(253,243,172)",
	  "center": "rgb(251,202,38)",
	  "stem": "rgb(95,186,70)"
	}, {
	  "main": "rgb(56,152,211)",
	  "outer": "rgb(41,53,136)",
	  "lines": "rgb(253,244,248)",
	  "center": "rgb(250,237,172)",
	  "stem": "rgb(60,124,58)"
	}];
	
	const deadColors = exports.deadColors = {
	  "main": "rgb(10,8,9)",
	  "outer": "rgb(10,8,9)",
	  "lines": "rgb(10,8,9)",
	  "center": "rgb(162,163,163)",
	  "stem": "rgb(118,117,117)"
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _colors = __webpack_require__(3);
	
	class Flower {
	  constructor() {
	    let minEnergy = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
	    let colors = arguments.length <= 1 || arguments[1] === undefined ? _colors.colorSchemes[Math.floor(Math.random() * _colors.colorSchemes.length)] : arguments[1];
	    let width = arguments[2];
	    let segIndex = arguments[3];
	
	    this.minEnergy = minEnergy;
	    this.colors = colors;
	    this.isHealthy = true;
	    this.currEnergy = minEnergy;
	    this.width = width;
	    this.index = segIndex;
	
	    this.init();
	  }
	
	  pickNewColors() {
	    this.colors = _colors.colorSchemes[Math.floor(Math.random() * _colors.colorSchemes.length)];
	  }
	
	  die() {
	    this.pickNewColors();
	  }
	
	  fadeTo(newEnergy) {}
	
	  growTo(newEnergy) {}
	
	  tweenToEnergy(newEnergy) {
	    if (newEnergy < this.currEnergy) {
	      this.isHealthy = false;
	      this.fadeTo(newEnergy);
	    } else {
	      this.isHealthy = true;
	      this.growTo(newEnergy);
	    }
	
	    this.currEnergy = newEnergy;
	  }
	
	  updateEnergy(newEnergy) {
	    if (newEnergy <= this.minEnergy && this.currEnergy !== this.minEnergy) {
	      this.die();
	    } else {
	      this.tweenToEnergy(newEnergy);
	    }
	  }
	
	  init() {
	    const height = this.width / 326 * 903.1;
	    const snap = Snap(this.width, height);
	    snap.attr({
	      'id': `snap-${ this.index }`,
	      'class': 'snap'
	    });
	
	    snap.node.style.left = this.width * this.index;
	
	    Snap.load('flower.svg', fragment => {
	      fragment.selectAll('.st0').attr({ fill: this.colors.stem });
	      fragment.selectAll('.st1').attr({ fill: this.colors.main });
	      fragment.selectAll('.st2').attr({ fill: this.colors.center });
	      fragment.selectAll('.st3').attr({ fill: this.colors.lines });
	
	      snap.append(fragment);
	    });
	  }
	}
	exports.default = Flower;

/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map