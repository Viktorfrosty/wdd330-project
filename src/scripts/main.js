import { aeMiBanana } from "./main.mjs";
import { headTitleChanger, headDescriptionChanger, renderPageElements } from "./dataVisualization.mjs";
import { fetchData } from "./dataHandler.mjs";

const description = "lorem ipsum";

headTitleChanger("Home");
headDescriptionChanger(description);
renderPageElements();
aeMiBanana();

const card = fetchData();
console.log(card);