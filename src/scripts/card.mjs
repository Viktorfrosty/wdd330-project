import {
  checkFavorite,
  fetchData,
  saveFavorite,
  setIconRetriever,
  symbolInjector,
} from "./dataHandler.mjs";

let root;
let cardBox;
let cardInfo;
const fragment = document.createDocumentFragment();

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
      this.elementGenerator(valuesList, card, true);
    } else {
      this.elementGenerator(valuesList, card).then(() => {
        card.card_faces.forEach((face) => {
          this.elementGenerator(valuesList, face, true);
        });
      });
    }
  }
  async elementGenerator(list, object, condition = false) {
    if (document.getElementsByClassName("card_box").length === 0) {
      root = document.getElementById("root");
      cardBox = document.createElement("div");
      cardBox.setAttribute("class", "card_box");
    } else {
      root = document.getElementsByClassName("card_box")[0];
    }
    if (condition != false) {
      if (!object.flavor_name) {
        const name = document.createElement("h2");
        name.setAttribute("class", "name");
        name.textContent = object.name;
        cardInfo.appendChild(name);
      } else {
        const flavorName = document.createElement("h2");
        flavorName.setAttribute("class", "name");
        flavorName.textContent = object.flavor_name;
        fragment.appendChild(flavorName);
        const name = document.createElement("h3");
        name.setAttribute("class", "name");
        name.textContent = `(${object.name})`;
        fragment.appendChild(name);
      }
      const type = document.createElement("h3");
      type.setAttribute("class", "type");
      type.textContent = object.type_line;
      fragment.appendChild(type);
    }
    for (const property of list) {
      if (property !== "image_uris" && property in object) {
        const element = document.createElement("p");
        element.innerHTML = symbolInjector(object[property]);
        element.setAttribute("class", property);
        fragment.appendChild(element);
      } else if (property === "image_uris" && property in object) {
        const img = document.createElement("img");
        img.setAttribute("loading", "lazy");
        img.setAttribute("src", object[property]["large"]);
        img.setAttribute("alt", `${object.name} image.`);
        fragment.appendChild(img);
      }
    }
    if (object.set_id && object.set_name && object.set) {
      const setElement = document.createElement("a");
      const icon = await setIconRetriever(object.set_id);
      setElement.setAttribute(
        "href",
        `result.html?element=set&s=${object.set_id}&type=alphabetical&order=auto`,
      );
      setElement.innerHTML = `${object.set_name} (${object.set.toUpperCase()}) ${icon}`;
      fragment.appendChild(setElement);
    }
    if ("legalities" in object) {
      const box = document.createElement("div");
      box.setAttribute("class", "legalities");
      box.innerHTML = "<p>Legalities</p>";
      const list = document.createElement("ul");
      const ruleEntries = Object.entries(object["legalities"]);
      ruleEntries.forEach(([game_mode, legality]) => {
        let block = document.createElement("li");
        block.innerHTML = `<p class="game_mode">${game_mode}</p><p class="legality">${legality}</p>`;
        list.appendChild(block);
      });
      box.appendChild(list);
      fragment.appendChild(box);
    }
    if ("rulings_uri" in object) {
      const info = await fetchData(object.rulings_uri);
      if (info.data.length > 0) {
        const box = document.createElement("div");
        box.setAttribute("class", "rulings");
        box.innerHTML = `<h3>${object.name} Notes and Rules</h3>`;
        const rulingBox = document.createElement("ul");
        rulingBox.setAttribute("class", "rules_list");
        info.data.forEach((ruleElement) => {
          const rule = document.createElement("li");
          rule.innerHTML = `<p class="rule_text">${ruleElement.comment}</p><p class="rule_source">${ruleElement.source}</p><p class="rule_published">${ruleElement.published_at}</p>`;
          rulingBox.appendChild(rule);
        });
        box.appendChild(rulingBox);
        fragment.appendChild(box);
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
      fragment.appendChild(button);
    }
    if (document.getElementsByClassName("card_box").length === 0) {
      cardBox.appendChild(fragment);
      root.appendChild(cardBox);
    } else {
      cardBox.appendChild(fragment);
    }
  }
}
