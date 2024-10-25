import search, { getParams } from "./dataHandler.mjs";
import { storedData } from "./dataHandler.mjs";
import visualizer, {
  cardArrangement,
  createSelector,
} from "./dataVisualization.mjs";
import cardGlimpse, { resultsBox } from "./result.mjs";

storedData().then(() => {
  createSelector("type");
  createSelector("order");
  resultsBox();
  let info = null;
  let page = null;
  const type = getParams("type");
  const order = getParams("order");
  const infoType = getParams("element");
  if (infoType === "list") {
    info = new search(getParams("s", false));
    page = new visualizer("search results");
    info.getSearchData().then((retrievedInfo) => {
      const arrangedList = new cardArrangement(retrievedInfo, type, order);
      const list = arrangedList.organize();
      list.forEach((card) => {
        const snippet = new cardGlimpse(card);
        snippet.render();
      });
    });
    page.run();
  } else if (infoType === "set") {
    info = new search(getParams("s"));
    info.getSetData().then((retrievedInfo) => {
      const name = `${retrievedInfo.setData.name} (${retrievedInfo.setData.code.toUpperCase()})`;
      const page = new visualizer(name, retrievedInfo.setData.object);
      const arrangedList = new cardArrangement(
        retrievedInfo.setCards,
        type,
        order,
      );
      const list = arrangedList.organize();
      list.forEach((card) => {
        const snippet = new cardGlimpse(card);
        snippet.render();
      });
      page.run();
    });
  }
});
