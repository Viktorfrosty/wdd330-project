// Function to update links with query parameters.
export function updateLinks() {
  const links = [
    {
      id: "card-link",
      url: "card.html?id=bc140950-d7d0-46d3-98a0-8d1453f4b0cf",
    },
    {
      id: "result-link",
      url: "result.html?q=bushi&type=color&order=desc",
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
