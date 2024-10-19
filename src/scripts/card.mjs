import { setIconRetriever, symbolInjector } from "./dataHandler.mjs";

// Generate the desired elements.
async function elementGenerator(list, object, face = false) {
  const root = document.getElementById("root");
  if (face != false) {
    const name = document.createElement("h2");
    name.setAttribute("class", "f_name");
    name.textContent = object["name"];
    root.appendChild(name);
  }
  for (const property of list) {
    if (property === "set_id" && object.set_id) {
      const element = document.createElement("p");
      element.innerHTML = await setIconRetriever(object[property]);
      element.setAttribute("id", property);
      root.appendChild(element);
    } else if (property !== "image_uris" && property in object) {
      const element = document.createElement("p");
      element.innerHTML = symbolInjector(object[property]);
      element.setAttribute("id", property);
      root.appendChild(element);
    } else if (property === "image_uris" && property in object) {
      if ("normal" in object[property]) {
        const img = document.createElement("img");
        img.setAttribute("loading", "lazy");
        img.setAttribute("src", object[property]["normal"]);
        img.setAttribute("alt", `${object.name} image.`);
        root.appendChild(img);
      }
    }
  }
  if ("legalities" in object) {
    const list = document.createElement("ul");
    const ruleEntries = Object.entries(object["legalities"]);
    ruleEntries.forEach(([game_mode, legality]) => {
      let block = document.createElement("li");
      block.innerHTML = `<p class="game_mode">${game_mode}</p><p class="legality">${legality}</p>`;
      list.appendChild(block);
    });
    root.appendChild(list);
  }
}

// Organize the card details.
export default class CardDetails {
  constructor(card) {
    this.card = card;
  }
  render() {
    this.cardInfoOrganizer(this.card);
  }
  cardInfoOrganizer(card) {
    const valuesList = [
      "type",
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
      "flavor_name",
      "flavor_text",
      "attraction_lights",
      "set_name",
      "set",
      "set_id",
      "collector_number",
      "rarity",
      "reprint",
      "released_at",
      "finishes",
      "artist",
      "image_uris",
    ];
    if (!card.card_faces) {
      elementGenerator(valuesList, card);
    } else {
      elementGenerator(valuesList, card).then(() => {
        card.card_faces.forEach((face) => {
          elementGenerator(valuesList, face, true);
        });
      });
    }
  }
}
