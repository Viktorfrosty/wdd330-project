// Data visualization module.

export default class Visualizer {
  constructor(title = "Default", description = "None", link = "default") {
    this.title = title;
    this.description = description;
    this.link = link;
  }

  run() {
    this.headTitleChanger(this.title);
    console.log("success");
  }

  headTitleChanger(title) {
    // Customize the page title and meta title.
    const pageTitle = document.getElementById("head-title");
    pageTitle.textContent = `Trading Cards Info Tracker | ${title}`;
    console.log(pageTitle);
  }
}
