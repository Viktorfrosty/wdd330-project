import searchData, { getParams } from "./dataHandler.mjs";
import { symbolsData } from "./dataHandler.mjs";
import visualizer from "./dataVisualization.mjs";
import cardGlimpse, { resultsBox } from "./result.mjs";

symbolsData().then(() => {
  const search = new searchData(getParams("q", false));
  search.fetchData().then((searchInfo) => {
    resultsBox();
    const page = new visualizer("search results");
    searchInfo.data.forEach((card) => {
      const snippet = new cardGlimpse(card);
      snippet.render();
    });
    page.run();
  });
});
