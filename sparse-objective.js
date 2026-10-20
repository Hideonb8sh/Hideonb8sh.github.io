(() => {
  const figure = document.querySelector('.objective-evolution');
  if (!figure) return;
  const button = figure.querySelector('.objective-toggle');
  const transition = figure.querySelector('.objective-transition');
  const tokens = [...figure.querySelectorAll('.objective-token')];
  const weights = [...figure.querySelectorAll('.objective-weight')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function positionTokens() {
    const bounds = figure.getBoundingClientRect();
    const bridge = transition.getBoundingClientRect();
    tokens.forEach((token, index) => {
      const target = weights[index].getBoundingClientRect();
      const startX = bridge.left - bounds.left + bridge.width * (index === 0 ? 0.37 : 0.63);
      const startY = bridge.top - bounds.top + bridge.height / 2;
      token.style.left = startX + 'px';
      token.style.top = startY + 'px';
      token.style.setProperty('--flight-x', target.left + target.width / 2 - bounds.left - startX + 'px');
      token.style.setProperty('--flight-y', target.top + target.height / 2 - bounds.top - startY + 'px');
      token.style.setProperty('--flight-scale', Math.min(1, target.width / token.offsetWidth));
    });
  }

  function updateMotionPreference() {
    figure.toggleAttribute('data-ready', !reducedMotion.matches);
    button.hidden = reducedMotion.matches;
    positionTokens();
  }

  button.addEventListener('click', () => {
    const paused = figure.dataset.paused !== 'true';
    figure.dataset.paused = String(paused);
    button.setAttribute('aria-pressed', String(paused));
    button.setAttribute('aria-label', paused ? 'Play formula animation' : 'Pause formula animation');
    button.querySelector('span').textContent = paused ? 'Play' : 'Pause';
  });

  document.fonts.ready.then(() => {
    updateMotionPreference();
    new ResizeObserver(positionTokens).observe(figure);
    reducedMotion.addEventListener('change', updateMotionPreference);
  });
})();
