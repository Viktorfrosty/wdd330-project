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

async function loadTemplate(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load template: ${path}`);
  }
  return await response.text();
}

async function injectTemplate(template, parentElement) {
  if (!parentElement) {
    throw new Error("Invalid parent element");
  }

  parentElement.insertAdjacentHTML("afterbegin", template);
}

export async function renderPageElements() {
  const headerElement = document.querySelector("body > header");
  const footerElement = document.querySelector("body > footer");

  try {
    const headerTemplate = await loadTemplate("src/public/sources/header.html");
    await injectTemplate(headerTemplate, headerElement);

    const footerTemplate = await loadTemplate("../sources/footer.html");
    await injectTemplate(footerTemplate, footerElement);
  } catch (error) {
    console.error("Error rendering page elements:", error);
  }
}

// export function injectTemplate(template, parentElement) {
//   // inject the data in the page.
//   if (parentElement) {
//     parentElement.insertAdjacentHTML("afterbegin", template);
//     if (callback) {
//       callback(data);
//     }
//   }
// }

// async function loadTemplate(path) {
//   // loads the template.
//   const response = await fetch(path);
//   const template = await response.text();
//   return template;
// }

// export async function renderPageElements() {
//   // generate the header and footer.

//   const headerElement = document.querySelector("body > header");
//   const footerElement = document.querySelector("body > footer");

//   const headerTemplate = await loadTemplate("src/public/sources/header.html");
//   const footerTemplate = await loadTemplate("../sources/footer.html");

//   console.log(headerElement);
//   console.log(headerTemplate);

//   injectTemplate(headerTemplate, headerElement);
// }
