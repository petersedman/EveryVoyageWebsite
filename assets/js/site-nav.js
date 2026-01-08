/**
 * EveryVoyage Site Navigation Web Component
 * Usage: <site-nav lang="en" page="index" base-path=""></site-nav>
 *
 * Attributes:
 *   - lang: Current language code (en, en-us, sv, da, no, de, es, fr, it, nl)
 *   - page: Current page (index, about, faq, contact)
 *   - base-path: Path to root (empty for root, "../" for subfolders)
 */

class SiteNav extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['lang', 'page', 'base-path'];
  }

  // Language configuration
  static LANGUAGES = {
    'en': { code: 'EN', name: 'English (UK)', path: '', shortCode: 'UK' },
    'en-us': { code: 'EN-US', name: 'English (US)', path: 'en-us/', shortCode: 'US' },
    'es': { code: 'ES', name: 'Español', path: 'es/', shortCode: 'ES' },
    'de': { code: 'DE', name: 'Deutsch', path: 'de/', shortCode: 'DE' },
    'sv': { code: 'SV', name: 'Svenska', path: 'sv/', shortCode: 'SV' },
    'it': { code: 'IT', name: 'Italiano', path: 'it/', shortCode: 'IT' },
    'fr': { code: 'FR', name: 'Français', path: 'fr/', shortCode: 'FR' },
    'nl': { code: 'NL', name: 'Nederlands', path: 'nl/', shortCode: 'NL' },
    'da': { code: 'DA', name: 'Dansk', path: 'da/', shortCode: 'DA' },
    'no': { code: 'NO', name: 'Norsk', path: 'no/', shortCode: 'NO' }
  };

  // Menu labels per language
  static MENU_LABELS = {
    'en': { features: 'Features', howItWorks: 'How It Works', about: 'About', faq: 'FAQ', contact: 'Contact', download: 'Download', openMenu: 'Open menu', closeMenu: 'Close menu', changeLang: 'Change language' },
    'en-us': { features: 'Features', howItWorks: 'How It Works', about: 'About', faq: 'FAQ', contact: 'Contact', download: 'Download', openMenu: 'Open menu', closeMenu: 'Close menu', changeLang: 'Change language' },
    'sv': { features: 'Funktioner', howItWorks: 'Så fungerar det', about: 'Om oss', faq: 'FAQ', contact: 'Kontakt', download: 'Ladda ner', openMenu: 'Öppna meny', closeMenu: 'Stäng meny', changeLang: 'Byt språk' },
    'da': { features: 'Funktioner', howItWorks: 'Sådan virker det', about: 'Om os', faq: 'FAQ', contact: 'Kontakt', download: 'Download', openMenu: 'Åbn menu', closeMenu: 'Luk menu', changeLang: 'Skift sprog' },
    'no': { features: 'Funksjoner', howItWorks: 'Slik fungerer det', about: 'Om oss', faq: 'FAQ', contact: 'Kontakt', download: 'Last ned', openMenu: 'Åpne meny', closeMenu: 'Lukk meny', changeLang: 'Bytt språk' },
    'de': { features: 'Funktionen', howItWorks: 'So funktioniert\'s', about: 'Über uns', faq: 'FAQ', contact: 'Kontakt', download: 'Download', openMenu: 'Menü öffnen', closeMenu: 'Menü schließen', changeLang: 'Sprache wechseln' },
    'es': { features: 'Funciones', howItWorks: 'Cómo funciona', about: 'Nosotros', faq: 'FAQ', contact: 'Contacto', download: 'Descargar', openMenu: 'Abrir menú', closeMenu: 'Cerrar menú', changeLang: 'Cambiar idioma' },
    'fr': { features: 'Fonctionnalités', howItWorks: 'Comment ça marche', about: 'À propos', faq: 'FAQ', contact: 'Contact', download: 'Télécharger', openMenu: 'Ouvrir le menu', closeMenu: 'Fermer le menu', changeLang: 'Changer de langue' },
    'it': { features: 'Funzionalità', howItWorks: 'Come funziona', about: 'Chi siamo', faq: 'FAQ', contact: 'Contatti', download: 'Scarica', openMenu: 'Apri menu', closeMenu: 'Chiudi menu', changeLang: 'Cambia lingua' },
    'nl': { features: 'Functies', howItWorks: 'Hoe het werkt', about: 'Over ons', faq: 'FAQ', contact: 'Contact', download: 'Downloaden', openMenu: 'Menu openen', closeMenu: 'Menu sluiten', changeLang: 'Taal wijzigen' }
  };

  get lang() { return this.getAttribute('lang') || 'en'; }
  get page() { return this.getAttribute('page') || 'index'; }
  get basePath() { return this.getAttribute('base-path') || ''; }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback() {
    if (this.shadowRoot.innerHTML) {
      this.render();
      this.setupEventListeners();
    }
  }

  getLabels() {
    return SiteNav.MENU_LABELS[this.lang] || SiteNav.MENU_LABELS['en'];
  }

  getLangConfig() {
    return SiteNav.LANGUAGES[this.lang] || SiteNav.LANGUAGES['en'];
  }

  // Get href for navigation links
  getHref(target) {
    const isIndex = this.page === 'index';
    if (target.startsWith('#')) {
      return isIndex ? target : `index.html${target}`;
    }
    return target;
  }

  // Get path to a language version of current page
  getLangPath(langKey, pageFile) {
    const langConfig = SiteNav.LANGUAGES[langKey];
    const currentLangConfig = this.getLangConfig();

    // Calculate relative path from current language folder to target
    let path = this.basePath;

    // If we're in a language subfolder and going to root English
    if (langKey === 'en') {
      return `${path}${pageFile}`;
    }

    // Going to another language subfolder
    return `${path}${langConfig.path}${pageFile}`;
  }

  getPageFile() {
    return this.page === 'index' ? 'index.html' : `${this.page}.html`;
  }

  render() {
    const labels = this.getLabels();
    const langConfig = this.getLangConfig();
    const pageFile = this.getPageFile();

    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>

      <nav id="navbar">
        <a href="${this.getHref('index.html')}" class="logo">
          <img src="${this.basePath}assets/brand/Logo.png" alt="EveryVoyage" class="logo-img">
        </a>

        <button class="nav-toggle" id="navToggle" aria-label="${labels.openMenu}" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>

        <ul class="nav-links">
          <li><a href="${this.getHref('#features')}">${labels.features}</a></li>
          <li><a href="${this.getHref('#how-it-works')}">${labels.howItWorks}</a></li>
          <li><a href="about.html"${this.page === 'about' ? ' class="active"' : ''}>${labels.about}</a></li>
          <li><a href="faq.html"${this.page === 'faq' ? ' class="active"' : ''}>${labels.faq}</a></li>
          <li><a href="contact.html"${this.page === 'contact' ? ' class="active"' : ''}>${labels.contact}</a></li>
          <li><a href="${this.getHref('#download')}" class="nav-cta">${labels.download}</a></li>
          <li>
            <div class="lang-switcher" id="langSwitcher">
              <button class="lang-switcher-btn" aria-label="${labels.changeLang}">
                ${langConfig.name}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div class="lang-dropdown">
                ${this.renderLangDropdown(pageFile)}
              </div>
            </div>
          </li>
        </ul>
      </nav>

      <div class="mobile-menu" id="mobileMenu" aria-hidden="true">
        <div class="mobile-menu-inner">
          <hr class="mobile-divider">
          <a href="${this.getHref('#features')}">${labels.features}</a>
          <a href="${this.getHref('#how-it-works')}">${labels.howItWorks}</a>
          <a href="about.html"${this.page === 'about' ? ' class="active"' : ''}>${labels.about}</a>
          <a href="faq.html"${this.page === 'faq' ? ' class="active"' : ''}>${labels.faq}</a>
          <a href="contact.html"${this.page === 'contact' ? ' class="active"' : ''}>${labels.contact}</a>
          <hr class="mobile-divider">
          <a href="${this.getHref('#download')}" class="mobile-cta">${labels.download}</a>
          <hr class="mobile-divider">
          <select class="mobile-lang-select" id="mobileLangSelect" aria-label="${labels.changeLang}">
            ${this.renderMobileLangSelect(pageFile)}
          </select>
        </div>
      </div>
    `;
  }

  renderLangDropdown(pageFile) {
    return Object.entries(SiteNav.LANGUAGES).map(([key, config]) => {
      const isActive = key === this.lang;
      const href = this.getLangPath(key, pageFile);
      return `<a href="${href}"${isActive ? ' class="active"' : ''}>${config.name}</a>`;
    }).join('');
  }

  renderMobileLangSwitch(pageFile) {
    return Object.entries(SiteNav.LANGUAGES).map(([key, config]) => {
      const isActive = key === this.lang;
      const href = this.getLangPath(key, pageFile);
      return `<a href="${href}"${isActive ? ' class="active"' : ''}>${config.shortCode}</a>`;
    }).join('');
  }

  renderMobileLangSelect(pageFile) {
    return Object.entries(SiteNav.LANGUAGES).map(([key, config]) => {
      const isActive = key === this.lang;
      const href = this.getLangPath(key, pageFile);
      return `<option value="${href}"${isActive ? ' selected' : ''}>${config.name}</option>`;
    }).join('');
  }

  setupEventListeners() {
    const navToggle = this.shadowRoot.getElementById('navToggle');
    const mobileMenu = this.shadowRoot.getElementById('mobileMenu');
    const langSwitcher = this.shadowRoot.getElementById('langSwitcher');
    const langBtn = langSwitcher?.querySelector('.lang-switcher-btn');
    const mobileLangSelect = this.shadowRoot.getElementById('mobileLangSelect');
    const labels = this.getLabels();

    // Mobile menu toggle
    const openMenu = () => {
      this.classList.add('menu-open');
      document.body.classList.add('menu-open');
      navToggle.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
      navToggle.setAttribute('aria-label', labels.closeMenu);
    };

    const closeMenu = () => {
      this.classList.remove('menu-open');
      document.body.classList.remove('menu-open');
      navToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      navToggle.setAttribute('aria-label', labels.openMenu);
    };

    navToggle?.addEventListener('click', () => {
      document.body.classList.contains('menu-open') ? closeMenu() : openMenu();
    });

    // Close menu on link click
    mobileMenu?.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMenu);
    });

    // Close menu on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
        closeMenu();
      }
    });

    // Close menu on backdrop click
    mobileMenu?.addEventListener('click', (e) => {
      if (e.target === mobileMenu) closeMenu();
    });

    // Language switcher toggle
    langBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      langSwitcher.classList.toggle('open');
    });

    document.addEventListener('click', () => {
      langSwitcher?.classList.remove('open');
    });

    // Mobile language select
    mobileLangSelect?.addEventListener('change', (e) => {
      window.location.href = e.target.value;
    });
  }

  getStyles() {
    return `
      :host {
        display: block;
        --color-cream: #F7F4ED;
        --color-warm-white: #FEFDFB;
        --color-peach: #fac189;
        --color-orange-light: #f15614;
        --color-orange: #f54a00;
        --color-charcoal: #2A2A28;
        --color-slate: #5A5A58;
        --color-mist: #E8E5DE;
        --font-display: 'Fraunces', Georgia, serif;
        --font-body: 'DM Sans', system-ui, sans-serif;
        --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
        --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      nav {
        position: sticky;
        top: 0;
        z-index: 1000;
        padding: 1.5rem 2rem;
        background: rgba(247, 244, 237, 0.95);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid var(--color-mist);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
      }

      .logo-img {
        height: 50px;
        width: auto;
        display: block;
      }

      .nav-links {
        display: flex;
        gap: 2rem;
        list-style: none;
        align-items: center;
        margin: 0;
        padding: 0;
      }

      .nav-links a {
        color: var(--color-slate);
        text-decoration: none;
        font-family: var(--font-body);
        font-size: 0.95rem;
        font-weight: 500;
        transition: color 0.2s var(--ease-smooth);
      }

      .nav-links a:hover {
        color: var(--color-orange);
      }

      .nav-links a.active {
        color: var(--color-orange);
      }

      .nav-cta {
        background: var(--color-orange);
        color: var(--color-cream) !important;
        padding: 0.75rem 1.5rem;
        border-radius: 100px;
        transition: transform 0.2s var(--ease-bounce), box-shadow 0.2s var(--ease-smooth) !important;
      }

      .nav-cta:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(45, 74, 62, 0.3);
      }

      /* Language switcher */
      .lang-switcher {
        position: relative;
        display: flex;
        align-items: center;
      }

      .lang-switcher-btn {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.5rem 0.75rem;
        background: var(--color-warm-white);
        border: 1px solid var(--color-mist);
        border-radius: 8px;
        font-family: var(--font-body);
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--color-slate);
        cursor: pointer;
        transition: all 0.2s var(--ease-smooth);
      }

      .lang-switcher-btn:hover {
        border-color: var(--color-peach);
        color: var(--color-charcoal);
      }

      .lang-switcher-btn svg {
        width: 16px;
        height: 16px;
        transition: transform 0.2s var(--ease-smooth);
      }

      .lang-switcher.open .lang-switcher-btn svg {
        transform: rotate(180deg);
      }

      .lang-dropdown {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        background: var(--color-warm-white);
        border: 1px solid var(--color-mist);
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        min-width: 140px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-8px);
        transition: all 0.2s var(--ease-smooth);
        z-index: 1001;
      }

      .lang-switcher.open .lang-dropdown {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      .lang-dropdown a {
        display: block;
        padding: 0.75rem 1rem;
        color: var(--color-slate);
        text-decoration: none;
        font-family: var(--font-body);
        font-size: 0.9rem;
        transition: all 0.15s var(--ease-smooth);
      }

      .lang-dropdown a:first-child {
        border-radius: 12px 12px 0 0;
      }

      .lang-dropdown a:last-child {
        border-radius: 0 0 12px 12px;
      }

      .lang-dropdown a:hover {
        background: var(--color-cream);
        color: var(--color-charcoal);
      }

      .lang-dropdown a.active {
        background: var(--color-orange);
        color: var(--color-cream);
      }

      /* Mobile nav toggle */
      .nav-toggle {
        display: none;
        width: 44px;
        height: 44px;
        border: 1px solid var(--color-mist);
        background: var(--color-warm-white);
        border-radius: 12px;
        cursor: pointer;
        padding: 10px;
        gap: 6px;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }

      .nav-toggle span {
        display: block;
        width: 20px;
        height: 2px;
        background: var(--color-charcoal);
        border-radius: 999px;
        transition: transform 0.25s var(--ease-smooth), opacity 0.2s var(--ease-smooth);
      }

      /* Mobile menu */
      .mobile-menu {
        position: fixed;
        inset: 0;
        background: rgba(247, 244, 237, 0.96);
        backdrop-filter: blur(12px);
        z-index: 999;
        display: none;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }

      .mobile-menu-inner {
        min-height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 7.5rem 2rem 2rem;
        gap: 1.75rem;
        text-align: left;
      }

      .mobile-menu-inner > * {
        max-width: 420px;
      }

      .mobile-menu a {
        font-family: var(--font-display);
        font-size: 1rem;
        font-weight: 500;
        color: var(--color-charcoal);
        text-decoration: none;
      }

      .mobile-menu a:hover {
        color: var(--color-orange);
      }

      .mobile-menu a.active {
        color: var(--color-orange);
      }

      .mobile-cta {
        margin-top: 0.5rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.9rem 1.6rem;
        border-radius: 999px;
        background: var(--color-orange);
        color: var(--color-cream) !important;
        font-family: var(--font-body);
        font-size: 1.05rem;
      }

      .mobile-divider {
        width: 100%;
        border: none;
        height: 1px;
        background: var(--color-mist);
        margin: 0.25rem 0;
      }

      .mobile-lang-switch {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: 0.5rem;
      }

      .mobile-lang-switch a {
        font-family: var(--font-body);
        font-size: 0.9rem;
        padding: 0.5rem 1rem;
        border: 1px solid var(--color-mist);
        border-radius: 8px;
      }

      .mobile-lang-switch a.active {
        background: var(--color-orange);
        color: var(--color-cream);
        border-color: var(--color-orange);
      }

      .mobile-lang-select {
        width: 100%;
        padding: 0.9rem 1rem;
        font-family: var(--font-body);
        font-size: 1rem;
        color: var(--color-charcoal);
        background: var(--color-warm-white);
        border: 1px solid var(--color-mist);
        border-radius: 12px;
        cursor: pointer;
        transition: border-color 0.2s var(--ease-smooth);
      }

      .mobile-lang-select:focus {
        outline: none;
        border-color: var(--color-orange);
      }

      /* Menu open state - using :host(.menu-open) to detect component state */
      :host(.menu-open) .mobile-menu {
        display: block;
      }

      :host(.menu-open) .nav-toggle span:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
      }

      :host(.menu-open) .nav-toggle span:nth-child(2) {
        opacity: 0;
      }

      :host(.menu-open) .nav-toggle span:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
      }

      /* Responsive */
      @media (max-width: 768px) {
        nav {
          padding: 1rem 1.25rem;
        }

        .nav-links {
          display: none;
        }

        .nav-toggle {
          display: flex;
        }
      }
    `;
  }
}

// Register the custom element
customElements.define('site-nav', SiteNav);

// Global styles for menu-open state (injected once)
if (!document.getElementById('site-nav-global-styles')) {
  const globalStyles = document.createElement('style');
  globalStyles.id = 'site-nav-global-styles';
  globalStyles.textContent = `
    body.menu-open { overflow: hidden; }
  `;
  document.head.appendChild(globalStyles);
}
