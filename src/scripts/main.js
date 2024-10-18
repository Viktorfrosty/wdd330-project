import { symbolsData, updateLinks } from "./dataHandler.mjs";
import visualizer from "./dataVisualization.mjs";

const page = new visualizer("Home");

symbolsData().then(() => {
  updateLinks(); // erase later.
  page.run();
});
