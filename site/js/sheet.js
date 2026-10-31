// Phone bottom sheets (place panel, layers): drag the handle between snap points, or tap it to
// step through them. Heights per snap are set in CSS ([data-snap]); on desktop they don't apply.

export function sheet(el, snaps, onSnap) {
  const grab = el.querySelector('[data-grab]') || el.insertAdjacentElement('afterbegin', Object.assign(document.createElement('button'), { type: 'button', className: 'grab' }));
  grab.dataset.grab = '';
  const set = s => { el.dataset.snap = s; grab.setAttribute('aria-label', `Resize panel (now ${s})`); onSnap?.(s); };
  if (!snaps.includes(el.dataset.snap)) set(snaps[0]);
  let y0 = 0, h0 = 0, moved = false;
  grab.addEventListener('pointerdown', e => {
    grab.setPointerCapture(e.pointerId);
    y0 = e.clientY; h0 = el.offsetHeight; moved = false;
    el.classList.add('dragging');
  });
  grab.addEventListener('pointermove', e => {
    if (!el.classList.contains('dragging')) return;
    const dy = e.clientY - y0;
    if (Math.abs(dy) > 6) moved = true;
    if (moved) el.style.height = Math.max(60, h0 - dy) + 'px';
  });
  const end = () => {
    if (!el.classList.contains('dragging')) return;
    el.classList.remove('dragging');
    const h = el.offsetHeight;
    el.style.height = '';
    if (!moved) return set(snaps[(snaps.indexOf(el.dataset.snap) + 1) % snaps.length]);
    // nearest snap by the heights CSS gives each one
    let best = snaps[0], gap = Infinity;
    for (const s of snaps) {
      el.dataset.snap = s;
      const d = Math.abs(el.offsetHeight - h);
      if (d < gap) { gap = d; best = s; }
    }
    set(best);
  };
  grab.addEventListener('pointerup', end);
  grab.addEventListener('pointercancel', end);
  return { set, get: () => el.dataset.snap };
}
