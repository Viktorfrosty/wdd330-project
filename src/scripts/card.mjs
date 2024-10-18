import { setIconRetriever, symbolConverter } from "./dataHandler.mjs";

// Generate the desired elements.
function elementGenerator(list, object) {
  const root = document.getElementById("root");
  list.forEach((property) => {
    if (property !== "set_id") {
      if (property !== "image_uris") {
        if (property !== "set_id") {
          if (property in object) {
            console.log(
              `${object.name} ${property}: ${symbolConverter(object[property])}`,
            );
            const element = document.createElement("p");
            element.innerHTML = symbolConverter(object[property]);
            element.setAttribute("id", property);
            root.appendChild(element);
          }
        }
      }
    } else {
      if (object.set_id) {
        console.log(setIconRetriever(object.set_id));
        const element = document.createElement("p");
        element.innerHTML = setIconRetriever(object[property]);
        element.setAttribute("id", property);
        root.appendChild(element);
      }
    }
  });
}

// Organize the card details.
export default class cardDetails {
  constructor(card) {
    this.card = card;
  }
  render() {
    this.CardInfoOrganizer(this.card);
  }
  CardInfoOrganizer(card) {
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
      card.card_faces.forEach((face) => {
        console.log(face);
        elementGenerator(valuesList, face);
      });
    }
  }
}
