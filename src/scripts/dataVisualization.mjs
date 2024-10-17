// Data visualization module.

export default class Visualizer {
  constructor(title = "Default", description = "None", link = "default") {
    this.title = title;
    this.description = description;
    this.link = link;
  }

  run() {
    this.headTitleChanger(this.title);
    this.headDescriptionChanger(this.description);
    this.headLinkChanger(this.link);
    console.log("success");
  }

  headTitleChanger(title) {
    // Customize the page title and meta title.
    const pageTitle = document.getElementById("head-title");
    const metaTitle = document.getElementById("meta-title");
    pageTitle.textContent = `Trading Cards Info Tracker | ${title}`;
    metaTitle.setAttribute("content", `Trading Cards Info Tracker | ${title}`);
    console.log(pageTitle);
  }

  headDescriptionChanger(description) {
    // Customize the page meta description.
    const metaDesc = document.getElementById("meta-desc");
    metaDesc.setAttribute("content", description);
    console.log(metaDesc);
  }

  headLinkChanger(link) {
    // Customize the page meta link.
    const metaLink = document.getElementById("meta-link");
    if (link === !"default") {
      metaLink.setAttribute("content", link);
    }
    console.log(metaLink);
  }
}
