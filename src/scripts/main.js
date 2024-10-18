import {
  symbolsData,
  updateLinks,
} from "./dataHandler.mjs";
import visualizer from "./dataVisualization.mjs";

const page = new visualizer("Home");

symbolsData();
updateLinks(); // erase later.
page.run();
