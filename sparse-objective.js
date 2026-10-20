(() => {
  const figure = document.querySelector('.objective-evolution');
  if (!figure) return;
  const button = figure.querySelector('.objective-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function updateMotionPreference() {
    figure.toggleAttribute('data-ready', !reducedMotion.matches);
    button.hidden = reducedMotion.matches;
  }

  button.addEventListener('click', () => {
    const paused = figure.dataset.paused !== 'true';
    figure.dataset.paused = String(paused);
    button.setAttribute('aria-pressed', String(paused));
    button.setAttribute('aria-label', paused ? 'Play formula animation' : 'Pause formula animation');
    button.querySelector('span').textContent = paused ? 'Play' : 'Pause';
  });

  reducedMotion.addEventListener('change', updateMotionPreference);
  updateMotionPreference();
})();
