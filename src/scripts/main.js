import { updateLinks } from "./dataHandler.mjs";
import visualizer from "./dataVisualization.mjs";

const page = new visualizer("Home");

updateLinks();
page.run();