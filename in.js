"use strict";

let video = null;
let videoOutput = null;
let streaming = false;


function addEnergy(spaces, callback) {
  const ctx = videoOutput.getContext('2d');

  spaces.forEach((space) => {
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
    faces.forEach(function(face) {
      spaces.push(face.x + (face.width / 2));
    });
    addEnergy(spaces, () => {
      window.requestAnimationFrame(function() {
        drawToCanvas();
      });
    });
  } else {
    window.requestAnimationFrame(function() {
      drawToCanvas();
    });
  }
}

window.onload = function() {
  video = document.getElementById('video');
  videoOutput = document.getElementById('videoOutput');

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
