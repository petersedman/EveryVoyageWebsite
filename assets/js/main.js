// Navigation - dynamically injected for consistency across pages
(function() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const isIndex = currentPage === 'index.html' || currentPage === '';

  // Helper to get correct href for index page vs other pages
  const href = (path) => {
    if (path.startsWith('#')) {
      return isIndex ? path : `index.html${path}`;
    }
    return path;
  };

  // Check if link is active
  const isActive = (page) => {
    if (page === 'index.html') return isIndex;
    return currentPage === page;
  };

  // Desktop nav links
  const navLinks = document.getElementById('navLinks');
  if (navLinks) {
    navLinks.innerHTML = `
      <li><a href="${href('#features')}">Features</a></li>
      <li><a href="${href('#how-it-works')}">How It Works</a></li>
      <li><a href="about.html"${isActive('about.html') ? ' class="active"' : ''}>About</a></li>
      <li><a href="faq.html"${isActive('faq.html') ? ' class="active"' : ''}>FAQ</a></li>
      <li><a href="contact.html"${isActive('contact.html') ? ' class="active"' : ''}>Contact</a></li>
      <li>
        <div class="lang-switcher" id="langSwitcher">
          <button class="lang-switcher-btn" aria-label="Change language">
            EN
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="lang-dropdown">
            <a href="index.html" class="active">English (UK)</a>
            <a href="es/index.html">Español</a>
            <a href="de/index.html">Deutsch</a>
            <a href="sv/index.html">Svenska</a>
            <a href="it/index.html">Italiano</a>
            <a href="fr/index.html">Français</a>
          </div>
        </div>
      </li>
      <li><a href="${href('#download')}" class="nav-cta">Download</a></li>
    `;
  }

  // Mobile menu links
  const mobileMenuInner = document.getElementById('mobileMenuInner');
  if (mobileMenuInner) {
    mobileMenuInner.innerHTML = `
      <hr class="mobile-divider">
      <a href="${href('#features')}">Features</a>
      <a href="${href('#how-it-works')}">How It Works</a>
      <a href="about.html"${isActive('about.html') ? ' class="active"' : ''}>About</a>
      <a href="faq.html"${isActive('faq.html') ? ' class="active"' : ''}>FAQ</a>
      <a href="contact.html"${isActive('contact.html') ? ' class="active"' : ''}>Contact</a>
      <hr class="mobile-divider">
      <div class="mobile-lang-switch">
        <a href="index.html" class="active">EN</a>
        <a href="es/index.html">ES</a>
        <a href="de/index.html">DE</a>
        <a href="sv/index.html">SV</a>
        <a href="it/index.html">IT</a>
        <a href="fr/index.html">FR</a>
      </div>
      <hr class="mobile-divider">
      <a href="${href('#download')}" class="mobile-cta">Download</a>
    `;
  }
})();

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

function openMenu(){
  document.body.classList.add('menu-open');
  navToggle.setAttribute('aria-expanded', 'true');
  mobileMenu.setAttribute('aria-hidden', 'false');
  navToggle.setAttribute('aria-label', 'Close menu');
}

function closeMenu(){
  document.body.classList.remove('menu-open');
  navToggle.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  navToggle.setAttribute('aria-label', 'Open menu');
}

navToggle?.addEventListener('click', () => {
  document.body.classList.contains('menu-open') ? closeMenu() : openMenu();
});

mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.body.classList.contains('menu-open')) closeMenu();
});
mobileMenu?.addEventListener('click', (e) => {
  if (e.target === mobileMenu) closeMenu();
});

// Language switcher toggle
const langSwitcher = document.getElementById('langSwitcher');
const langBtn = langSwitcher?.querySelector('.lang-switcher-btn');

langBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  langSwitcher.classList.toggle('open');
});

document.addEventListener('click', () => {
  langSwitcher?.classList.remove('open');
});
