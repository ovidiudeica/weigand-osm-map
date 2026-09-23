'use strict';
// CC-0021: restore thematic filters and three existing public downloads on mobile.
// Keep the canonical footer handlers as the only download implementation.
(() => {
  const init = () => {
    const explorer = document.querySelector('.explorer');
    const toggle = document.getElementById('mobile-show-filters');
    const panel = document.getElementById('mobile-filter-panel');
    const status = document.getElementById('status');
    const links = Array.from(document.querySelectorAll('[data-mobile-download]'));
    if (!explorer || !toggle || !panel || !status || links.length !== 3) return;
    toggle.addEventListener('click', () => {
      const opened = !explorer.classList.contains('mobile-filters-open');
      explorer.classList.toggle('mobile-filters-open', opened);
      toggle.setAttribute('aria-expanded', String(opened));
      if (opened) panel.scrollIntoView({block:'nearest'});
    });
    const syncReadiness = () => {
      const ready = status.dataset.state === 'ready';
      links.forEach(link => link.setAttribute('aria-disabled', String(!ready)));
    };
    new MutationObserver(syncReadiness).observe(status, {attributes:true,attributeFilter:['data-state']});
    syncReadiness();
    links.forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      if (link.getAttribute('aria-disabled') === 'true') return;
      const kind = link.dataset.mobileDownload;
      const original = document.getElementById('download-' + kind);
      if (original) original.click();
    }));
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
