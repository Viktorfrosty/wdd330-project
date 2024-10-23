import { symbolsData, updateLinks } from "./dataHandler.mjs";
import visualizer from "./dataVisualization.mjs";

symbolsData().then(() => {
  updateLinks(); // Rework is necessary.
  const page = new visualizer("Home");
  page.run();
});
