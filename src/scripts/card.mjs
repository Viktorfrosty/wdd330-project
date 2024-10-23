import { setIconRetriever, symbolInjector } from "./dataHandler.mjs";

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
      this.elementGenerator(valuesList, card, true);
    } else {
      this.elementGenerator(valuesList, card, true).then(() => {
        card.card_faces.forEach((face) => {
          this.elementGenerator(valuesList, face, true);
        });
      });
    }
  }
  async elementGenerator(list, object, condition = false) {
    const root = document.getElementById("root");
    const cardBox = document.createElement("div");
    cardBox.setAttribute("class", "card_box");
    if (condition != false) {
      const name = document.createElement("h2");
      name.setAttribute("class", "name");
      name.textContent = object["name"];
      cardBox.appendChild(name);
    }
    for (const property of list) {
      if (property === "set_id" && object.set_id) {
        const element = document.createElement("p");
        element.innerHTML = await setIconRetriever(object[property]);
        element.setAttribute("class", property);
        cardBox.appendChild(element);
      } else if (property !== "image_uris" && property in object) {
        const element = document.createElement("p");
        element.innerHTML = symbolInjector(object[property]);
        element.setAttribute("class", property);
        cardBox.appendChild(element);
      } else if (property === "image_uris" && property in object) {
        const img = document.createElement("img");
        img.setAttribute("loading", "lazy");
        img.setAttribute("src", object[property]["large"]);
        img.setAttribute("alt", `${object.name} image.`);
        cardBox.appendChild(img);
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
      cardBox.appendChild(list);
    }
    root.append(cardBox);
  }
}
