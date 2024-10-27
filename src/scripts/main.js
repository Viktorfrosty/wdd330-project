import dialer from "./main.mjs";
import { storedData } from "./dataHandler.mjs";
import visualizer, { nightMode } from "./dataVisualization.mjs";

const nm = new nightMode();
nm.load();

storedData().then(() => {
  const page = new visualizer("Home");
  const navigator = new dialer();
  navigator.generate();
  page.run();
});
