// Data visualization module.

// type and misc selector
export function createSelector(param) {
  const root = document.getElementById("root");
  const selector = document.createElement("div");
  selector.setAttribute("class", "selector");
  selector.setAttribute("id", param);

  const urlParams = new URLSearchParams(window.location.search);
  const selectedValue = urlParams.get(param);

  if (param === "type") {
    selector.innerHTML = `<label for="options">Sort by:</label>  
                          <select id="options">      
                            <option value="alphabetical" ${selectedValue === "alphabetical" ? "selected" : ""}>Alphabetical</option>    
                            <option value="rarity" ${selectedValue === "rarity" ? "selected" : ""}>Rarity</option>    
                            <option value="cmc" ${selectedValue === "cmc" ? "selected" : ""}>CMC</option>    
                            <option value="power" ${selectedValue === "power" ? "selected" : ""}>Power</option>    
                            <option value="toughness" ${selectedValue === "toughness" ? "selected" : ""}>Toughness</option>    
                            <option value="color" ${selectedValue === "color" ? "selected" : ""}>Color</option>    
                            <option value="released" ${selectedValue === "released" ? "selected" : ""}>Released</option>  
                          </select>`;
  } else if (param === "order") {
    selector.innerHTML = `<label for="options">Sort by:</label>  
                          <select id="options">    
                            <option value="auto" ${selectedValue === "auto" ? "selected" : ""}>auto</option>    
                            <option value="asce" ${selectedValue === "asce" ? "selected" : ""}>asce</option>    
                            <option value="desc" ${selectedValue === "desc" ? "selected" : ""}>desc</option>  
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

  root.appendChild(selector);
}

// Search results organizer.
export class arrangement {
  constructor(list, arrangement, misc = "auto") {
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
          this.list.sort((a, b) =>
            a.color_identity
              .join(", ")
              .localeCompare(b.color_identity.join(", ")),
          );
        } else if (this.misc === "desc") {
          this.list.sort((a, b) =>
            b.color_identity
              .join(", ")
              .localeCompare(a.color_identity.join(", ")),
          );
        }
        break;
      case "released":
        if (this.misc === "asce" || this.misc === "auto") {
          this.list.sort(
            (a, b) => new Date(a.released_at) - new Date(b.released_at),
          );
        } else if (this.misc === "desc") {
          this.list.sort(
            (a, b) => new Date(b.released_at) - new Date(a.released_at),
          );
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
    // Execute the functions.
    this.headTitleChanger(this.title, this.type, this.misc, this.number);
    // this.pageTitleChanger(this.title);
  }
  headTitleChanger(title, type, misc, number) {
    // Customize the page title and meta title.
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
  pageTitleChanger(title) {
    // customize the title of the page.
    const header = document.querySelector("header");
    const testBox = document.createElement("h1");
    testBox.textContent = title;
    header.appendChild(testBox);
  }
}
