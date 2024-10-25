import { fetchData, setIconRetriever, symbolInjector } from "./dataHandler.mjs";

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
    const root = document.getElementById("root");
    const cardBox = document.createElement("div");
    cardBox.setAttribute("class", "card_box");
    if (condition != false) {
      if (!object.flavor_name) {
        const name = document.createElement("h2");
        name.setAttribute("class", "name");
        name.textContent = object.name;
        cardBox.appendChild(name);
      } else {
        const flavorName = document.createElement("h2");
        flavorName.setAttribute("class", "name");
        flavorName.textContent = object.flavor_name;
        cardBox.appendChild(flavorName);
        const name = document.createElement("h3");
        name.setAttribute("class", "name");
        name.textContent = `(${object.name})`;
        cardBox.appendChild(name);
      }
      const type = document.createElement("h3");
      type.setAttribute("class", "type");
      type.textContent = object.type_line;
      cardBox.appendChild(type);
    }
    for (const property of list) {
      if (property !== "image_uris" && property in object) {
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
    const setElement = document.createElement("a");
    const icon = await setIconRetriever(object.set_id);
    setElement.setAttribute(
      "href",
      `result.html?element=set&s=${object.set_id}&type=alphabetical&order=auto`,
    );
    setElement.innerHTML = `${object.set_name} (${object.set.toUpperCase()}) ${icon}`;
    cardBox.appendChild(setElement);
    if ("legalities" in object) {
      const box = document.createElement("div");
      box.innerHTML = "<p>Legalities</p>";
      const list = document.createElement("ul");
      const ruleEntries = Object.entries(object["legalities"]);
      ruleEntries.forEach(([game_mode, legality]) => {
        let block = document.createElement("li");
        block.innerHTML = `<p class="game_mode">${game_mode}</p><p class="legality">${legality}</p>`;
        list.appendChild(block);
      });
      box.appendChild(list);
      cardBox.appendChild(box);
    }
    if ("rulings_uri" in object) {
      const info = await fetchData(object.rulings_uri);
      if (info.data.length > 0) {
        const box = document.createElement("div");
        box.innerHTML = `<h3>${object.name} Notes and Rules</h3>`;
        const rulingBox = document.createElement("ul");
        rulingBox.setAttribute("class", "rules_list");
        info.data.forEach((ruleElement) => {
          const rule = document.createElement("li");
          rule.innerHTML = `<p class="rule_text">${ruleElement.comment}</p><p class="rule_source">${ruleElement.source}</p><p class="rule_published">${ruleElement.published_at}</p>`;
          rulingBox.appendChild(rule);
        });
        box.appendChild(rulingBox);
        cardBox.appendChild(box);
      }
    }
    if (!document.getElementById("add_to_deck_button")) {
      const button = document.createElement("button");
      button.setAttribute("id", "add_to_deck_button");
      button.textContent = "Add to favorites";
      cardBox.append(button);
    }
    root.append(cardBox);
  }
}
