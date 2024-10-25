import dialer, { updateLinks } from "./main.mjs";
import { storedData } from "./dataHandler.mjs";
import visualizer from "./dataVisualization.mjs";

storedData().then(() => {
  updateLinks(); // Rework is necessary.
  const page = new visualizer("Home");
  const navigator = new dialer();
  navigator.generate();
  page.run();
});
