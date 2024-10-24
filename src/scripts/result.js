import searchData, { getParams } from "./dataHandler.mjs";
import { symbolsData } from "./dataHandler.mjs";
import visualizer, {
  arrangement,
  createSelector,
} from "./dataVisualization.mjs";
import cardGlimpse, { resultsBox } from "./result.mjs";

symbolsData().then(() => {
  createSelector("type");
  createSelector("order");
  resultsBox();
  const page = new visualizer("search results");
  const search = new searchData(getParams("q", false));
  const type = getParams("type");
  const order = getParams("order");
  search.fetchData().then((searchedInfo) => {
    const arrangedList = new arrangement(searchedInfo, type, order);
    const list = arrangedList.organize();
    list.forEach((card) => {
      const snippet = new cardGlimpse(card);
      snippet.render();
    });
  });
  page.run();
});
