// Data visualization module.

// page info modifier.
export default class Visualizer {
  constructor(title = "Default", type = "", misc = "") {
    this.title = title;
    this.type = type;
    this.misc = misc;
  }

  run() {
    // Execute the functions.
    this.headTitleChanger(this.title, this.type, this.misc);
    this.pageTitleChanger(this.title);
  }

  headTitleChanger(title, type, misc) {
    // Customize the page title and meta title.
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const metaTitle = document.getElementById("head-title");
    if (type !== "") {
      type = `${type}:`;
    }
    if (misc !== "") {
      misc = `- Set: ${misc}`;
    }
    metaTitle.textContent = `${capitalize(type)} ${title} ${misc} | Trading Cards Info Tracker`;
  }
  
  pageTitleChanger(title) {
    // customize the title of the page.
    const header = document.querySelector("header");
    const testBox = document.createElement("h1");
    testBox.textContent = title;
    header.appendChild(testBox);
  }
}
