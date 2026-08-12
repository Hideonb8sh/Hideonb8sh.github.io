const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll("[data-category]");
const emptyState = document.querySelector(".filter-empty");

function filterProjects(category) {
  let visibleProjects = 0;

  projectCards.forEach((card) => {
    const shouldShow =
      category === "all" || card.dataset.category === category;

    card.hidden = !shouldShow;
    if (shouldShow) visibleProjects += 1;
  });

  if (emptyState) emptyState.hidden = visibleProjects !== 0;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((candidate) => {
      const isSelected = candidate === button;
      candidate.classList.toggle("is-active", isSelected);
      candidate.setAttribute("aria-pressed", String(isSelected));
    });

    filterProjects(button.dataset.filter);
  });
});
