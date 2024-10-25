// Load WAVE script dynamically
function loadWaveScript(callback) {
  const script = document.createElement("script");
  script.src = "https://wave.webaim.org/wave.js";
  script.onload = callback;
  document.head.appendChild(script);
}

// Run the WAVE tool after script has loaded
function runWaveVerification() {
  if (typeof wave !== "undefined") {
    wave.run();
  } else {
    console.error("WAVE tool is not defined.");
  }
}

// Load the script and then run the verification
window.onload = function () {
  loadWaveScript(function () {
    setTimeout(runWaveVerification, 3000); // Delay for 3 seconds
  });
};
