export default class cardDetails {
    constructor(card) {
        this.card = card;
    }
    render() {
        this.CardInfoOrganizer(this.card);
    }
    CardInfoOrganizer(card) {
        const display = document.getElementById("root");
        display.innerHTML = `<p>${card.type_line}<br>${card.oracle_text}<br>${card.mana_cost}<br>${card.released_at}<br>${card.set_name}</p><img loading="lazy" src="${card.image_uris.normal}" alt="${card.name} image">`
    }
}