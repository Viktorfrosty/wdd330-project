export function resultsBox() {
  const root = document.getElementById("root");
  const searchResults = document.createElement("div");
  searchResults.setAttribute("id", "card_box");
  root.appendChild(searchResults);
}

export default class cardGlimpse {
  constructor(card) {
    this.card = card;
  }
  render() {
    this.cardSnippet(this.card);
  }
  cardSnippet(card) {
    const root = document.getElementById("card_box");
    if ("image_uris" in card) {
      console.log("rearm later.");
      // const img = document.createElement("img");
      // img.setAttribute("loading", "lazy");
      // img.setAttribute("src", card["image_uris"]["normal"]);
      // img.setAttribute("alt", `${card["name"]} image.`);
      // img.setAttribute("width", "250"); // remove later.
      // img.addEventListener("click", () => {
      //   window.location.href = `card.html?id=${card.id}`;
      // });
      // img.addEventListener("mouseover", (event) => {
      //   const cardName = document.createElement("div");
      //   cardName.textContent = card.name;
      //   cardName.style.position = "absolute";
      //   cardName.style.left = `${event.pageX}px`;
      //   cardName.style.top = `${event.pageY}px`;
      //   cardName.id = "cardName";
      //   document.body.appendChild(cardName);
      // });
      // img.addEventListener("mouseout", () => {
      //     const cardName = document.getElementById("cardName");
      //     if (cardName) {
      //         cardName.remove();
      //     }
      // });
      // root.appendChild(img);
    } else if ("card_faces" in card) {
      const imageSnippet = document.createElement("div");
      imageSnippet.setAttribute("class", "image_snippet");
      imageSnippet.addEventListener("click", () => {
        window.location.href = `card.html?id=${card.id}`;
      });
      card["card_faces"].forEach((face) => {
        const img = document.createElement("img");
        img.setAttribute("loading", "lazy");
        img.setAttribute("src", face["image_uris"]["normal"]);
        img.setAttribute("alt", `${face["name"]} image.`);
        img.setAttribute("width", "250");
        imageSnippet.appendChild(img);
      });
      const button = document.createElement("button");
      button.setAttribute("class", "rotate_button");
      button.textContent = "↻";
      button.addEventListener("click", () => {
        console.log("test");
      });
      root.appendChild(imageSnippet);
      root.appendChild(button);
    }
  }
}
