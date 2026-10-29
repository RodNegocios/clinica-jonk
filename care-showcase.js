(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => reducedQuery.matches;
  const wrap = (value, length) => ((value % length) + length) % length;
  const pad = value => String(value).padStart(2, '0');
  const radioButtons = $$('.radio-thumb');
  const patientCards = $$('.patient-card');
  const stage = $('.patient-stage');
  const dialog = $('#showcase-lightbox');
  if (!stage || !dialog || !radioButtons.length || !patientCards.length) return;
  const records = nodes => nodes.map(node => ({src:node.dataset.src, title:node.dataset.title, alt:$img(node).alt, fit:node.dataset.fit || 'contain'}));
  function $img(node) { return node.querySelector('img'); }
  const radioItems = records(radioButtons);
  const patientItems = records(patientCards);

  // One accessible, full-image viewer for both galleries. Clinical montages stay intact.
  let viewerItems = [], viewerIndex = 0;
  function renderViewer() {
    const item = viewerItems[viewerIndex];
    $('#showcase-photo').src = item.src;
    $('#showcase-photo').alt = item.alt;
    $('.showcase-media').classList.toggle('rotate-left', item.fit === 'rotate-left');
    $('#showcase-caption').textContent = item.title;
    $('#showcase-count').textContent = `${pad(viewerIndex + 1)} / ${pad(viewerItems.length)}`;
  }
  function openViewer(items, index) {
    viewerItems = items; viewerIndex = index; renderViewer();
    dialog.showModal();
    document.body.classList.add('modal-open');
  }
  function moveViewer(step) { viewerIndex = wrap(viewerIndex + step, viewerItems.length); renderViewer(); }
  $('.showcase-prev').addEventListener('click', () => moveViewer(-1));
  $('.showcase-next').addEventListener('click', () => moveViewer(1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); moveViewer(event.key === 'ArrowLeft' ? -1 : 1); }
  });

  // Radiology: deliberate navigation, thumbnails and swipe, with the supplied cover first.
  let radioIndex = 0;
  function renderRadio(index, animate = true) {
    radioIndex = wrap(index, radioItems.length);
    const item = radioItems[radioIndex], image = $('#care-image');
    window.gsap?.killTweensOf(image);
    image.removeAttribute('srcset');
    image.src = item.src; image.alt = item.alt;
    image.style.transform = ''; image.style.clipPath = ''; image.style.opacity = '';
    $('.care-image-stack').classList.toggle('radio-cover', radioIndex === 0);
    $('.care-image-stack').classList.toggle('radio-exam', radioIndex !== 0);
    $('#care-image-label').textContent = item.title;
    $('#care-image-index').textContent = `${pad(radioIndex + 1)} / ${pad(radioItems.length)}`;
    $('#radio-current').textContent = item.title;
    $('.radio-expand').setAttribute('aria-label', `Ampliar: ${item.title}`);
    radioButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === radioIndex)));
    const thumb = radioButtons[radioIndex], rail = $('.radio-thumbs');
    if (thumb.offsetLeft < rail.scrollLeft || thumb.offsetLeft + thumb.offsetWidth > rail.scrollLeft + rail.clientWidth) {
      rail.scrollTo({left:thumb.offsetLeft - rail.clientWidth / 2 + thumb.offsetWidth / 2, behavior:reduced() ? 'instant' : 'smooth'});
    }
    if (animate && !reduced()) window.gsap?.fromTo(image, {opacity:.35, x:12}, {opacity:1, x:0, duration:.4, ease:'power2.out', clearProps:'transform,opacity'});
  }
  radioButtons.forEach((button, i) => {
    button.addEventListener('click', () => renderRadio(i));
    button.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault(); const next = wrap(i + (event.key === 'ArrowRight' ? 1 : -1), radioItems.length);
        renderRadio(next); radioButtons[next].focus({preventScroll:true});
      }
    });
  });
  $('.radio-prev').addEventListener('click', () => renderRadio(radioIndex - 1));
  $('.radio-next').addEventListener('click', () => renderRadio(radioIndex + 1));
  $('.radio-expand').addEventListener('click', () => openViewer(radioItems, radioIndex));
  document.addEventListener('jonk:service-change', event => { if (event.detail.index === 0) renderRadio(radioIndex, false); });
  let radioTouch;
  $('.care-image-stack').addEventListener('pointerdown', event => { if (event.pointerType === 'touch') radioTouch = {x:event.clientX,y:event.clientY}; });
  $('.care-image-stack').addEventListener('pointerup', event => {
    if (radioTouch && $('#cuidados').dataset.activeService === '0') {
      const dx = event.clientX - radioTouch.x, dy = event.clientY - radioTouch.y;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) renderRadio(radioIndex + (dx < 0 ? 1 : -1));
    }
    radioTouch = null;
  });
  $('.care-image-stack').addEventListener('pointercancel', () => radioTouch = null);

  // CircularGallery-inspired arc, adapted to the site's buildless HTML architecture.
  // Real image buttons preserve resolution, keyboard access and a native no-JS fallback.
  const count = patientCards.length;
  let current = 0, target = 0, frame = 0, lastTime = 0, active = -1;
  let width = 0, cardWidth = 0, spacing = 0, visible = false, hovered = false, focused = false;
  let paused = false, drag = null, ignoreClickUntil = 0, inputUntil = 0;
  const motionButton = $('.patient-motion');
  stage.classList.add('is-arc');
  function paint() {
    const nextActive = wrap(Math.round(current), count);
    patientCards.forEach((card, i) => {
      const distance = wrap(i - current + count / 2, count) - count / 2;
      const x = distance * spacing, normalized = x / Math.max(width / 2, 1);
      const y = reduced() ? 0 : Math.min(155, normalized * normalized * 75);
      const angle = reduced() ? 0 : Math.max(-16, Math.min(16, normalized * 9));
      const scale = reduced() ? 1 : 1 - Math.min(Math.abs(distance) * .025, .09);
      const onscreen = Math.abs(x) < width / 2 + cardWidth;
      card.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotate(${angle.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      card.style.visibility = onscreen ? 'visible' : 'hidden';
      card.style.zIndex = String(Math.max(0, 10 - Math.round(Math.abs(distance))));
      card.tabIndex = i === nextActive ? 0 : -1;
      card.classList.toggle('is-active', i === nextActive);
      card.setAttribute('aria-current', String(i === nextActive));
    });
    if (nextActive !== active) {
      active = nextActive;
      $('.patient-counter').textContent = `${pad(active + 1)} / ${pad(count)}`;
    }
  }
  function autoplay(now) { return visible && !reduced() && !paused && !hovered && !focused && !drag && !dialog.open && !document.hidden && now > inputUntil; }
  function animate(now) {
    frame = 0;
    if (!visible || document.hidden) { lastTime = 0; return; }
    const dt = Math.min(40, lastTime ? now - lastTime : 16.67); lastTime = now;
    if (autoplay(now)) target += dt * .000055;
    current = reduced() ? target : current + (target - current) * (1 - Math.pow(.91, dt / 16.67));
    if (Math.abs(target - current) < .0004) current = target;
    paint();
    if (Math.abs(target - current) > .0004 || autoplay(now) || (!paused && !reduced() && !hovered && !focused && !dialog.open)) frame = requestAnimationFrame(animate);
  }
  function wake() { if (!frame && visible && !document.hidden) { lastTime = 0; frame = requestAnimationFrame(animate); } }
  function navigate(step, exact = false) {
    inputUntil = performance.now() + 6000;
    target = exact ? step : Math.round(target) + step;
    if (reduced()) { current = target; paint(); }
    wake();
  }
  function resize() {
    width = stage.clientWidth; cardWidth = patientCards[0].offsetWidth;
    spacing = cardWidth + (width < 701 ? 23 : 34);
    paint(); wake();
  }
  new ResizeObserver(resize).observe(stage);
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) wake(); else { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
  }, {threshold:0,rootMargin:'80px'}).observe(stage);
  $('.patient-prev').addEventListener('click', () => navigate(-1));
  $('.patient-next').addEventListener('click', () => navigate(1));
  motionButton.addEventListener('click', () => {
    paused = !paused;
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.setAttribute('aria-label', paused ? 'Retomar movimento da galeria' : 'Pausar movimento da galeria');
    motionButton.querySelector('use').setAttribute('href', paused ? '#play' : '#pause');
    if (paused) target = Math.round(current);
    wake();
  });
  stage.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') hovered = true; });
  stage.addEventListener('pointerleave', event => { if (event.pointerType !== 'touch') { hovered = false; wake(); } });
  stage.addEventListener('focusin', () => { focused = true; });
  stage.addEventListener('focusout', event => { focused = stage.contains(event.relatedTarget); if (!focused) wake(); });
  stage.addEventListener('keydown', event => {
    const key = event.key;
    if (['ArrowLeft','ArrowRight','Home','End'].includes(key)) {
      event.preventDefault();
      if (key === 'Home') navigate(0, true);
      else if (key === 'End') navigate(count - 1, true);
      else navigate(key === 'ArrowLeft' ? -1 : 1);
      stage.focus({preventScroll:true});
    }
  });
  patientCards.forEach((card, index) => card.addEventListener('click', event => {
    if (performance.now() < ignoreClickUntil) { event.preventDefault(); return; }
    inputUntil = performance.now() + 6000;
    openViewer(patientItems, index);
  }));
  stage.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    drag = {id:event.pointerId,x:event.clientX,y:event.clientY,lastX:event.clientX,time:event.timeStamp,start:current,velocity:0,moved:false};
    target = current; inputUntil = performance.now() + 6000;
  });
  stage.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    if (!drag.moved) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { drag = null; return; }
      if (Math.abs(dx) < 7) return;
      drag.moved = true; stage.setPointerCapture(event.pointerId); stage.classList.add('is-dragging');
    }
    target = drag.start - dx / spacing;
    drag.velocity = (event.clientX - drag.lastX) / Math.max(8, event.timeStamp - drag.time);
    drag.lastX = event.clientX; drag.time = event.timeStamp;
    event.preventDefault(); wake();
  });
  function finishDrag(event) {
    if (!drag || drag.id !== event.pointerId) return;
    if (drag.moved) {
      const momentum = event.type === 'pointercancel' || event.timeStamp - drag.time > 120 ? 0 : Math.max(-1.5, Math.min(1.5, -drag.velocity * 160 / spacing));
      target = Math.round(target + momentum); ignoreClickUntil = performance.now() + 250;
    }
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    drag = null; stage.classList.remove('is-dragging'); inputUntil = performance.now() + 6000; wake();
  }
  stage.addEventListener('pointerup', finishDrag);
  stage.addEventListener('pointercancel', finishDrag);
  stage.addEventListener('lostpointercapture', () => { drag = null; stage.classList.remove('is-dragging'); });
  stage.addEventListener('dragstart', event => event.preventDefault());
  let wheelTimer;
  stage.addEventListener('wheel', event => {
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.shiftKey ? event.deltaY : 0;
    if (!delta) return; // Vertical scrolling remains page scrolling.
    event.preventDefault(); inputUntil = performance.now() + 6000;
    target += delta * (event.deltaMode === 1 ? 16 : 1) / spacing;
    clearTimeout(wheelTimer); wheelTimer = setTimeout(() => { target = Math.round(target); wake(); },140); wake();
  }, {passive:false});
  dialog.addEventListener('close', () => { inputUntil = performance.now() + 3000; wake(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else wake(); });
  reducedQuery.addEventListener('change', () => { target = Math.round(current); current = target; paint(); wake(); });
  resize();
})();
