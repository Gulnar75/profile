(() => {
  const config = window.PROFILE_CONFIG;
  const supportedLanguages = ["kk", "ru", "en"];
  const defaultLanguage = "ru";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = (value = "") => String(value)
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  const get = (object, path) => path.split(".").reduce((value, key) => value?.[key], object);
  let messages;
  let currentLanguage;
  let revealObserver;
  let activeProject = null;

  const icons = {
    whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.4-4.7A8.5 8.5 0 1 1 20.5 11.6Z"/><path d="M8.2 7.7c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.8 2c.1.3 0 .5-.2.7l-.6.7c-.2.2-.1.5 0 .7.6 1.1 1.5 2 2.6 2.6.3.1.5.2.7 0l.8-1c.2-.2.4-.3.7-.2l1.9.9c.3.1.4.3.4.5 0 .3-.2 1.5-.9 2.1-.7.7-1.7.9-2.8.6-1.2-.3-2.8-1-4.5-2.5-1.3-1.2-2.4-2.8-2.8-4.1-.4-1.3 0-2.4.5-3Z"/></svg>',
    telegram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 4-3.1 15.2c-.2 1-1 1.2-1.8.8l-4.7-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.8 8.8-8c.4-.3-.1-.5-.6-.2L5.7 13.1 1 11.6c-1-.3-1-1 .2-1.5L19.6 3c.9-.3 1.6.2 1.4 1Z"/></svg>',
    email: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
    github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 22v-4c.1-1-.4-2-1-2.5 3 0 6-1.5 6-6.5 0-1.4-.5-2.6-1.4-3.5.2-1 .1-2-.2-3 0 0-1.1-.4-3.5 1.3a12 12 0 0 0-6 0C6.5 2 5.4 2.5 5.4 2.5c-.3 1-.4 2-.2 3A5 5 0 0 0 3.8 9c0 5 3 6.5 6 6.5-.5.5-.9 1.2-1 2-.9.4-3.1 1.1-4.5-1.3 0 0-.8-1.5-2.3-1.6"/><path d="M9 18c-3.5 1.5-4-1.7-4-1.7"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V8h4v2a5 5 0 0 1 2-2Z"/><path d="M2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="18" cy="6" r="1"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 2h4l-9 10 10 10h-7l-6-7-6 7H1l8-9L1 2h7l5 7Z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12s0-4-1-6c-.5-1-1.5-1.3-2.5-1.5C16 4 12 4 12 4s-4 0-6.5.5C4.5 4.7 3.5 5 3 6c-1 2-1 6-1 6s0 4 1 6c.5 1 1.5 1.3 2.5 1.5C8 20 12 20 12 20s4 0 6.5-.5c1-.2 2-.5 2.5-1.5 1-2 1-6 1-6Z"/><path d="m10 9 5 3-5 3Z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3v11a5 5 0 1 1-4-5"/><path d="M15 3c1 3 3 4 6 4"/></svg>',
    scopus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4z"/><path d="M8 9h8M8 12h8M8 15h5"/></svg>',
    orcid: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9 9v7M9 6.8v.2M12 9h2a3.5 3.5 0 0 1 0 7h-2Z"/></svg>'
  };

  async function loadLanguage(language) {
    const safeLanguage = supportedLanguages.includes(language) ? language : defaultLanguage;
    const response = await fetch(`locales/${safeLanguage}.json`);
    if (!response.ok) throw new Error(`Could not load locale: ${safeLanguage}`);
    messages = await response.json();
    currentLanguage = safeLanguage;
    localStorage.setItem("portfolio-language", safeLanguage);
    document.documentElement.lang = safeLanguage;
    render();
  }

  function applyTranslations() {
    $$("[data-i18n]").forEach((element) => {
      const value = get(messages, element.dataset.i18n);
      if (value) element.textContent = value;
    });
    $$("[data-i18n-aria]").forEach((element) => {
      const value = get(messages, element.dataset.i18nAria);
      if (value) element.setAttribute("aria-label", value);
    });
    $$("[data-i18n-title]").forEach((element) => {
      const value = get(messages, element.dataset.i18nTitle);
      if (value) element.title = value;
    });
    $$("[data-i18n-rich]").forEach((element) => {
      const [first, accent = ""] = get(messages, element.dataset.i18nRich).split("|");
      element.innerHTML = `${esc(first)}<br><span class="serif">${esc(accent)}</span>`;
    });
  }

  function renderProfile() {
    const data = messages.profile;
    const fields = { ...data, shortName: `${data.firstName} ${data.lastName}`, location: config.location, email: config.email };
    $$("[data-field]").forEach((element) => {
      const value = fields[element.dataset.field];
      if (value) element.textContent = value;
    });
    $("#brand-mark").textContent = `${data.firstName[0]}${data.lastName[0]}`.toUpperCase();
    $("#year").textContent = new Date().getFullYear();
    document.title = messages.meta.title;
    $('meta[name="description"]').content = messages.meta.description;
    $('[data-field-link="email"]').href = createEmailUrl();

    $("#metrics").innerHTML = data.metrics.map((item) => `
      <div class="metric reveal"><strong>${esc(item.value)}</strong><span>${esc(item.label)}</span></div>`).join("");
    $("#about-copy").innerHTML = data.about.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("");
    $("#projects").innerHTML = data.projects.map((project, index) => `
      <article class="project-card reveal ${index === 0 ? "project-featured" : ""}">
        <button class="project-open" type="button" data-project="${index}" aria-label="${esc(messages.ui.openCase)}: ${esc(project.title)}">
          <div class="project-art art-${esc(project.tone)}">
            <span class="art-number">${esc(project.number)}</span><span class="art-word">${esc(project.role)}</span><span class="art-circle"></span>
          </div>
          <div class="project-info"><div><p>${esc(project.category)}</p><h3>${esc(project.title)}</h3><span>${esc(project.summary)}</span></div><span class="project-arrow" aria-hidden="true">↗</span></div>
        </button>
      </article>`).join("");
    $("#timeline").innerHTML = data.experience.map((job) => `
      <article class="timeline-item reveal"><p class="timeline-period">${esc(job.period)}</p><div class="timeline-content">
        <p>${esc(job.company)}</p><h3>${esc(job.role)}</h3>
        <ul>${job.achievements.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
        <div class="tag-list">${job.tags.map((tag) => `<span>${esc(tag)}</span>`).join("")}</div>
      </div></article>`).join("");
    $("#skills").innerHTML = data.skills.map((group) => `
      <article class="skill-group reveal"><h3>${esc(group.category)}</h3><ul>${group.items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></article>`).join("");
    $("#education").innerHTML = data.education.map((item) => `
      <article class="detail-item reveal"><p>${esc(item.years)}</p><h3>${esc(item.title)}</h3><span>${esc(item.detail)}</span></article>`).join("");
    $("#languages").innerHTML = data.languages.map((item) => `
      <article class="detail-item language-item reveal"><div class="language-heading"><h3>${esc(item.name)}</h3><p>${esc(item.level)}</p></div>
      <div class="language-scale" role="img" aria-label="${esc(item.name)}: ${esc(item.level)}">
        ${Array.from({ length: 5 }, (_, index) => `<span class="${index < item.score ? "filled" : ""}" aria-hidden="true"></span>`).join("")}
      </div></article>`).join("");
  }

  function createEmailUrl() {
    return `mailto:${config.email}?subject=${encodeURIComponent(messages.ui.emailSubject)}&body=${encodeURIComponent(messages.ui.emailBody)}`;
  }

  function renderContacts() {
    const quickContacts = [
      config.phone && {
        key: "whatsapp", url: `https://wa.me/${config.phone}?text=${encodeURIComponent(messages.ui.whatsappMessage)}`
      },
      config.telegramUsername && {
        key: "telegram", url: `https://t.me/${config.telegramUsername}?text=${encodeURIComponent(messages.ui.telegramMessage)}`
      },
      config.email && { key: "email", url: createEmailUrl() }
    ].filter(Boolean);
    $("#quick-contact").innerHTML = quickContacts.map(({ key, url }) => `
      <a class="contact-chip" href="${esc(url)}" ${key === "email" ? "" : 'target="_blank" rel="noopener noreferrer"'}>
        ${icons[key]}<span>${esc(messages.ui[key])}</span>
      </a>`).join("");

    const socials = Object.entries(config.socialLinks).filter(([, url]) => url);
    $("#social-links").innerHTML = socials.map(([key, url]) => `
      <a href="${esc(url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(key)}" title="${esc(key)}">
        ${icons[key] || icons.email}<span>${esc(key)}</span>
      </a>`).join("");
  }

  function openProject(index) {
    activeProject = index;
    const project = messages.profile.projects[index];
    const projectUrl = project.link ? config.socialLinks[project.link] : "";
    $("#dialog-content").innerHTML = `
      <p class="eyebrow">${esc(project.category)}</p><h2 id="dialog-title">${esc(project.title)}</h2>
      <p class="dialog-summary">${esc(project.summary)}</p>
      <div class="case-grid">
        <section><span>01 · ${esc(messages.ui.problem)}</span><p>${esc(project.problem)}</p></section>
        <section><span>02 · ${esc(messages.ui.solution)}</span><p>${esc(project.solution)}</p></section>
        <section><span>03 · ${esc(messages.ui.result)}</span><p>${esc(project.result)}</p></section>
      </div>
      <div class="tag-list">${project.stack.map((tag) => `<span>${esc(tag)}</span>`).join("")}</div>
      ${projectUrl ? `<a class="button button-primary" href="${esc(projectUrl)}" target="_blank" rel="noopener noreferrer">${esc(messages.ui.openProject)} ↗</a>` : ""}`;
    $("#project-dialog").showModal();
  }

  function setThemeLabel() {
    const dark = document.documentElement.dataset.theme === "dark";
    $("#theme-toggle").setAttribute("aria-label", dark ? messages.ui.themeLight : messages.ui.themeDark);
  }

  function setupReveal() {
    revealObserver?.disconnect();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      $$(".reveal").forEach((element) => element.classList.add("visible"));
      return;
    }
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    $$(".reveal").forEach((element) => revealObserver.observe(element));
  }

  function renderSchema() {
    $("#person-schema").textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "Person",
      name: `${messages.profile.firstName} ${messages.profile.lastName}`,
      jobTitle: messages.profile.status, email: `mailto:${config.email}`,
      address: config.location,
      sameAs: Object.values(config.socialLinks).filter(Boolean)
    });
  }

  function render() {
    applyTranslations();
    renderProfile();
    renderContacts();
    renderSchema();
    setThemeLabel();
    $$(".language-switcher button").forEach((button) => {
      const active = button.dataset.lang === currentLanguage;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    if ($("#project-dialog").open && activeProject !== null) openProject(activeProject);
    setupReveal();
  }

  function setupEvents() {
    document.addEventListener("click", (event) => {
      const projectButton = event.target.closest(".project-open");
      if (projectButton) openProject(Number(projectButton.dataset.project));
      const languageButton = event.target.closest("[data-lang]");
      if (languageButton && languageButton.dataset.lang !== currentLanguage) loadLanguage(languageButton.dataset.lang);
    });
    $(".dialog-close").addEventListener("click", () => $("#project-dialog").close());
    $("#project-dialog").addEventListener("click", (event) => {
      if (event.target === $("#project-dialog")) $("#project-dialog").close();
    });
    const menuButton = $("#menu-button");
    const mobileNav = $("#mobile-nav");
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      mobileNav.hidden = open;
    });
    $$("#mobile-nav a").forEach((link) => link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      mobileNav.hidden = true;
    }));
    $("#theme-toggle").addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      localStorage.setItem("portfolio-theme", next);
      setThemeLabel();
    });
    $(".print-button").addEventListener("click", () => window.print());
  }

  function setupStaticUi() {
    const storedTheme = localStorage.getItem("portfolio-theme");
    document.documentElement.dataset.theme = storedTheme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    $$(".cv-link").forEach((link) => {
      link.href = config.cvUrl;
      link.toggleAttribute("hidden", !config.cvUrl);
    });
    const sections = $$("main section[id]");
    const navLinks = $$("nav a[href^='#']");
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) navLinks.forEach((link) => link.classList.toggle("active", link.hash === `#${entry.target.id}`));
      });
    }, { rootMargin: "-35% 0px -55%" });
    sections.forEach((section) => spy.observe(section));
    const header = $(".site-header");
    const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 18);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  async function init() {
    setupStaticUi();
    setupEvents();
    const storedLanguage = localStorage.getItem("portfolio-language");
    const queryLanguage = new URLSearchParams(location.search).get("lang");
    try {
      await loadLanguage(queryLanguage || storedLanguage || defaultLanguage);
    } catch (error) {
      console.error(error);
      if (storedLanguage && storedLanguage !== defaultLanguage) await loadLanguage(defaultLanguage);
    }
  }

  init();
})();
