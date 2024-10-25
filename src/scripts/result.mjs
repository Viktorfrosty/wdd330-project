export function resultsBox() {
  const root = document.getElementById("root");
  const searchResults = document.createElement("div");
  searchResults.setAttribute("id", "card_box");
  root.appendChild(searchResults);
}

export default class CardGlimpse {
  constructor(card) {
    this.card = card;
  }
  render() {
    this.cardSnippet(this.card);
  }
  cardSnippet(card) {
    const root = document.getElementById("card_box");
    const box = document.createElement("div");
    const img = this.createImageElement(card);
    if (card.layout === "flip") {
      const button = this.createFlipButton(img);
      box.appendChild(img);
      box.appendChild(button);
    } else if (card.layout !== "flip" && "card_faces" in card) {
      const transformSection = this.createTransformSection(card, img);
      box.appendChild(transformSection);
    } else {
      box.appendChild(img);
    }
    root.appendChild(box);
  }
  createImageElement(card) {
    const img = document.createElement("img");
    img.setAttribute("loading", "lazy");
    img.setAttribute("src", this.getCardImageUrl(card));
    img.setAttribute("alt", `${this.getCardName(card)} image.`);
    this.addImageEventListeners(img, card);
    return img;
  }
  getCardImageUrl(card) {
    return "image_uris" in card
      ? card.image_uris.normal
      : card.card_faces[0].image_uris.normal;
  }
  getCardName(card) {
    return card.flavor_name
      ? `(${card.name} - variant)<br>${card.flavor_name}`
      : card.name;
  }
  addImageEventListeners(img, card) {
    img.addEventListener("click", () => {
      window.location.href = `card.html?s=${card.id}`;
    });
    img.addEventListener("mouseover", (event) => {
      const cardName = this.createCardNameElement(card, event);
      document.body.appendChild(cardName);
      img.addEventListener("mousemove", (event) => {
        cardName.style.left = `${event.pageX + 20}px`;
        cardName.style.top = `${event.pageY + 20}px`;
      });
    });
    img.addEventListener("mouseout", () => {
      const cardName = document.getElementById("hover_name");
      if (cardName) {
        cardName.remove();
      }
    });
  }
  createCardNameElement(card, event) {
    const cardName = document.createElement("div");
    cardName.innerHTML =
      this.getCardName(card) +
      `<br>(${card.set_name} #${card.collector_number})`;
    cardName.style.position = "absolute";
    cardName.style.left = `${event.pageX}px`;
    cardName.style.top = `${event.pageY}px`;
    cardName.setAttribute("id", "hover_name");
    return cardName;
  }
  createFlipButton(img) {
    const button = document.createElement("button");
    button.setAttribute("class", "flip_button");
    button.textContent = "↻";
    button.addEventListener("click", () => {
      img.classList.toggle("rotate-180");
    });
    return button;
  }
  createTransformSection(card, img) {
    const transformSection = document.createElement("div");
    const button = document.createElement("button");
    button.setAttribute("class", "rotate_button");
    button.textContent = "←";
    let currentFaceIndex = 0;
    button.addEventListener("click", () => {
      currentFaceIndex = (currentFaceIndex + 1) % card.card_faces.length;
      img.setAttribute("loading", "eager");
      img.setAttribute(
        "src",
        card.card_faces[currentFaceIndex].image_uris.normal,
      );
      img.setAttribute(
        "alt",
        `${card.card_faces[currentFaceIndex].name} image.`,
      );
    });
    transformSection.appendChild(img);
    transformSection.appendChild(button);
    return transformSection;
  }
}
