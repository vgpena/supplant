let video = null;
let canvas = null;
let streaming = false;

function drawToCanvas() {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'source-over';

  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const faces = ccv.detect_objects({
    canvas: ccv.pre(canvas),
    cascade: cascade,
    interval: 2,
    min_neighbors: 1
  });

  if (faces.length) {
    faces.forEach(function(face) {
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.rect(face.x, face.y, face.width, face.height);
      ctx.stroke();
      ctx.closePath();
    });
  }

  window.requestAnimationFrame(function() {
    drawToCanvas();
  });
}

window.onload = function() {
  video = document.getElementById('video');
  canvas = document.getElementById('canvas');

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

    if (!streaming) {
      height = video.videoHeight / (video.videoWidth / width);
    }

    video.setAttribute('width', width);
    video.setAttribute('height', height);
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    streaming = true;

    window.requestAnimationFrame(drawToCanvas);
  }, false);

}
