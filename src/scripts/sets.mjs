import { getLocalStorage } from "./dataHandler.mjs";

// create the set list.
export default class setsCatalog {
  constructor() {}
  generate() {
    const storedInfo = getLocalStorage("sets");
    this.renderList(storedInfo.data);
  }
  renderList(data) {
    const root = document.getElementById("root");
    const fragment = document.createDocumentFragment();
    const list = document.createElement("ul");
    list.setAttribute("id", "set_list");
    const parentSets = data.filter((set) => !set.parent_set_code);
    parentSets.forEach((set) => {
      const element = document.createElement("li");
      element.setAttribute("id", `set-${set.code}`);
      element.innerHTML = `<a href="result.html?element=set&s=${set.id}&type=alphabetical&order=auto">
                              <p class="set_name">${set.name}</p>
                              <p class="set_code">${set.code.toUpperCase()}</p>
                              <img class="set_icon" loading="lazy" src="${set.icon_svg_uri}" alt="${set.name} icon" width="20">
                              <p class="set_cards">${set.card_count}</p>
                              <p class="set_date">${set.released_at}</p>
                              <p class="set_type">${set.set_type}</p>
                           </a>
                           <ul></ul>`;
      list.appendChild(element);
    });
    let unresolvedSets = data.filter((set) => set.parent_set_code);
    let addedCount;
    do {
      addedCount = 0;
      unresolvedSets = unresolvedSets.filter((set) => {
        const parentElement = list.querySelector(
          `#set-${set.parent_set_code} > ul`,
        );
        if (parentElement) {
          const element = document.createElement("li");
          element.setAttribute("id", `set-${set.code}`);
          element.innerHTML = `<a href="result.html?element=set&s=${set.id}&type=alphabetical&order=auto">
                                  <p class="set_name">${set.name}</p>
                                  <p class="set_code">${set.code.toUpperCase()}</p>
                                  <img class="set_icon" loading="lazy" src="${set.icon_svg_uri}" alt="${set.name} icon" width="20">
                                  <p class="set_cards">${set.card_count}</p>
                                  <p class="set_date">${set.released_at}</p>
                                  <p class="set_type">${set.set_type}</p>
                               </a>
                               <ul></ul>`;
          parentElement.appendChild(element);
          addedCount++;
          return false;
        }
        return true;
      });
    } while (addedCount > 0 && unresolvedSets.length > 0);
    fragment.appendChild(list);
    root.appendChild(fragment);
  }
}
