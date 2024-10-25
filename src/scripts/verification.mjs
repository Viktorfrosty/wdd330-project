window.onload = function () {
  const script = document.createElement("script");
  script.src = "https://wave.webaim.org/wave.js";
  script.onload = function () {
    setTimeout(() => {
      if (typeof wave !== "undefined") {
        wave.run();
      } else {
        console.error("WAVE tool is not defined.");
      }
    }, 9000);
  };
  document.head.appendChild(script);
};
