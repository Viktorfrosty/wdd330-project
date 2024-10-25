import dialer from "./main.mjs";
import { storedData } from "./dataHandler.mjs";
import visualizer from "./dataVisualization.mjs";

storedData().then(() => {
  const page = new visualizer("Home");
  const navigator = new dialer();
  navigator.generate();
  page.run();
});
