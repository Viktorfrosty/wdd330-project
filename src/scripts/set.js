import {
  setData,
  getParams,
  updateLinks,
  symbolsData,
} from "./dataHandler.mjs";
import Visualizer from "./dataVisualization.mjs";

symbolsData().then(() => {
  updateLinks(); // erase later.

  const setName = getParams("name");
  const set = new setData(setName);

  set.fetchData().then((setInfo) => {
    const set = new Visualizer(setInfo.name, setInfo.object);
    console.log(`Retireved info:`);
    console.log(setInfo);
    set.run();
  });
});
