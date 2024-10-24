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
      const box = document.createElement("div");
      const img = document.createElement("img");
      img.setAttribute("loading", "lazy");
      img.setAttribute("src", card["image_uris"]["normal"]);
      img.setAttribute("alt", `${card["name"]} image.`);
      img.addEventListener("click", () => {
        window.location.href = `card.html?id=${card.id}`;
      });
      img.addEventListener("mouseover", (event) => {
        const cardName = document.createElement("div");
        if (!card.flavor_name) {
          cardName.innerHTML = `${card.name}<br>(${card.set_name} #${card.collector_number})`;
        } else {
          cardName.innerHTML = `${card.flavor_name}<br>(${card.name} variant)<br>(${card.set_name} #${card.collector_number})`;
        }
        cardName.style.position = "absolute";
        cardName.style.left = `${event.pageX}px`;
        cardName.style.top = `${event.pageY}px`;
        cardName.setAttribute("id", "hover_name");
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
      if (card.layout === "flip") {
        const button = document.createElement("button");
        button.setAttribute("class", "flip_button");
        button.textContent = "↻";
        button.addEventListener("click", () => {
          img.classList.toggle("rotate-180");
        });
        box.appendChild(img);
        box.appendChild(button);
        root.appendChild(box);
      } else {
        box.appendChild(img);
        root.appendChild(box);
      }
    } else if ("card_faces" in card) {
      if (card.layout === "transform") {
        const imageSnippet = document.createElement("div");
        const img = document.createElement("img");
        img.setAttribute("loading", "eager");
        img.setAttribute("src", card["card_faces"][0]["image_uris"]["normal"]);
        img.setAttribute("alt", `${card["card_faces"][0]["name"]} image.`);
        img.classList.add("fade");
        img.addEventListener("click", () => {
          window.location.href = `card.html?id=${card.id}`;
        });
        img.addEventListener("mouseover", (event) => {
          const cardName = document.createElement("div");
          if (!card.flavor_name) {
            cardName.innerHTML = `${card.name}<br>(${card.set_name} #${card.collector_number})`;
          } else {
            cardName.innerHTML = `${card.flavor_name}<br>(${card.name} variant)<br>(${card.set_name} #${card.collector_number})`;
          }
          cardName.style.position = "absolute";
          cardName.style.left = `${event.pageX}px`;
          cardName.style.top = `${event.pageY}px`;
          cardName.setAttribute("id", "hover_name");
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
        imageSnippet.appendChild(img);
        const button = document.createElement("button");
        button.setAttribute("class", "rotate_button");
        button.textContent = "←";
        let currentFaceIndex = 0;
        button.addEventListener("click", () => {
          img.classList.remove("fade-in");
          img.classList.add("fade-out");
          setTimeout(() => {
            currentFaceIndex = (currentFaceIndex + 1) % card["card_faces"].length;
            img.setAttribute("loading", "eager");
            img.setAttribute("src", card["card_faces"][currentFaceIndex]["image_uris"]["normal"]);
            img.setAttribute("alt", `${card["card_faces"][currentFaceIndex]["name"]} image.`);
            img.classList.remove("fade-out");
            img.classList.add("fade-in");
          }, 250);
        });
        imageSnippet.appendChild(button);
        root.appendChild(imageSnippet);
      }
    }
  }
}
