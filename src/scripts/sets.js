import { storedData } from "./dataHandler.mjs";
import Visualizer from "./dataVisualization.mjs";
import setsCatalog from "./sets.mjs";

storedData().then(() => {
  const page = new Visualizer("Sets");
  const catalog = new setsCatalog();
  catalog.generate();
  page.run();
});
