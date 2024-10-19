import searchData from "./dataHandler.mjs";
import { symbolsData, updateLinks } from "./dataHandler.mjs";
import visualizer from "./dataVisualization.mjs";
import cardGlimpse, { resultsBox } from "./main.mjs";

const page = new visualizer("Home");
page.run();

symbolsData().then(() => {
  updateLinks(); // Consider removing this line if not needed later.
  const params = "search?q=c%3Awhite+mv%3D1"; // Rework this if necessary.
  const search = new searchData(params);
  search.fetchData().then((searchInfo) => {
    resultsBox();
    searchInfo.data.forEach(card => {
      const snippet = new cardGlimpse(card);
      snippet.render();
    });
  });
});
