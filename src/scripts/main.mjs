import search from "./dataHandler.mjs";

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
      if (element !== "mana value") {
        option.setAttribute("value", element);
      } else {
        option.setAttribute("value", "manavalue");
      }
      if (element === "name") {
        option.setAttribute("selected", "selected");
      }
      option.textContent = element;
      select.appendChild(option);
    });
    const input = document.createElement("input");
    input.setAttribute("placeholder", "search by...");
    const button = document.createElement("button");
    button.textContent = "🔍";
    button.onclick = () => {
      const selectedValue = select.value;
      const inputValue = input.value;
      if (inputValue !== "") {
        if (selectedValue !== "name") {
          window.location.href = `result.html?element=list&s=${selectedValue}%3A${inputValue}&type=alphabetical&order=auto&page=1`;
        } else {
          window.location.href = `result.html?element=list&s=${inputValue}&type=alphabetical&order=auto&page=1`;
        }
      }
    };
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
      window.location.href = "result.html?element=favorites&type=alphabetical&order=auto";
    };
    root.appendChild(button);
  }
}
