const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll("[data-category]");
const emptyState = document.querySelector(".filter-empty");
const animatedProjectCards = document.querySelectorAll(
  ".project-card:has(.project-animation)",
);

function filterProjects(category) {
  let visibleProjects = 0;

  projectCards.forEach((card) => {
    const shouldShow =
      category === "all" || card.dataset.category === category;

    card.hidden = !shouldShow;
    if (!shouldShow) card.classList.remove("is-animating");
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

function restartCardAnimation(card) {
  card.classList.remove("is-animating");
  void card.offsetWidth;
  card.classList.add("is-animating");
}

animatedProjectCards.forEach((card) => {
  card.addEventListener("pointerenter", () => {
    if (window.matchMedia("(hover: hover)").matches) {
      restartCardAnimation(card);
    }
  });
  card.addEventListener("pointerleave", () => {
    card.classList.remove("is-animating");
  });

  card.addEventListener("focusin", () => {
    if (!card.classList.contains("is-animating")) {
      restartCardAnimation(card);
    }
  });

  card.addEventListener("focusout", () => {
    requestAnimationFrame(() => {
      if (!card.contains(document.activeElement) && !card.matches(":hover")) {
        card.classList.remove("is-animating");
      }
    });
  });
});
