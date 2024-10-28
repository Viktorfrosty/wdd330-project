import search, { getParams, getResults, resultRendering } from "./dataHandler.mjs";
import { storedData } from "./dataHandler.mjs";
import visualizer, { cardArrangement, createNavButtons, createSelector, nightMode } from "./dataVisualization.mjs";
import cardGlimpse, { resultsBox } from "./result.mjs";

let page;
let infoInstance;
let info;
let arrangedList;
let list;
let snippet;

const nm = new nightMode();
nm.load();

storedData().then(() => {
  const infoType = getParams("element");
  if (infoType !== "error") {
    if (infoType === "list" || infoType === "set") {
      createSelector("type");
      createSelector("order");
    }
    resultsBox();
    const type = getParams("type");
    const order = getParams("order");
    if (infoType === "list") {
      page = new visualizer("search results");
      info = new search(getParams("s", false));
      info.getSearchData().then(() => {
        createNavButtons();
        list = getResults();
        list.forEach((card) => {
          snippet = new cardGlimpse(card);
          snippet.render();
        });
      });
      page.run();
    } else if (infoType === "set") {
      info = new search(getParams("s", true));
      info.getSetData().then((retrievedInfo) => {
        page = new visualizer(`${retrievedInfo.name} (${retrievedInfo.code.toUpperCase()})`, retrievedInfo.object);
        createNavButtons();
        list = getResults();
        list.forEach((card) => {
          snippet = new cardGlimpse(card);
          snippet.render();
        });
        page.run();
      });
    } else if (infoType === "favorites") {
      page = new visualizer(infoType);
      infoInstance = new search();
      info = infoInstance.getFavorites();
      if (info === null) {
        page.noFavorites();
      } else {
        createSelector("type");
        createSelector("order");
        list = new cardArrangement(resultRendering(), type, order);
        createNavButtons(true);
        arrangedList = list.organize();
        arrangedList.forEach((card) => {
          snippet = new cardGlimpse(card, true);
          snippet.render();
        });
      }
      page.run();
    }
  } else {
    page = new visualizer("Information not found");
    page.run();
  }
});
