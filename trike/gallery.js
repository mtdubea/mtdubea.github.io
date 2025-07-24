/*  gallery.js  ––– simple tab system + light-box  */
document.addEventListener('DOMContentLoaded', () => {

  /* ––– tab switching ––– */
  const tabs   = document.querySelectorAll('.gallery-tabs .tab');
  const panels = document.querySelectorAll('.panel');

  tabs.forEach(tab => tab.addEventListener('click', () => {
    // hide all
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));

    // show chosen
    tab.classList.add('active');
    document.getElementById(tab.dataset.target).classList.add('active');

    // scroll top of panel for long pages
    window.scroll({ top: 140, behavior: 'smooth' });
  }));


  /* ––– quick & light image light-box ––– */
  const overlay = document.createElement('div');
  overlay.className = 'lightbox hide';
  overlay.innerHTML = '<img alt=""><span class="close">×</span>';
  document.body.appendChild(overlay);

  const lbImg   = overlay.querySelector('img');
  const lbClose = overlay.querySelector('.close');

  document.querySelectorAll('.gallery-grid img').forEach(img => {
    img.addEventListener('click', () => {
      lbImg.src   = img.src;
      lbImg.alt   = img.alt;
      overlay.classList.remove('hide');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLB () {
    overlay.classList.add('hide');
    document.body.style.overflow = '';
  }
  lbClose.addEventListener('click', closeLB);
  overlay.addEventListener('click', e => e.target === overlay && closeLB());
  document.addEventListener('keydown', e => e.key === 'Escape' && !overlay.classList.contains('hide') && closeLB());
});
