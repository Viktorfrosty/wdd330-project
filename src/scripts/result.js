import search, { getParams } from "./dataHandler.mjs";
import { storedData } from "./dataHandler.mjs";
import visualizer, {
  cardArrangement,
  createSelector,
} from "./dataVisualization.mjs";
import cardGlimpse, { resultsBox } from "./result.mjs";

storedData().then(() => {
  const infoType = getParams("element");
  if (infoType !== "error") {
    if (infoType === "list" || infoType === "set") {
      createSelector("type");
      createSelector("order");
    }
    resultsBox();
    let info = null;
    let page = null;
    const type = getParams("type");
    const order = getParams("order");
    if (infoType === "list") {
      info = new search(getParams("s", false));
      page = new visualizer("search results");
      info.getSearchData().then((retrievedInfo) => {
        const arrangedList = new cardArrangement(retrievedInfo, type, order);
        const list = arrangedList.organize();
        list.forEach((card) => {
          console.warn("cards in this page.");
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
          console.warn("cards in this page.");
          const snippet = new cardGlimpse(card);
          snippet.render();
        });
        page.run();
      });
    } else if (infoType === "favorites") {
      const page = new visualizer(infoType);
      const infoInstance = new search();
      const info = infoInstance.getFavorites();
      if (info === null) {
        page.noFavorites();
      } else {
        createSelector("type");
        createSelector("order");
        const arrangedList = new cardArrangement(info, type, order);
        const list = arrangedList.organize();
        list.forEach((card) => {
          console.warn("cards in this page.");
          const snippet = new cardGlimpse(card, true);
          snippet.render();
        });
      }
      page.run();
    }
  } else {
    const page = new visualizer("Information not found");
    page.run();
  }
});
