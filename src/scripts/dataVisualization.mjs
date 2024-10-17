// Data visualization module.

// page info modifier.
export default class Visualizer {
  constructor(title = "Default", type = "") {
    this.title = title;
    this.type = type;
  }

  run() {
    // Execute the functions.
    this.headTitleChanger(this.title, this.type);
    this.pageTitleChanger(this.title);
  }

  headTitleChanger(title, type) {
    // Customize the page title and meta title.
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const metaTitle = document.getElementById("head-title");
    metaTitle.textContent = `Trading Cards Info Tracker | ${title} ${capitalize(type)}`;
  }
  pageTitleChanger(title) {
    // customize the title of the page.
    const testBox = document.getElementById("root");
    testBox.textContent = title;
  }
}
