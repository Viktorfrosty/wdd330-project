const root = document.getElementById("root");

// Function to update links with query parameters.
export function updateLinks() {
  const links = [
    {
      id: "card-link",
      url: "card.html?s=e8dd3fda-d778-4be6-abd4-6cf704e352ea",
    },
    {
      id: "search-link",
      url: "result.html?element=list&s=bushi&type=color&order=desc",
    },
    {
      id: "set-link",
      url: "result.html?element=set&s=bc94aba1-7376-4e02-a12d-3a2efb66ab0f&type=alphabetical&order=auto",
    },
  ];
  links.forEach((link) => {
    const element = document.getElementById(link.id);
    if (element) {
      element.href = link.url;
      console.log(`${link.id} success!`);
    }
  });
}

export default class dialer {
  constructor() {}
  generate() {
    this.searchBox();
  }
  searchBox() {
    const syntax = [
      "name",
      "color",
      "identity",
      "mana value",
      "rarity",
      "type",
      "loyalty",
      "power",
      "toughness",
      "artist",
      "art",
      "function",
      "oracle",
      "flavor",
      "watermark",
      "number",
      "year",
      "border",
      "frame",
      "stamp",
      "format",
      "cube",
      "game",
      "is",
    ];
    const inputField = document.createElement("div");
    const select = document.createElement("select");
    syntax.forEach((element) => {
      const option = document.createElement("option");
      if (element !== "mana value") {
        option.setAttribute("value", element);
      } else {
        option.setAttribute("value", "manavalue");
      }
      if (element === "name") {
        option.setAttribute("selected", "selected");
      }
      option.textContent = element;
      select.appendChild(option);
    });
    const input = document.createElement("input");
    input.setAttribute("placeholder", "search by...");
    const button = document.createElement("button");
    button.textContent = "Search";
    button.onclick = () => {
      const selectedValue = select.value;
      const inputValue = input.value;
      // window.location.href = `search.html?parameter=${selectedValue}&query=${inputValue}`;
      if (selectedValue !== "name") {
        window.location.href = `result.html?element=list&s=${selectedValue}%3A${inputValue}&type=alphabetical&order=auto`;
      } else {
        window.location.href = `result.html?element=list&s=${inputValue}&type=alphabetical&order=auto`;
      }
    };
    inputField.appendChild(select);
    inputField.appendChild(input);
    inputField.appendChild(button);
    root.appendChild(inputField);
  }
}
