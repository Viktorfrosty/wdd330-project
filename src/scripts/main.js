import { updateLinks } from "./main.mjs";
import { storedData } from "./dataHandler.mjs";
import visualizer from "./dataVisualization.mjs";

storedData().then(() => {
  updateLinks(); // Rework is necessary.
  const page = new visualizer("Home");
  page.run();
});
