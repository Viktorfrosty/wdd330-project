// Card page module.
import { checkFavorite, fetchData, saveFavorite, setIconRetriever, symbolInjector } from "./dataHandler.mjs";
import { specialCharacterConverter } from "./dataVisualization.mjs";
// Module configurations.
const usRegex = /(?<=[a-z])_(?=[a-z])/g;
const usReplace = " ";
const bracketRegex = /[{}]/g;
const bracketReplace = "";
// Generate elements and organize the card details.
export class cardDetails {
  constructor(card) {
    this.card = card;
  }
  render() {
    this.cardInfoOrganizer(this.card);
  }
  cardInfoOrganizer(card) {
    const valuesList = [
      "color_identity",
      "color_indicator",
      "colors",
      "mana_cost",
      "cmc",
      "defense",
      "power",
      "toughness",
      "loyalty",
      "hand_modifier",
      "life_modifier",
      "produced_mana",
      "oracle_text",
      "keywords",
      "flavor_text",
      "attraction_lights",
      "collector_number",
      "rarity",
      "reprint",
      "released_at",
      "finishes",
      "artist",
      "image_uris",
    ];
    if (!card.card_faces) {
      this.elementGenerator(valuesList, card);
    } else {
      this.elementGenerator(valuesList, card, false).then(() => {
        card.card_faces.forEach((face) => {
          this.elementGenerator(valuesList, face, true, true);
        });
      });
    }
  }
  async elementGenerator(list, object, name = true, face = false) {
    const root = document.getElementById("root");
    let mainBox;
    if (!face) {
      mainBox = document.createElement("div");
      mainBox.setAttribute("id", "card_visualizer");
    } else {
      mainBox = document.getElementById("card_visualizer");
    }
    let textBox = document.createElement("div");
    if (!document.getElementById("card_data")) {
      textBox = document.createElement("div");
      textBox.setAttribute("id", "card_data");
    } else {
      textBox = document.getElementById("card_data");
    }
    const cardMainData = document.createElement("div");
    if (face) {
      cardMainData.setAttribute("class", "face_data");
      const faceElements = document.getElementsByClassName("face_data");
      if (faceElements.length === 0) {
        cardMainData.classList.toggle("front", true);
        cardMainData.classList.toggle("back", false);
      } else {
        cardMainData.classList.toggle("front", false);
        cardMainData.classList.toggle("back", true);
      }
    } else {
      cardMainData.setAttribute("id", "main_data");
      cardMainData.removeAttribute("class");
    }
    if (name) {
      if (!object.flavor_name) {
        const name = document.createElement("h2");
        name.setAttribute("class", "name");
        name.textContent = object.name;
        cardMainData.appendChild(name);
      } else {
        const flavorName = document.createElement("h2");
        flavorName.setAttribute("class", "name");
        flavorName.textContent = object.flavor_name;
        cardMainData.appendChild(flavorName);
        const name = document.createElement("h3");
        name.setAttribute("class", "name");
        name.textContent = `(${object.name})`;
        cardMainData.appendChild(name);
      }
      const type = document.createElement("h3");
      type.setAttribute("class", "type");
      type.textContent = object.type_line;
      cardMainData.appendChild(type);
    } else {
      const indicator = document.createElement("h3");
      indicator.setAttribute("class", "name");
      indicator.textContent = "General Card Information";
      cardMainData.appendChild(indicator);
    }
    for (const property of list) {
      if (property !== "image_uris" && property in object) {
        const label = specialCharacterConverter(property, usRegex, usReplace);
        const element = document.createElement("p");
        const modifiedText = symbolInjector(object[property]);
        if (modifiedText.length > 0) {
          element.innerHTML = `${label}: ${specialCharacterConverter(modifiedText, bracketRegex, bracketReplace)}`;
          element.setAttribute("class", property);
          cardMainData.appendChild(element);
        }
      } else if (property === "image_uris" && property in object) {
        const img = document.createElement("img");
        img.setAttribute("class", "card_img");
        img.setAttribute("loading", "lazy");
        img.setAttribute("src", object[property]["large"]);
        img.setAttribute("alt", `${object.name} image.`);
        mainBox.appendChild(img);
      }
    }
    if (object.set_id && object.set_name && object.set) {
      const setElement = document.createElement("a");
      const icon = await setIconRetriever(object.set_id);
      setElement.setAttribute("href", `result.html?element=set&s=${object.set}&type=name&order=asc`);
      setElement.innerHTML = `Set: ${object.set_name} (${object.set.toUpperCase()}) ${icon}`;
      cardMainData.appendChild(setElement);
    }
    if ("legalities" in object && !document.getElementById("legalities")) {
      const box = document.createElement("div");
      box.setAttribute("id", "legalities");
      box.innerHTML = "<p>Legalities</p>";
      const list = document.createElement("ul");
      const ruleEntries = Object.entries(object["legalities"]);
      ruleEntries.forEach(([game_mode, legality]) => {
        switch (game_mode) {
          case "standardbrawl":
            game_mode = "standard brawl";
            break;
          case "paupercommander":
            game_mode = "pauper commander";
            break;
          case "predh":
            game_mode = "pre edh";
            break;
          case "oldschool":
            game_mode = "old school";
            break;
          case "premodern":
            game_mode = "pre modern";
            break;
        }
        let block = document.createElement("li");
        block.innerHTML = `<p class="game_mode">${game_mode}:</p><p class="legality ${legality}">${specialCharacterConverter(legality, usRegex, usReplace)}</p>`;
        list.appendChild(block);
      });
      box.appendChild(list);
      mainBox.appendChild(box);
    }
    if ("rulings_uri" in object && !document.getElementById("rulings")) {
      const info = await fetchData(object.rulings_uri);
      if (info.data.length > 0) {
        const box = document.createElement("div");
        box.setAttribute("id", "rulings");
        box.innerHTML = `<h3>${object.name} Notes and Rules</h3>`;
        const rulingBox = document.createElement("ul");
        rulingBox.setAttribute("class", "rules_list");
        info.data.forEach((ruleElement) => {
          const rule = document.createElement("li");
          rule.innerHTML = `<p class="rule_text">${symbolInjector(ruleElement.comment)}</p><p class="rule_source">${ruleElement.source}</p><p class="rule_published">(${ruleElement.published_at})</p>`;
          rulingBox.appendChild(rule);
        });
        box.appendChild(rulingBox);
        mainBox.appendChild(box);
      }
    }
    if (!document.getElementById("favorites_button")) {
      const button = document.createElement("button");
      button.setAttribute("id", "favorites_button");
      let inList = checkFavorite(object);
      if (inList === true) {
        button.textContent = "In favorites ❤️";
      } else {
        button.textContent = "Add to favorites";
        button.onclick = () => {
          if (button.textContent !== "In favorites ❤️") {
            saveFavorite(object);
            button.textContent = "In favorites ❤️";
          }
        };
      }
      cardMainData.appendChild(button);
    }
    if (document.getElementById("main_data")) {
      const firstBox = document.getElementById("main_data");
      firstBox.setAttribute("class", "multi");
    }
    let imageList = document.getElementsByClassName("card_img");
    if (imageList.length >= 2) {
      imageList[0].classList.toggle("hidden", false);
      imageList[1].classList.toggle("hidden", true);
    }
    const altButton = document.createElement("button");
    altButton.setAttribute("id", "alt_button");
    altButton.textContent = "Change Face";
    altButton.onclick = () => {
      imageList[0].classList.toggle("hidden");
      imageList[1].classList.toggle("hidden");
    };
    altButton.setAttribute("id", "alt_button");
    if (!document.getElementById("alt_button") && imageList.length >= 2) {
      mainBox.append(altButton);
    }
    textBox.appendChild(cardMainData);
    mainBox.appendChild(textBox);
    root.appendChild(mainBox);
  }
}
