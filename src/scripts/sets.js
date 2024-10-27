import { storedData } from "./dataHandler.mjs";
import Visualizer, { nightMode } from "./dataVisualization.mjs";
import setsCatalog from "./sets.mjs";

const nm = new nightMode();
nm.load();

storedData().then(() => {
  const page = new Visualizer("Sets");
  const catalog = new setsCatalog();
  catalog.generate();
  page.run();
});
