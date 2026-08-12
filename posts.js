const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll("[data-category]");
const emptyState = document.querySelector(".filter-empty");
const pagination = document.querySelector(".project-pagination");
const paginationPages = document.querySelector(".pagination-pages");
const previousPageButton = document.querySelector(".pagination-previous");
const nextPageButton = document.querySelector(".pagination-next");
const animatedProjectCards = document.querySelectorAll(
  ".project-card:has(.project-animation)",
);
const projectsPerPage = 3;
let activeCategory = "all";
let currentPage = 1;

function matchingProjects(category) {
  return [...projectCards].filter((card) => {
    const categories = card.dataset.category.split(/\s+/);
    return category === "all" || categories.includes(category);
  });
}

function renderPagination(totalPages) {
  if (!pagination || !paginationPages) return;

  pagination.hidden = totalPages <= 1;
  paginationPages.replaceChildren();

  for (let page = 1; page <= totalPages; page += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pagination-button pagination-page";
    button.textContent = String(page);
    button.setAttribute("aria-label", `Go to project page ${page}`);
    button.setAttribute("aria-current", page === currentPage ? "page" : "false");
    button.classList.toggle("is-active", page === currentPage);
    button.addEventListener("click", () => {
      currentPage = page;
      renderProjects();
      document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
    });
    paginationPages.append(button);
  }

  if (previousPageButton) previousPageButton.disabled = currentPage === 1;
  if (nextPageButton) nextPageButton.disabled = currentPage === totalPages;
}

function renderProjects() {
  const matches = matchingProjects(activeCategory);
  const totalPages = Math.max(1, Math.ceil(matches.length / projectsPerPage));
  currentPage = Math.min(currentPage, totalPages);
  const pageStart = (currentPage - 1) * projectsPerPage;
  const visibleCards = new Set(
    matches.slice(pageStart, pageStart + projectsPerPage),
  );

  projectCards.forEach((card) => {
    card.hidden = !visibleCards.has(card);
    if (card.hidden) card.classList.remove("is-animating");
  });

  if (emptyState) emptyState.hidden = matches.length !== 0;
  renderPagination(totalPages);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((candidate) => {
      const isSelected = candidate === button;
      candidate.classList.toggle("is-active", isSelected);
      candidate.setAttribute("aria-pressed", String(isSelected));
    });

    activeCategory = button.dataset.filter;
    currentPage = 1;
    renderProjects();
  });
});

previousPageButton?.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage -= 1;
  renderProjects();
  document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
});

nextPageButton?.addEventListener("click", () => {
  const totalPages = Math.ceil(
    matchingProjects(activeCategory).length / projectsPerPage,
  );
  if (currentPage >= totalPages) return;
  currentPage += 1;
  renderProjects();
  document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
});

renderProjects();

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
