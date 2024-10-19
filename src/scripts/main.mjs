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
      const img = document.createElement("img");
      img.setAttribute("loading", "lazy");
      img.setAttribute("src", card["image_uris"]["small"]);
      img.setAttribute("alt", `${card["name"]} image.`);
      img.setAttribute("width", "200");
      img.addEventListener("click", () => {
        window.location.href = `card.html?id=${card.id}`;
      });
      root.appendChild(img);
    } else if ("card_faces" in card) {
      console.log("card has 2 faces.");
    //  const imageSnippet = document.createElement("div");
    //   card["card_faces"].forEach(face => {
    //     const img = document.createElement("img");
    //     img.setAttribute("loading", "lazy");
    //     img.setAttribute("src", face["image_uris"]["large"]);
    //     img.setAttribute("alt", `${face["name"]} image.`);
    //     img.setAttribute("width", "250");
    //     img.addEventListener("click", () => {
    //       window.location.href = `card.html?id=${card.id}`;
    //     });
    //     root.appendChild(img);
    //   });
    } else {
      console.log("it didn't work");
    }
  }  
}
