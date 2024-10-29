// Main page module.
import search from "./dataHandler.mjs";
// Module configurations.
let workBox;
// generate the main page.
export default class dialer {
  constructor() {}
  generate() {
    this.createPageSections();
    this.searchBox();
    this.wildCardButton();
    this.favoritesButton();
  }
  createPageSections() {
    const root = document.getElementById("root");
    const sections = ["main", "card", "set"];
    sections.foreach((section) => {
      const section = document.createElement("div");
      section.setAttribute("id", `${section[0]}_section`);
      root.appendchild(section);
    });
  }
  searchBox() {
    workBox = document.getElementById("main_section");
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
    workBox.appendChild(inputField);
  }
  wildCardButton() {
    workBox = document.getElementById("main_section");
    const button = document.createElement("button");
    button.textContent = "wild card";
    button.onclick = () => {
      const call = new search();
      call.getWildCard().then((card) => {
        window.location.href = `card.html?s=${card.id}`;
      });
    };
    workBox.appendChild(button);
  }
  favoritesButton() {
    workBox = document.getElementById("main_section");
    const button = document.createElement("button");
    button.textContent = "Favorites";
    button.onclick = () => {
      window.location.href = "result.html?element=favorites&type=name&order=asc";
    };
    workBox.appendChild(button);
  }
  cardOfToday() {
  
  }
  setOfToday() {
  }
}
