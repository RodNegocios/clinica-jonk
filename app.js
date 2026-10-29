(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => motionQuery.matches;
  const scrollBehavior = () => reduced() ? 'instant' : 'smooth';
  const gs = window.gsap;
  $('#year').textContent = new Date().getFullYear();

  // Mobile navigation uses native links and closes before moving to the section.
  const menu = $('.menu-toggle');
  const mobileNav = $('#mobile-nav');
  function closeMenu() { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Abrir menu'); mobileNav.hidden = true; }
  menu.addEventListener('click', () => {
    const opened = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!opened));
    menu.setAttribute('aria-label', opened ? 'Abrir menu' : 'Fechar menu');
    mobileNav.hidden = opened;
  });
  $$('a', mobileNav).forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menu.focus(); } });
  document.addEventListener('click', e => { if(!mobileNav.hidden && !$('.header').contains(e.target)) closeMenu(); });
  window.matchMedia('(min-width: 701px)').addEventListener('change', e => { if(e.matches) closeMenu(); });

  // Service accordion: one panel at a time, with a photograph from the supplied set.
  const serviceImages = [
    { src: 'digitalx-capa', label: 'Um olhar além do sorriso', alt: 'Pessoa posicionada no equipamento de radiologia odontológica' },
    { src: 'consultorio-vertical', label: 'Seu cuidado começa aqui.', alt: 'Consultório odontológico da Clínica Jönk' },
    { src: 'doutora', label: 'Um olhar para o seu sorriso.', alt: 'Dra. Daniele Jönk, responsável pela clínica' },
    { src: 'consultorio', label: 'Cuidado e planejamento.', alt: 'Visão ampla do consultório da Clínica Jönk' }
  ];
  const serviceButtons = $$('[data-service]');
  let selectedService = 0;
  serviceButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      if(selectedService === index) return;
      selectedService = index;
      serviceButtons.forEach((other, i) => {
        const panel = $('#service-panel-' + i);
        if(gs) { gs.killTweensOf(panel); gs.set(panel, { clearProps: 'height,overflow' }); }
        other.setAttribute('aria-expanded', String(i === index));
        other.closest('.service').classList.toggle('active', i === index);
        panel.hidden = i !== index;
      });
      const data = serviceImages[index];
      const image = $('#care-image');
      image.removeAttribute('srcset');
      image.src = '/assets/' + data.src + '.webp';
      $('#cuidados').dataset.activeService = String(index);
      $('.care-image-stack').classList.toggle('radio-cover', index === 0);
      $('.care-image-stack').classList.remove('radio-exam');
      $('.image-kicker').textContent = index === 0 ? 'DIAGNÓSTICO POR IMAGEM' : 'CUIDADO EM CADA DETALHE';
      image.alt = data.alt;
      $('#care-image-label').textContent = data.label;
      $('#care-image-index').textContent = '0' + (index + 1) + ' / 04';
      document.dispatchEvent(new CustomEvent('jonk:service-change', {detail:{index}}));
      if(gs && !reduced()) {
        gs.fromTo(image, { scale: 1.08, clipPath: 'inset(0 0 100% 0)' }, { scale: 1, clipPath: 'inset(0 0 0% 0)', duration: .85, ease: 'power3.out', overwrite: true });
        gs.fromTo($('#service-panel-' + index), { height: 0, overflow: 'hidden' }, { height: 'auto', duration: .45, ease: 'power2.out', clearProps: 'height,overflow', onComplete: () => window.ScrollTrigger?.refresh() });
      } else window.ScrollTrigger?.refresh();
    });
    button.addEventListener('keydown', e => {
      let target;
      if(e.key === 'ArrowDown') target = (index + 1) % serviceButtons.length;
      if(e.key === 'ArrowUp') target = (index - 1 + serviceButtons.length) % serviceButtons.length;
      if(e.key === 'Home') target = 0;
      if(e.key === 'End') target = serviceButtons.length - 1;
      if(target !== undefined) { e.preventDefault(); serviceButtons[target].focus(); }
    });
  });

  // Native, touch-friendly horizontal gallery with buttons and keyboard support.
  const gallery = $('.gallery');
  const cards = $$('.gallery-card');
  const prev = $('.gallery-prev');
  const next = $('.gallery-next');
  let galleryFrame = 0;
  const cardStep = () => cards[1].offsetLeft - cards[0].offsetLeft;
  function updateGallery() {
    const max = gallery.scrollWidth - gallery.clientWidth;
    prev.disabled = gallery.scrollLeft < 3;
    next.disabled = gallery.scrollLeft >= max - 3;
    const index = Math.max(0, Math.min(3, Math.round(gallery.scrollLeft / cardStep())));
    $('.gallery-counter').textContent = '0' + (index + 1) + ' — 04';
    galleryFrame = 0;
  }
  const moveGallery = direction => gallery.scrollBy({ left: cardStep() * direction, behavior: scrollBehavior() });
  prev.addEventListener('click', () => moveGallery(-1));
  next.addEventListener('click', () => moveGallery(1));
  gallery.addEventListener('scroll', () => { if(!galleryFrame) galleryFrame = requestAnimationFrame(updateGallery); }, { passive: true });
  gallery.addEventListener('keydown', e => { if(e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); moveGallery(e.key === 'ArrowRight' ? 1 : -1); } });
  window.addEventListener('resize', updateGallery, { passive: true });
  updateGallery();

  // Native dialogs retain keyboard focus and support Escape to close.
  const lightbox = $('#lightbox');
  let photoIndex = 0;
  function renderPhoto() {
    const card = cards[photoIndex];
    $('#lightbox-photo').src = '/assets/' + card.dataset.photo + '.webp';
    $('#lightbox-photo').alt = $('img', card).alt;
    $('#lightbox-caption').textContent = card.dataset.caption + ' · 0' + (photoIndex + 1) + '/04';
  }
  cards.forEach((card, index) => card.addEventListener('click', () => {
    photoIndex = index;
    renderPhoto();
    lightbox.showModal();
    document.body.classList.add('modal-open');
  }));
  function movePhoto(direction) { photoIndex = (photoIndex + direction + cards.length) % cards.length; renderPhoto(); }
  $('#lightbox-prev').addEventListener('click', () => movePhoto(-1));
  $('#lightbox-next').addEventListener('click', () => movePhoto(1));
  lightbox.addEventListener('keydown', e => { if(e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); movePhoto(e.key === 'ArrowRight' ? 1 : -1); } });
  $('#privacy-open').addEventListener('click', () => { $('#privacy').showModal(); document.body.classList.add('modal-open'); });
  $$('[data-close]').forEach(button => button.addEventListener('click', () => $('#' + button.dataset.close).close()));
  $$('dialog').forEach(dialog => {
    dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
    dialog.addEventListener('click', event => { if(event.target === dialog) { const rect = dialog.getBoundingClientRect(); if(event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
  });
  $$('.faq details').forEach(details => details.addEventListener('toggle', () => window.ScrollTrigger?.refresh()));

  // Choreography is progressive enhancement: every section remains visible without JS.
  if(!gs || !window.ScrollTrigger) return;
  gs.registerPlugin(window.ScrollTrigger);
  const media = gs.matchMedia();
  gs.set('.hero-arch > img', { xPercent: -37, yPercent: -50, x: 0, y: 0 });
  media.add('(prefers-reduced-motion: no-preference)', () => {
    const intro = gs.timeline({ defaults: { ease: 'power3.out' } });
    intro.from('.hero .line > *', { yPercent: 115, rotate: 2, duration: 1.15, stagger: .13 }, .1)
      .from('.hero-enter', { y: 20, opacity: 0, duration: .8, stagger: .09 }, .35)
      .from('.hero-arch', { clipPath: 'inset(16% 10% 8% 10% round 240px 240px 20px 20px)', scale: .97, duration: 1.35 }, .05)
      .from('.hero-arch > img', { scale: 1.18, duration: 1.65 }, .05)
      .from('.smile-orbit', { scale: .6, rotation: -50, duration: 1.2, ease: 'back.out(1.3)' }, .5);
    gs.to('.scroll-progress', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: .2 } });
    gs.to('.hero-arch > img', { yPercent: -47, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
    gs.to('.hero-line', { xPercent: -13, y: -30, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 } });
    gs.to('.smile-orbit', { y: -30, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 } });

    const splitHeads = [];
    $$('.reveal-text').forEach(heading => {
      const original = heading.innerHTML;
      const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while(walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(node => {
        const fragment = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(part => {
          if(!part.trim()) fragment.append(document.createTextNode(part));
          else { const clip = document.createElement('span'); clip.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.12em;margin-bottom:-.12em'; const word = document.createElement('span'); word.className = 'reveal-word'; word.style.display = 'inline-block'; word.textContent = part; clip.append(word); fragment.append(clip); }
        });
        node.replaceWith(fragment);
      });
      splitHeads.push([heading, original]);
      gs.from($$('.reveal-word', heading), { yPercent: 110, rotation: 2, stagger: .045, duration: .95, ease: 'power3.out', scrollTrigger: { trigger: heading, start: 'top 88%', once: true } });
    });
    const stroke = $('.care-line path');
    const length = stroke.getTotalLength();
    gs.fromTo(stroke, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.care-grid', start: 'top 85%', end: 'bottom 50%', scrub: 1 } });
    gs.from('.care-image-stack', { clipPath: 'inset(0 0 100% 0 round 0px)', duration: 1.25, ease: 'power3.inOut', scrollTrigger: { trigger: '.care-image-stack', start: 'top 88%', once: true } });
    gs.fromTo('.cinema-frame', { clipPath: 'inset(0 8% 0 8% round 180px 180px 4px 4px)' }, { clipPath: 'inset(0 0% 0 0% round 4px 4px 4px 4px)', ease: 'none', scrollTrigger: { trigger: '.clinic-cinema', start: 'top 90%', end: 'top 15%', scrub: 1 } });
    gs.fromTo('.cinema-frame > img', { yPercent: -4, scale: 1.06 }, { yPercent: 3, scale: 1, ease: 'none', scrollTrigger: { trigger: '.clinic-cinema', start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
    gs.from('.cinema-caption', { y: 55, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.cinema-caption', start: 'top 95%', once: true } });
    gs.from('.contact-photo', { clipPath: 'inset(10% 4% 0 4% round 200px 200px 4px 4px)', duration: 1.3, ease: 'power3.inOut', scrollTrigger: { trigger: '.contact-photo', start: 'top 85%', once: true } });
    return () => splitHeads.forEach(([heading, original]) => heading.innerHTML = original);
  });
  media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    const visual = $('.hero-visual');
    const arch = $('.hero-arch');
    const move = e => { const r = visual.getBoundingClientRect(); gs.to(arch, { rotateY: ((e.clientX - r.left) / r.width - .5) * 3.5, rotateX: -((e.clientY - r.top) / r.height - .5) * 2.5, duration: 1, ease: 'power2.out', overwrite: 'auto' }); };
    const leave = () => gs.to(arch, { rotateY: 0, rotateX: 0, duration: 1.2, ease: 'power2.out' });
    visual.addEventListener('pointermove', move);
    visual.addEventListener('pointerleave', leave);
    return () => { visual.removeEventListener('pointermove', move); visual.removeEventListener('pointerleave', leave); };
  });
  window.addEventListener('load', () => window.ScrollTrigger.refresh(), { once: true });
  document.fonts?.ready.then(() => window.ScrollTrigger.refresh());
})();
