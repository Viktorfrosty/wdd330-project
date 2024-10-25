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
