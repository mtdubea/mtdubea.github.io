// Enhanced portfolio behavior: progressive reveal, progress bar, back-to-top, card polish.
(function(){
  const doc = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const progress = document.createElement('div');
  progress.className = 'site-progress';
  progress.setAttribute('aria-hidden','true');
  document.body.appendChild(progress);

  const top = document.createElement('a');
  top.className = 'back-to-top';
  top.href = '#top';
  top.setAttribute('aria-label','Back to top');
  top.textContent = '↑';
  document.body.appendChild(top);
  if(!document.getElementById('top')) document.body.id = document.body.id || 'top';

  function onScroll(){
    const max = Math.max(1, doc.scrollHeight - innerHeight);
    const pct = Math.min(100, Math.max(0, scrollY / max * 100));
    progress.style.width = pct + '%';
    top.classList.toggle('is-visible', scrollY > 500);
  }
  addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  const revealTargets = document.querySelectorAll('main section, .card, .project-card, .rail-card, .resume-section, .cert-card, .metric');
  revealTargets.forEach(el => el.classList.add('reveal-on-scroll'));
  if('IntersectionObserver' in window && !reduce){
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  // Mark external links and file downloads with safer metadata.
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href') || '';
    if(/^https?:\/\//i.test(href) && !href.includes(location.host)){
      a.target = a.target || '_blank';
      a.rel = 'noopener noreferrer';
    }
    if(/\.(pdf|zip|docx?|xlsx?|pptx?)($|\?)/i.test(href)){
      a.setAttribute('data-file-link','true');
    }
  });
})();
