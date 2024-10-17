// Data visualization module.

export default class Visualizer {
  constructor(title = "Default") {
    this.title = title;
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
