import { setIconRetriever, symbolConverter } from "./dataHandler.mjs";

// Generate the desired elements.
async function elementGenerator(list, object) {
  const root = document.getElementById("root");
  for (const property of list) {
    if (property === "set_id" && object.set_id) {
      const element = document.createElement("p");
      element.innerHTML = await setIconRetriever(object[property]);
      element.setAttribute("id", property);
      root.appendChild(element);
    } else if (property !== "image_uris" && property in object) {
      const element = document.createElement("p");
      element.innerHTML = symbolConverter(object[property]);
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
      "name",
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
      console.log(`${card.name} has one face.`);
      elementGenerator(valuesList, card);
    } else {
      console.log(`The card has ${card.card_faces.length} faces.`);
      elementGenerator(valuesList, card).then(() => {
        card.card_faces.forEach((face) => {
            console.log(face);
            elementGenerator(valuesList, face);
          });
      });
    }
  }
}
