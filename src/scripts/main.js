import { updateLinks } from "./main.mjs";
import { symbolsData } from "./dataHandler.mjs";
import visualizer from "./dataVisualization.mjs";

symbolsData().then(() => {
  updateLinks(); // Rework is necessary.
  const page = new visualizer("Home");
  page.run();
});
