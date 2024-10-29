// Main page module.
import search, { setLocalStorage, getLocalStorage, dataExpirationCheck } from "./dataHandler.mjs";
import CardGlimpse from "./result.mjs";
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
    this.dayRenderer();
  }
  createPageSections() {
    const root = document.getElementById("root");
    root.setAttribute("class", "main_page");
    const sections = ["main", "card"];
    const title = document.createElement("h1");
    title.textContent = "Trading Cards Info Tracker";
    const slogan = document.createElement("h2");
    slogan.textContent = "The place where you can find information about every card of Magic the Gathering.";
    root.appendChild(title);
    root.appendChild(slogan);
    sections.forEach((section) => {
      const workBox = document.createElement("div");
      workBox.setAttribute("id", `${section}_section`);
      root.appendChild(workBox);
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
    inputField.setAttribute("id", "input_field");
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
    input.setAttribute("placeholder", "what are you looking for?");
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
    const inputHeader = document.createElement("h3");
    inputHeader.textContent = "Search by...";
    inputField.appendChild(inputHeader);
    inputField.appendChild(select);
    inputField.appendChild(input);
    inputField.appendChild(button);
    workBox.appendChild(inputField);
  }
  wildCardButton() {
    workBox = document.getElementById("main_section");
    const buttonBox = document.createElement("div");
    buttonBox.setAttribute("id", "wild_button");
    const buttonLabel = document.createElement("h3");
    buttonLabel.textContent = "Or better get a...";
    const button = document.createElement("button");
    button.textContent = "wild card";
    button.onclick = () => {
      const call = new search();
      call.getWildCard().then((card) => {
        window.location.href = `card.html?s=${card.id}`;
      });
    };
    buttonBox.appendChild(buttonLabel);
    buttonBox.appendChild(button);
    workBox.appendChild(buttonBox);
  }
  favoritesButton() {
    workBox = document.getElementById("main_section");
    const buttonLabel = document.createElement("h3");
    buttonLabel.innerHTML = "Did you pick any card?<br>Then go to...";
    const buttonBox = document.createElement("div");
    buttonBox.setAttribute("id", "fav_button");
    const button = document.createElement("button");
    button.textContent = "Favorites";
    button.onclick = () => {
      window.location.href = "result.html?element=favorites&type=name&order=asc";
    };
    buttonBox.appendChild(buttonLabel);
    buttonBox.appendChild(button);
    workBox.appendChild(buttonBox);
  }
  dayRenderer() {
    let searchData;
    const section = "card_section";
    workBox = document.getElementById(section);
    const storedInfo = getLocalStorage("front-card");
    const label = document.createElement("h3");
    label.textContent = "Today's random card pick:";
    workBox.append(label);
    if (!storedInfo || !dataExpirationCheck(storedInfo.date, false)) {
      searchData = new search();
      searchData.getWildCard().then((card) => {
        const newDate = new Date();
        let date = newDate.getTime();
        setLocalStorage("front-card", { card, date });
      });
    } else {
      searchData = storedInfo.card;
      const glimpse = new CardGlimpse(searchData, false, section);
      glimpse.render();
    }
  }
}
