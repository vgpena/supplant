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
	let active = [];
	
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
	
	    // console.log(processedFrame);
	    // newFrame.forEach((face) => {
	    //   processedFrame.push(Math.floor((videoOutput.width - newFrame) * 10 / videoOutput.width));
	    // });
	
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
	  // console.log(data);
	  active = [];
	  data.forEach((curr, index) => {
	    if (Number(curr) === 1) {
	      active.push(index);
	    }
	  });
	
	  // console.log(mouseSegments);
	
	  // active.concat(mouseSegments);
	  // console.log(active);
	  mouseSegments.forEach(curr => {
	    active.push(curr);
	  });
	
	  garden.addEnergy(active);
	  // processSpaces(data).then((filteredSpaces) => {
	  //   return garden.addEnergy(filteredSpaces);
	  // });
	}
	
	function draw() {
	  garden.addEnergy(active);
	  window.requestAnimationFrame(draw);
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
	  draw();
	};
	
	window.addEventListener('mousedown', event => {
	  const x = event.clientX;
	  let seg = Math.floor(x / window.innerWidth * 10);
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
	const entropy = 0.005;
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
	    // console.log(data);
	    // return new Promise((res, rej) => {
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
	    //   res();
	    // });
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
	
	var _Flower = __webpack_require__(3);
	
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
	    this.flower.updateEnergy(newEnergy, this.maxEnergy);
	  }
	
	  increase() {
	    this.currEnergy = Math.min(energyCeiling, this.currEnergy + this.entropy);
	    this.maxEnergy = Math.max(this.currEnergy, this.maxEnergy);
	    this.updateEnergy(this.currEnergy, this.maxEnergy);
	  }
	
	  decrease() {
	    let numSegments = arguments.length <= 0 || arguments[0] === undefined ? this.totalSegments - 1 : arguments[0];
	
	    this.currEnergy -= Number(this.entropy / Number(numSegments)) * (this.totalSegments - numSegments);
	
	    if (this.currEnergy < this.entropy) {
	      this.currEnergy = this.entropy;
	      this.maxEnergy = this.currEnergy;
	    }
	
	    this.updateEnergy(this.currEnergy, this.maxEnergy);
	  }
	}
	exports.default = Segment;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _colors = __webpack_require__(4);
	
	class Flower {
	  constructor() {
	    let minEnergy = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
	    let colors = arguments[1];
	    let width = arguments[2];
	    let segIndex = arguments[3];
	
	    this.minEnergy = minEnergy;
	    this.colors = colors;
	    this.isHealthy = true;
	    this.currEnergy = minEnergy;
	    this.width = width;
	    this.index = segIndex;
	    this.sprout;
	    this.id = `snap-${ this.index }`;
	
	    this.timings = [{
	      id: '.stem',
	      dir: 7,
	      start: 0,
	      end: .3,
	      yOffset: 0,
	      last: 0
	    }, {
	      id: '.leaf1',
	      dir: 5,
	      start: .15,
	      end: .3,
	      yOffset: .2,
	      last: 0
	    }, {
	      id: '.leaf3',
	      dir: 6,
	      start: .3,
	      end: .45,
	      yOffset: .2,
	      last: 0
	    }, {
	      id: '.leaf2',
	      dir: 5,
	      start: .45,
	      end: .6,
	      yOffset: .2,
	      last: 0
	    }, {
	      id: '.leaf4',
	      dir: 6,
	      start: .6,
	      end: .75,
	      yOffset: .2,
	      last: 0
	    }, {
	      id: '.blossom',
	      dir: 4,
	      start: .75,
	      end: 1,
	      yOffset: 0,
	      last: 0,
	      rotate: Math.random() * 90
	    }];
	
	    this.parts = [];
	
	    this.init();
	  }
	
	  transform(timing, part, scale, force) {
	    let dims = part.getBBox();
	
	    let offsetX;
	    let offsetY;
	
	    if (timing.dir === 7 || timing.dir === 4) {
	      offsetX = (1 - scale) * dims.cx;
	    } else if (timing.dir === 6) {
	      offsetX = (1 - scale) * dims.x;
	    } else {
	      offsetX = (1 - scale) * (dims.x + dims.width);
	    }
	
	    if (timing.dir === 7) {
	      offsetY = (1 - scale) * (dims.y + dims.height);
	    } else {
	      offsetY = (1 - scale) * dims.cy + (part.yOffset ? part.yOffset * 400 : 0) * scale;
	      // offsetY = (1-scale) * (dims.cy);
	    }
	
	    part.attr({
	      transform: `translate(${ offsetX }, ${ offsetY }) scale(${ scale }) rotate(${ timing.rotate ? timing.rotate * scale : 0 }deg)`
	    });
	
	    timing.last = scale;
	  }
	
	  randomizeChannel(val) {
	    const range = 50;
	    const modifier = Math.floor(Math.random() * range * 2) - range;
	    const newVal = Number(val) + Number(modifier);
	    return Math.min(Math.max(newVal, 0), 255);
	  }
	
	  randomizeColor(rgbColor) {
	    const r = rgbColor.split('(')[1].split(',')[0];
	    const g = rgbColor.split(`${ r },`)[1].split(',')[0];
	    const b = rgbColor.split(`${ g },`)[1].split(')')[0];
	
	    return `rgb(${ this.randomizeChannel(r) },${ this.randomizeChannel(g) },${ this.randomizeChannel(b) })`;
	  }
	
	  randomizeColors(scheme) {
	    let newScheme = {};
	    for (let color in scheme) {
	      newScheme[color] = this.randomizeColor(scheme[color]);
	    }
	    return newScheme;
	  }
	
	  pickNewColors() {
	    this.colors = this.randomizeColors(_colors.colorSchemes[Math.floor(Math.random() * _colors.colorSchemes.length)]);
	  }
	
	  die() {
	    console.log('dead');
	    this.sprout.attr({
	      opacity: 1
	    });
	    this.bloomed = false;
	    this.pickNewColors();
	    this.reset();
	    this.skull.addClass('animate');
	  }
	
	  fadeTo(newEnergy, maxEnergy) {}
	
	  rgbToInt(color) {
	    const bits = color.split(',');
	    const r = parseInt(bits[0].split('(')[1]);
	    const g = parseInt(bits[1]);
	    const b = parseInt(bits[2].split(')')[0]);
	    return [r, g, b];
	  }
	
	  colorTween(colors, perc) {
	    const color1 = this.rgbToInt(colors[0]);
	    const color2 = this.rgbToInt(colors[1]);
	    const r = Math.ceil(parseInt(color1[0] * perc + color2[0] * (1 - perc)));
	    const g = Math.ceil(parseInt(color1[1] * perc + color2[1] * (1 - perc)));
	    const b = Math.ceil(parseInt(color1[2] * perc + color2[2] * (1 - perc)));
	    return `rgb(${ r }, ${ g }, ${ b })`;
	  }
	
	  growTo(newEnergy) {
	    for (let i in this.parts) {
	      let part = this.parts[i];
	      let timing = this.timings[i];
	      let scale = (this.currEnergy - timing.start) * (1 / (timing.end - timing.start));
	
	      if (scale > 1) {
	        scale = 1;
	        timing.last = 1;
	        this.transform(timing, part, scale);
	      } else if (scale > 0) {
	        if (scale >= timing.last) {
	          this.transform(timing, part, scale);
	        }
	      }
	    }
	  }
	
	  tweenToEnergy(newEnergy, maxEnergy) {
	    if (newEnergy < this.currEnergy) {
	      this.crown.removeClass('animate');
	      this.isHealthy = false;
	      this.fadeTo(newEnergy, maxEnergy);
	    } else {
	      this.skull.removeClass('animate');
	      this.isHealthy = true;
	      this.growTo(newEnergy);
	    }
	
	    this.currEnergy = newEnergy;
	  }
	
	  updateEnergy(newEnergy, maxEnergy) {
	    if (newEnergy <= this.minEnergy && this.currEnergy !== this.minEnergy) {
	      if (this.sprouted) {
	        this.die();
	      }
	      this.sprouted = false;
	    } else {
	      if (this.currEnergy === 1 && !this.bloomed) {
	        this.crown.addClass('animate');
	        this.bloomed = true;
	      }
	      this.sprouted = true;
	      this.tweenToEnergy(newEnergy, maxEnergy);
	    }
	    const lifePerc = newEnergy / maxEnergy;
	    if (lifePerc !== 1 && maxEnergy > .01) {
	      this.sprout.attr({
	        opacity: lifePerc
	      });
	
	      this.sprout.selectAll('.st0').attr({ fill: this.colorTween([this.colors.stem, _colors.deadColors.stem], lifePerc) });
	      this.sprout.selectAll('.st1').attr({ fill: this.colorTween([this.colors.main, _colors.deadColors.main], lifePerc) });
	      this.sprout.selectAll('.st2').attr({ fill: this.colorTween([this.colors.center, _colors.deadColors.center], lifePerc) });
	      this.sprout.selectAll('.st3').attr({ fill: this.colorTween([this.colors.lines, _colors.deadColors.lines], lifePerc) });
	    }
	  }
	
	  createPart(fragment, timing) {
	    let part = fragment.selectAll(timing.id)[0];
	    part.yOffset = timing.yOffset ? Math.random() * timing.yOffset - timing.yOffset / 2 : false;
	    this.parts.push(part);
	    this.transform(timing, part, 0.01);
	  }
	
	  reset() {
	    for (let i in this.parts) {
	      i = parseInt(i);
	      let part = this.parts[i];
	      let timing = this.timings[i];
	      this.transform(timing, part, 0.01);
	      this.sprout.selectAll('.st0').attr({ fill: this.colors.stem });
	      this.sprout.selectAll('.st1').attr({ fill: this.colors.main });
	      this.sprout.selectAll('.st2').attr({ fill: this.colors.center });
	      this.sprout.selectAll('.st3').attr({ fill: this.colors.lines });
	    }
	  }
	
	  init() {
	    this.pickNewColors();
	
	    const rand = 1 + Math.random() * .2;
	    const height = this.width / 326 * 903.1;
	    this.sprout = Snap(this.width * rand, height * rand);
	    this.sprout.attr({
	      'id': this.sprout,
	      'class': 'sprout'
	    });
	
	    this.sprout.node.style.left = 150 + (this.width - 30) * this.index + (Math.random() * 80 - 40);
	
	    Snap.load('flower.svg', fragment => {
	      this.sprout.append(fragment);
	
	      fragment.selectAll('.st0').attr({ fill: this.colors.stem });
	      fragment.selectAll('.st1').attr({ fill: this.colors.main });
	      fragment.selectAll('.st2').attr({ fill: this.colors.center });
	      fragment.selectAll('.st3').attr({ fill: this.colors.lines });
	
	      for (let i in this.timings) {
	        i = parseInt(i);
	        let timing = this.timings[i];
	        this.createPart(fragment, timing);
	      }
	    });
	
	    const skullRatio = this.width / 464 * 354.4;
	    this.skull = Snap(this.width, skullRatio);
	    this.skull.attr({
	      'class': 'skullClass'
	    });
	    this.skull.node.style.left = this.sprout.node.style.left;
	    this.skull.node.style.bottom = height - 50;
	    Snap.load('skull.svg', fragment => {
	      this.skull.append(fragment);
	    });
	
	    const crownRatio = this.width / 464 * 354.4;
	    this.crown = Snap(this.width, crownRatio);
	    this.crown.attr({
	      'class': 'crownClass'
	    });
	    this.crown.node.style.left = this.sprout.node.style.left;
	    this.crown.node.style.bottom = height - 50;
	    Snap.load('crown.svg', fragment => {
	      this.crown.append(fragment);
	    });
	  }
	}
	exports.default = Flower;

/***/ },
/* 4 */
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

/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map