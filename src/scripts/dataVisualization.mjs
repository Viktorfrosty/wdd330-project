// Data visualization module.

export function headTitleChanger(page = "Default") {
  // Customize the page title.
  const title = document.getElementById("head-title");
  const ogTitle = document.getElementById("og-title");
  title.textContent = `Trading Cards Info Tracker | ${page}`;
  ogTitle.setAttribute("content", `Trading Cards Info Tracker | ${page}`);
}

export function headDescriptionChanger(description = "None") {
  // Customize the page description.
  const title = document.getElementById("head-desc");
  title.setAttribute("content", description);
}

export function renderPageElements(page="Default") {
  const headerElement = document.querySelector("body > header");
  const footerElement = document.querySelector("body > footer");
  const testbox = document.createElement("p");
  testbox.textContent = page;
  headerElement.appendChild(testbox);
  footerElement.appendChild(testbox);
}