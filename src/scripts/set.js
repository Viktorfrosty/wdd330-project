import { setData, getParams } from "./dataHandler.mjs";
import Visualizer from "./dataVisualization.mjs";

const setName = getParams("name");

const set = new setData(setName);

set.fetchCardData().then((setInfo) => {
  const set = new Visualizer(setInfo.name, setInfo.object);
  console.log(setInfo);
  set.run();
});
