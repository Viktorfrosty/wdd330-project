import { setData, getParams, updateLinks } from "./dataHandler.mjs";
import Visualizer from "./dataVisualization.mjs";

updateLinks();
const setName = getParams("name");

const set = new setData(setName);

set.fetchCardData().then((setInfo) => {
  const set = new Visualizer(setInfo.name, setInfo.object);
  console.log(`Retireved info:`);
  console.log(setInfo);
  set.run();
});
