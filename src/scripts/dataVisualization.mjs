// Data visualization module.
import { getLocalStorage, getParams, setLocalStorage } from "./dataHandler.mjs";
// Module configurations.
const root = document.getElementById("root");
let background = document.querySelector("body");
let urlParams;
let active;
let loaded;
let messageTitle = document.createElement("h1");
let messageParaph = document.createElement("h3");
let header;
let lastPage;
// let buttonsValues;
let buttonsValues = [
  ["<<", "f_page"],
  ["<", "b_page"],
  [">", "n_page"],
  [">>", "l_page"],
];
// Night mode.
export class nightMode {
  constructor() {}
  load() {
    this.check();
    this.createNmButton();
  }
  check(firstRun = true) {
    if (firstRun) {
      active = getLocalStorage("night-mode");
      switch (active) {
        case null:
          this.modeOff();
          break;
        case true:
          this.modeOn();
          break;
        case false:
          this.modeOff();
          break;
      }
    } else {
      active = getLocalStorage("night-mode");
      switch (active) {
        case true:
          return true;
        case false:
          return false;
      }
    }
  }
  modeOn() {
    setLocalStorage("night-mode", true);
    background.style.backgroundColor = "var(--secondary-color)";
    background.style.color = "var(--detail1-color)";
    background.classList.toggle("dark", true);
  }
  modeOff() {
    setLocalStorage("night-mode", false);
    background.style.backgroundColor = "var(--detail1-color)";
    background.style.color = "var(--detail2-color)";
    background.classList.toggle("dark", false);
  }
  createNmButton() {
    const button = document.createElement("button");
    header = document.querySelector("header");
    loaded = this.check(false);
    if (loaded) {
      button.textContent = "⚪️";
    } else {
      button.textContent = "";
    }
    button.setAttribute("id", "night_mode");
    button.addEventListener("click", () => {
      switch (button.textContent) {
        case "⚪️":
          this.modeOff();
          button.textContent = "";
          break;
        case "":
          this.modeOn();
          button.textContent = "⚪️";
          break;
      }
    });
    header.appendChild(button);
  }
}
// type text converter.
export function specialCharacterConverter(text, regex, replace) {
  const matches = text.match(regex);
  if (matches) {
    matches.forEach((specialCharacter) => {
      text = text.replace(specialCharacter, replace);
    });
  }
  return text;
}
// type and misc selector
export function createSelector(param) {
  const selector = document.createElement("div");
  header = document.getElementById("page-header");
  selector.setAttribute("class", "selector");
  selector.setAttribute("id", param);
  urlParams = new URLSearchParams(window.location.search);
  const selectedValue = urlParams.get(param);
  if (param === "type") {
    selector.innerHTML = `<label for="options">Sort by:</label>  
                          <select class="options">      
                            <option value="name" ${selectedValue === "name" ? "selected" : ""}>Name</option>    
                            <option value="rarity" ${selectedValue === "rarity" ? "selected" : ""}>Rarity</option>    
                            <option value="cmc" ${selectedValue === "cmc" ? "selected" : ""}>CMC</option>    
                            <option value="power" ${selectedValue === "power" ? "selected" : ""}>Power</option>    
                            <option value="toughness" ${selectedValue === "toughness" ? "selected" : ""}>Toughness</option>    
                            <option value="color" ${selectedValue === "color" ? "selected" : ""}>Color</option>    
                            <option value="released" ${selectedValue === "released" ? "selected" : ""}>Released</option>  
                          </select>`;
  } else if (param === "order") {
    selector.innerHTML = `<label for="options">order by:</label>
                          <select class="options">    
                            <option value="asc" ${selectedValue === "asc" ? "selected" : ""}>Asc</option>    
                            <option value="desc" ${selectedValue === "desc" ? "selected" : ""}>Desc</option>  
                          </select>`;
  }
  const selectElement = selector.querySelector("select");
  selectElement.addEventListener("change", function () {
    const newValue = this.value;
    if (selectedValue !== newValue) {
      urlParams.set(param, newValue);
      window.location.search = urlParams.toString();
    }
  });
  header.appendChild(selector);
}
// create result page navigations buttons.
export function createNavButtons(inFavorite = false) {
  const display = document.createElement("div");
  display.setAttribute("id", "display");
  if (inFavorite) {
    const searchRange = getLocalStorage("search-range");
    const favoritesLength = getLocalStorage("favorites").length;
    lastPage = Math.floor((favoritesLength - 1) / 50) * 50;
    buttonsValues[0][2] = [0, 49];
    buttonsValues[1][2] = [Math.max(searchRange[0] - 50, 0), Math.max(searchRange[1] - 50, 49)];
    buttonsValues[2][2] = [Math.min(searchRange[0] + 50, lastPage), Math.min(searchRange[1] + 50, favoritesLength - 1)];
    buttonsValues[3][2] = [lastPage, favoritesLength - 1];
    buttonsValues.forEach((value) => {
      const button = document.createElement("button");
      button.setAttribute("class", "nav");
      button.setAttribute("id", value[1]);
      if (favoritesLength > 50) {
        button.textContent = value[2][0] === searchRange[0] && value[2][1] === searchRange[1] ? "✖️" : value[0];
      } else {
        button.textContent = "✖️";
      }
      if (button.textContent !== "✖️") {
        button.addEventListener("click", () => {
          setLocalStorage("search-range", value[2]);
          window.location.reload();
        });
      }
      display.appendChild(button);
    });
  } else {
    urlParams = new URLSearchParams(window.location.search);
    const storedInfo = getLocalStorage("search-page-count");
    const actualPage = parseInt(getParams("page"), 10);
    lastPage = storedInfo.pageCount;
    buttonsValues[0][2] = 1;
    buttonsValues[1][2] = actualPage - 1;
    buttonsValues[2][2] = actualPage + 1;
    buttonsValues[3][2] = lastPage;
    buttonsValues.forEach((value) => {
      const button = document.createElement("button");
      button.setAttribute("class", "nav");
      button.setAttribute("id", value[1]);
      if (
        lastPage === 1 ||
        (actualPage === 1 && value[1] !== "n_page" && value[1] !== "l_page") ||
        (actualPage === lastPage && value[1] !== "b_page" && value[1] !== "f_page")
      ) {
        button.textContent = "✖️";
      } else {
        button.textContent = value[0];
        button.addEventListener("click", () => {
          urlParams.set("page", value[2]);
          window.location.search = urlParams.toString();
        });
      }
      display.appendChild(button);
    });
  }
  root.appendChild(display);
}
// Search results organizer.
export class cardArrangement {
  constructor(list, arrangement, misc) {
    this.list = list;
    this.arrangement = arrangement;
    this.misc = misc;
  }
  organize() {
    switch (this.arrangement) {
      case "alphabetical":
        if (this.misc === "asce" || this.misc === "auto") {
          this.list.sort((a, b) => a.name.localeCompare(b.name));
        } else if (this.misc === "desc") {
          this.list.sort((a, b) => b.name.localeCompare(a.name));
        }
        break;
      case "rarity":
        if (this.misc === "asce" || this.misc === "auto") {
          this.list.sort((a, b) => a.rarity.localeCompare(b.rarity));
        } else if (this.misc === "desc") {
          this.list.sort((a, b) => b.rarity.localeCompare(a.rarity));
        }
        break;
      case "cmc":
        if (this.misc === "asce" || this.misc === "auto") {
          this.list.sort((a, b) => a.cmc - b.cmc);
        } else if (this.misc === "desc") {
          this.list.sort((a, b) => b.cmc - a.cmc);
        }
        break;
      case "power":
        if (this.misc === "asce" || this.misc === "auto") {
          this.list.sort((a, b) => a.power - b.power);
        } else if (this.misc === "desc") {
          this.list.sort((a, b) => b.power - a.power);
        }
        break;
      case "toughness":
        if (this.misc === "asce" || this.misc === "auto") {
          this.list.sort((a, b) => a.toughness - b.toughness);
        } else if (this.misc === "desc") {
          this.list.sort((a, b) => b.toughness - a.toughness);
        }
        break;
      case "color":
        if (this.misc === "asce" || this.misc === "auto") {
          this.list.sort((a, b) => a.color_identity.join(", ").localeCompare(b.color_identity.join(", ")));
        } else if (this.misc === "desc") {
          this.list.sort((a, b) => b.color_identity.join(", ").localeCompare(a.color_identity.join(", ")));
        }
        break;
      case "released":
        if (this.misc === "asce" || this.misc === "auto") {
          this.list.sort((a, b) => new Date(a.released_at) - new Date(b.released_at));
        } else if (this.misc === "desc") {
          this.list.sort((a, b) => new Date(b.released_at) - new Date(a.released_at));
        }
        break;
    }
    return this.list;
  }
}
// page info modifier.
export default class Visualizer {
  constructor(title = "Default", type = "", misc = "", number = "") {
    this.title = title;
    this.type = type;
    this.misc = misc;
    this.number = number;
  }
  run() {
    this.headTitleChanger(this.title, this.type, this.misc, this.number);
    if (this.title === "Information not found") {
      this.errorPage();
    }
  }
  headTitleChanger(title, type, misc, number) {
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const metaTitle = document.getElementById("head-title");
    if (type !== "") {
      type = `${type}:`;
    }
    if (misc !== "") {
      misc = `- Set: ${misc}`;
    }
    if (number !== "") {
      number = `(#${number})`;
    }
    metaTitle.textContent = `${capitalize(type)} ${title} ${number} ${misc} | Trading Cards Info Tracker`;
  }
  errorPage() {
    root.setAttribute("class", "error");
    messageTitle.textContent = "Sorry, the information was not found";
    messageParaph.innerHTML = "Go back to <a href='index.html'>Home</a> and try again with other search parameters.";
    root.appendChild(messageTitle);
    root.appendChild(messageParaph);
  }
  noFavorites() {
    root.setAttribute("class", "error");
    messageTitle.textContent = "Sorry, there are not favorites saved";
    messageParaph.innerHTML = "Go back to <a href='index.html'>Home</a> and search for a card that you like.";
    root.appendChild(messageTitle);
    root.appendChild(messageParaph);
  }
}
