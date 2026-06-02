const videoElement = document.getElementById('cameraVideo');
const startButton = document.getElementById('startCamera');
const stopButton = document.getElementById('stopCamera');
const cameraMessage = document.getElementById('cameraMessage');
const videoOverlay = document.getElementById('videoOverlay');
let cameraStream = null;

async function startCamera() {
  cameraMessage.textContent = '';
  videoOverlay.textContent = 'Requesting camera...';
  videoOverlay.style.display = 'flex';

  try {
    const constraints = {
      audio: false,
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    };

    cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
    videoElement.srcObject = cameraStream;
    videoElement.play();

    startButton.disabled = true;
    stopButton.disabled = false;
    videoOverlay.style.display = 'none';
    cameraMessage.textContent = 'Camera is active. Point it at the QR or barcode.';
  } catch (error) {
    console.error('Camera start failed:', error);
    videoOverlay.textContent = 'Camera access denied or unavailable.';
    cameraMessage.textContent = 'Unable to open camera. Please allow camera permission or use a supported browser.';
  }
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }

  videoElement.srcObject = null;
  startButton.disabled = false;
  stopButton.disabled = true;
  videoOverlay.textContent = 'Camera stopped.';
  videoOverlay.style.display = 'flex';
  cameraMessage.textContent = 'Camera stopped. Tap Start Camera again to reopen it.';
}

startButton.addEventListener('click', startCamera);
stopButton.addEventListener('click', stopCamera);

if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
  videoOverlay.textContent = 'Starting camera...';
  window.addEventListener('load', () => {
    // Try automatic open on load. If the browser blocks it, the button remains available.
    startCamera();
  });
} else {
  videoOverlay.textContent = 'Camera not supported by this browser.';
  cameraMessage.textContent = 'Use a modern browser on mobile or laptop with camera permissions enabled.';
  startButton.disabled = true;
}
