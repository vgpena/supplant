"use strict";

import Garden from 'Garden';

let video = null;
let videoOutput = null;
let streaming = false;
let canvas = null;
let frames = [];
let garden = null;

function addEnergy(spaces) {
  return new Promise((res, rej) => {
    const ctx = canvas.getContext('2d');

    spaces.forEach((space) => {
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
    newFrame.forEach((face) => {
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
  faces.forEach(function(face) {
    spaces.push(face.x + (face.width / 2));
  });

  processSpaces(spaces).then((filteredSpaces) => {
    return garden.addEnergy(filteredSpaces);
  }).then(() => {
    window.requestAnimationFrame(function() {
      drawToCanvas();
    });
  });
}

window.onload = function() {
  video = document.getElementById('video');
  videoOutput = document.getElementById('videoOutput');
  canvas = document.getElementById('canvas');

  garden = new Garden(canvas);
  navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

  navigator.getMedia({
    video: true,
    audio: false
  }, function(stream) {
    if (navigator.mozGetUserMedia) {
      video.mozSrcObject = stream;
    } else {
      const vendorURL = window.URL || window.webkitURL;
      video.src = vendorURL.createObjectURL(stream);
    }
    video.play();
  }, function(err) {
    alert(err);
  });

  video.addEventListener('canplay', function(e) {
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

}
