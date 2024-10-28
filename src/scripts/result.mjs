// rework: optimize results page module.
import { checkFavorite, getLocalStorage, saveFavorite, setLocalStorage } from "./dataHandler.mjs";
// result box generator.
export function resultsBox() {
  const root = document.getElementById("root");
  const searchResults = document.createElement("div");
  searchResults.setAttribute("id", "card_box");
  root.appendChild(searchResults);
}
// generate a card preview.
export default class CardGlimpse {
  constructor(card, inFavorites = false) {
    this.card = card;
    this.inFavorites = inFavorites;
  }
  render() {
    this.cardSnippet(this.card, this.inFavorites);
  }
  cardSnippet(card, inFavorites) {
    const root = document.getElementById("card_box");
    const box = document.createElement("div");
    box.setAttribute("id", `card-${card.id}`);
    const img = this.createImageElement(card);
    if (card.layout === "flip") {
      const button = this.createFlipButton(img);
      box.appendChild(img);
      box.appendChild(button);
    } else if (card.layout !== "flip" && "card_faces" in card) {
      const button = this.createRotateButton(card, img);
      box.appendChild(img);
      box.appendChild(button);
    } else {
      box.appendChild(img);
    }
    if (inFavorites !== false) {
      const remove = this.createEraseButton(card);
      box.appendChild(remove);
    } else {
      const add = this.createFavoriteButton(card);
      box.appendChild(add);
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
    return "image_uris" in card ? card.image_uris.normal : card.card_faces[0].image_uris.normal;
  }
  getCardName(card) {
    return card.flavor_name ? `(${card.name} - variant)<br>${card.flavor_name}` : card.name;
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
    cardName.innerHTML = this.getCardName(card) + `<br>(${card.set_name} #${card.collector_number})`;
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
  createRotateButton(card, img) {
    const button = document.createElement("button");
    button.setAttribute("class", "rotate_button");
    button.textContent = "←";
    let currentFaceIndex = 0;
    button.addEventListener("click", () => {
      currentFaceIndex = (currentFaceIndex + 1) % card.card_faces.length;
      img.setAttribute("loading", "eager");
      img.setAttribute("src", card.card_faces[currentFaceIndex].image_uris.normal);
      img.setAttribute("alt", `${card.card_faces[currentFaceIndex].name} image.`);
    });
    return button;
  }
  createEraseButton(card) {
    const favorites = getLocalStorage("favorites");
    const snippet = document.getElementById(`card-${card.id}`);
    const button = document.createElement("button");
    button.setAttribute("class", "erase_button");
    button.textContent = "❌";
    button.onclick = () => {
      const updatedFavorites = favorites.filter((fav) => fav.id !== card.id);
      setLocalStorage("favorites", updatedFavorites);
      if (snippet) {
        snippet.remove();
      }
      window.location.reload();
    };
    return button;
  }
  createFavoriteButton(card) {
    const button = document.createElement("button");
    button.setAttribute("class", "add_button");
    let inList = checkFavorite(card);
    if (inList === true) {
      button.textContent = "❤️";
    } else {
      button.textContent = "🖤";
      button.onclick = () => {
        if (button.textContent !== "❤️") {
          saveFavorite(card);
          button.textContent = "❤️";
        }
      };
    }
    return button;
  }
}
