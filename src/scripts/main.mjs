// rework: optimize main page module.
import search from "./dataHandler.mjs";
// Module configurations.
const root = document.getElementById("root");
// generate the main page.
export default class dialer {
  constructor() {}
  generate() {
    this.searchBox();
    this.wildCardButton();
    this.favoritesButton();
  }
  searchBox() {
    const syntax = [
      "name",
      "color",
      "identity",
      "mana value",
      "rarity",
      "type",
      "loyalty",
      "power",
      "toughness",
      "artist",
      "art",
      "function",
      "oracle",
      "flavor",
      "watermark",
      "number",
      "year",
      "border",
      "frame",
      "stamp",
      "format",
      "cube",
      "game",
      "is",
    ];
    const inputField = document.createElement("div");
    const select = document.createElement("select");
    syntax.forEach((element) => {
      const option = document.createElement("option");
      option.setAttribute("value", element !== "mana value" ? element : "manavalue");
      if (element === "name") {
        option.setAttribute("selected", "selected");
      }
      option.textContent = element;
      select.appendChild(option);
    });
    const input = document.createElement("input");
    input.setAttribute("placeholder", "search by...");
    const executeSearch = () => {
      const selectedValue = select.value;
      const inputValue = input.value;
      if (inputValue !== "") {
        const query = selectedValue !== "name" ? `${selectedValue}%3A${inputValue}` : inputValue;
        window.location.href = `result.html?element=list&s=${query}&type=name&order=asc&page=1`;
      }
    };
    const button = document.createElement("button");
    button.textContent = "🔍";
    button.onclick = executeSearch;
    input.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        executeSearch();
      }
    });
    inputField.appendChild(select);
    inputField.appendChild(input);
    inputField.appendChild(button);
    root.appendChild(inputField);
  }
  wildCardButton() {
    const button = document.createElement("button");
    button.textContent = "wild card";
    button.onclick = () => {
      const call = new search();
      call.getWildCard().then((card) => {
        window.location.href = `card.html?s=${card.id}`;
      });
    };
    root.appendChild(button);
  }
  favoritesButton() {
    const button = document.createElement("button");
    button.textContent = "Favorites";
    button.onclick = () => {
      window.location.href = "result.html?element=favorites&type=name&order=asc";
    };
    root.appendChild(button);
  }
}
