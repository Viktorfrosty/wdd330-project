// sets page module.
import { getLocalStorage } from "./dataHandler.mjs";
import { specialCharacterConverter } from "./dataVisualization.mjs";
// Module configurations.
const regex = /(?<=[a-z])_(?=[a-z])/g;
const replace = " ";
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
    const header = document.createElement("li");
    header.innerHTML = `<span>
    <p class="set_name">Set Name</p>
    <p class="set_code">Code</p>
    <p class="set_icon">Icon</p>
    <p class="set_cards">Cards</p>
    <p class="set_date">Released At</p>
    <p class="set_type">Type</p>
 </span>`;
    list.appendChild(header);
    const parentSets = data.filter((set) => !set.parent_set_code);
    parentSets.forEach((set) => {
      const element = document.createElement("li");
      element.setAttribute("id", `set-${set.code}`);
      element.innerHTML = `<a class="set_link" href="result.html?element=set&s=${set.code}&type=name&order=asc&page=1">
                              <p class="set_name">${set.name}</p>
                              <p class="set_code">${set.code.toUpperCase()}</p>
                              <div class="set_icon">
                              <img loading="lazy" src="${set.icon_svg_uri}" alt="${set.name} icon">
                              </div>
                              <p class="set_cards">${set.card_count}</p>
                              <p class="set_date">${set.released_at}</p>
                              <p class="set_type">${specialCharacterConverter(set.set_type, regex, replace)}</p>
                           </a>
                           <ul></ul>`;
      list.appendChild(element);
    });
    let unresolvedSets = data.filter((set) => set.parent_set_code);
    let addedCount;
    do {
      addedCount = 0;
      unresolvedSets = unresolvedSets.filter((set) => {
        const parentElement = list.querySelector(`#set-${set.parent_set_code} > ul`);
        if (parentElement) {
          const element = document.createElement("li");
          element.setAttribute("id", `set-${set.code}`);
          element.innerHTML = `<a class="set_link" href="result.html?element=set&s=${set.code}&type=name&order=asc&page=1">
                                  <p class="set_name">${set.name}</p>
                                  <p class="set_code">${set.code.toUpperCase()}</p>
                                  <div class="set_icon">
                              <img loading="lazy" src="${set.icon_svg_uri}" alt="${set.name} icon">
                              </div>
                                  <p class="set_cards">${set.card_count}</p>
                                  <p class="set_date">${set.released_at}</p>
                                  <p class="set_type">${specialCharacterConverter(set.set_type, regex, replace)}</p>
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
    let trashBin = document.querySelectorAll("li > ul");
    trashBin.forEach((element) => {
      if (element.children.length === 0) {
        element.remove();
      }
    });
  }
}
