import { setIconRetriever, symbolConverter } from "./dataHandler.mjs";

export default class cardDetails {
  constructor(card) {
    this.card = card;
  }
  render() {
    this.CardInfoOrganizer(this.card);
  }
  async CardInfoOrganizer(card) {
    const display = document.getElementById("root");
    const cost = symbolConverter(card.mana_cost);
    const cmc = card.cmc;
    const type = card.type_line;
    const text = symbolConverter(card.oracle_text);
    const setName = card.set_name;
    const setCode = card.set;
    const setIcon = await setIconRetriever(card.set_id);
    display.innerHTML = `<p>${type}</p><p>Mana cost: ${cost}</p><p>Combined Mana cost: ${cmc}</p><p>Text: ${text}<p>Set: ${setName} (${setCode.toUpperCase()}) ${setIcon}</p><img loading="lazy" src="${card.image_uris.normal}" alt="${card.name} image">`;
  }
}
