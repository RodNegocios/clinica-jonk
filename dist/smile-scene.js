(() => {
  const section = document.querySelector('.essence-story');
  const video = document.querySelector('#smile-video');
  const toggle = document.querySelector('.smile-motion-toggle');
  if (!section || !video || !window.gsap || !window.ScrollTrigger) return;
  const gs = window.gsap;
  gs.registerPlugin(window.ScrollTrigger);
  const media = gs.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    section.classList.add('is-scroll-scene');
    toggle.hidden = false;
    let frozen = false, frame = 0, targetTime = 0, disposed = false;
    const playhead = { progress: 0 };
    // Only seek once the previous frame has decoded. Coalesce fast scroll events.
    function seek() {
      frame = 0;
      if (disposed || frozen || document.hidden || !Number.isFinite(video.duration) || video.readyState < 1 || video.seeking) return;
      if (Math.abs(video.currentTime - targetTime) > 1 / 45) video.currentTime = targetTime;
    }
    function requestSeek() { if (!frame && !disposed) frame = requestAnimationFrame(seek); }
    function updateVideo() {
      if (!Number.isFinite(video.duration)) return;
      targetTime = Math.min(video.duration - .08, Math.max(0, playhead.progress * (video.duration - .08)));
      requestSeek();
    }
    function loadVideo() { if (!video.getAttribute('src')) { video.src = video.dataset.src; video.load(); } }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { loadVideo(); observer.disconnect(); }
    }, { rootMargin: '800px 0px' });
    observer.observe(section);
    video.addEventListener('loadedmetadata', updateVideo);
    video.addEventListener('loadeddata', requestSeek);
    video.addEventListener('seeked', requestSeek);
    document.addEventListener('visibilitychange', requestSeek);
    const onToggle = () => {
      frozen = !frozen;
      toggle.setAttribute('aria-pressed', String(frozen));
      toggle.innerHTML = frozen ? 'Retomar movimento <span aria-hidden="true"><svg class="glyph-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#play"/></svg></span>' : 'Pausar movimento <span aria-hidden="true"><svg class="glyph-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#pause"/></svg></span>';
      if (!frozen) requestSeek();
    };
    toggle.addEventListener('click', onToggle);
    // A curved aperture grows out of the cream page into a full-bleed scene.
    const entrance = gs.timeline({scrollTrigger: {trigger: section, start: 'top 92%', end: 'top top', scrub: .7, invalidateOnRefresh: true}});
    entrance.fromTo('.essence-film', {clipPath: 'inset(14% 29% 12% 29% round 240px 240px 240px 240px)'}, {clipPath:'inset(0% 0% 0% 0% round 0px 0px 0px 0px)',ease:'power2.inOut',duration:1},0)
      .fromTo(video,{scale:1.2},{scale:1,ease:'power2.out',duration:1},0)
      .fromTo('.essence-editorial .section-label',{autoAlpha:0,y:25},{autoAlpha:1,y:0,duration:.35},.4)
      .fromTo('.smile-story-copy',{autoAlpha:0,y:95},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'},.48);
    const narrative = gs.timeline({scrollTrigger:{trigger:section,start:'top top',end:'bottom bottom',scrub:.65,invalidateOnRefresh:true}});
    narrative.to(playhead,{progress:1,duration:1,ease:'none',onUpdate:updateVideo},0)
      .to('.smile-progress > span',{scaleX:1,duration:1,ease:'none'},0)
      .to('.smile-story-copy',{autoAlpha:0,y:-55,duration:.18,ease:'power2.in'},.43)
      .fromTo('.smile-story-closing',{autoAlpha:0,y:55},{autoAlpha:1,y:0,duration:.23,ease:'power2.out'},.58);
    window.ScrollTrigger.refresh();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      video.pause();
      video.removeEventListener('loadedmetadata', updateVideo);
      video.removeEventListener('loadeddata', requestSeek);
      video.removeEventListener('seeked', requestSeek);
      document.removeEventListener('visibilitychange', requestSeek);
      toggle.removeEventListener('click', onToggle);
      toggle.hidden = true;
      toggle.setAttribute('aria-pressed','false');
      toggle.innerHTML = 'Pausar movimento <span aria-hidden="true"><svg class="glyph-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#pause"/></svg></span>';
      section.classList.remove('is-scroll-scene');
      // Return to the poster when the user switches to reduced motion.
      video.removeAttribute('src');
      video.load();
    };
  });
})();
