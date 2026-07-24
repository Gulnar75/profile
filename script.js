(() => {
  const data = window.PORTFOLIO_DATA;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = (value = "") => String(value)
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  const missing = (value = "") => String(value).includes("[");
  const initials = `${data.firstName?.[0] || ""}${data.lastName?.[0] || ""}`.toUpperCase();

  $$("[data-field]").forEach((element) => {
    const value = data[element.dataset.field];
    if (value) element.textContent = value;
    element.classList.toggle("is-placeholder", missing(value));
  });
  $("#brand-mark").textContent = initials;
  $("#year").textContent = new Date().getFullYear();
  document.title = `${data.shortName} — портфолио и резюме`;

  const emailLink = $('[data-field-link="email"]');
  emailLink.href = `mailto:${data.email}`;

  $$(".cv-link").forEach((link) => {
    if (data.cvUrl) link.href = data.cvUrl;
    else {
      link.removeAttribute("target");
      link.addEventListener("click", (event) => {
        event.preventDefault();
        window.print();
      });
    }
  });

  $("#metrics").innerHTML = data.metrics.map((item) => `
    <div class="metric reveal">
      <strong class="${missing(item.value) ? "is-placeholder" : ""}">${esc(item.value)}</strong>
      <span>${esc(item.label)}</span>
    </div>`).join("");

  $("#about-copy").innerHTML = data.about.map((paragraph) =>
    `<p class="${missing(paragraph) ? "is-placeholder" : ""}">${esc(paragraph)}</p>`
  ).join("");

  $("#projects").innerHTML = data.projects.map((project, index) => `
    <article class="project-card reveal ${index === 0 ? "project-featured" : ""}">
      <button class="project-open" type="button" data-project="${index}" aria-label="Открыть кейс ${esc(project.title)}">
        <div class="project-art art-${esc(project.tone)}">
          <span class="art-number">${esc(project.number)}</span>
          <span class="art-word">${esc(project.role)}</span>
          <span class="art-circle"></span>
        </div>
        <div class="project-info">
          <div>
            <p>${esc(project.category)}</p>
            <h3 class="${missing(project.title) ? "is-placeholder" : ""}">${esc(project.title)}</h3>
            <span>${esc(project.summary)}</span>
          </div>
          <span class="project-arrow" aria-hidden="true">↗</span>
        </div>
      </button>
    </article>`).join("");

  $("#timeline").innerHTML = data.experience.map((job) => `
    <article class="timeline-item reveal">
      <p class="timeline-period">${esc(job.period)}</p>
      <div class="timeline-content">
        <p>${esc(job.company)}</p>
        <h3 class="${missing(job.role) ? "is-placeholder" : ""}">${esc(job.role)}</h3>
        <ul>${job.achievements.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
        <div class="tag-list">${job.tags.map((tag) => `<span>${esc(tag)}</span>`).join("")}</div>
      </div>
    </article>`).join("");

  $("#skills").innerHTML = data.skills.map((group) => `
    <article class="skill-group reveal">
      <h3>${esc(group.category)}</h3>
      <ul>${group.items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
    </article>`).join("");

  $("#education").innerHTML = data.education.map((item) => `
    <article class="detail-item reveal">
      <p>${esc(item.years)}</p><h3>${esc(item.title)}</h3><span>${esc(item.detail)}</span>
    </article>`).join("");

  $("#languages").innerHTML = data.languages.map((item) => `
    <article class="detail-item language-item reveal">
      <div class="language-heading">
        <h3>${esc(item.name)}</h3>
        <p>${esc(item.level)}</p>
      </div>
      <div class="language-scale" role="img" aria-label="${esc(item.name)}: ${esc(item.level)}">
        ${Array.from({ length: 5 }, (_, index) =>
          `<span class="${index < item.score ? "filled" : ""}" aria-hidden="true"></span>`
        ).join("")}
      </div>
    </article>`).join("");

  $("#social-links").innerHTML = data.socials.map((social) => {
    const isReady = Boolean(social.url);
    return `<a href="${isReady ? esc(social.url) : "#"}" ${isReady ? 'target="_blank" rel="noreferrer"' : 'aria-disabled="true"'} class="${isReady ? "" : "disabled-link"}">
      <span>${esc(social.label)}</span><span aria-hidden="true">↗</span>
    </a>`;
  }).join("");
  $$(".disabled-link").forEach((link) => link.addEventListener("click", (event) => event.preventDefault()));

  const dialog = $("#project-dialog");
  $$(".project-open").forEach((button) => button.addEventListener("click", () => {
    const project = data.projects[Number(button.dataset.project)];
    $("#dialog-content").innerHTML = `
      <p class="eyebrow">${esc(project.category)}</p>
      <h2 id="dialog-title">${esc(project.title)}</h2>
      <p class="dialog-summary">${esc(project.summary)}</p>
      <div class="case-grid">
        <section><span>01 · Задача</span><p>${esc(project.problem)}</p></section>
        <section><span>02 · Решение</span><p>${esc(project.solution)}</p></section>
        <section><span>03 · Результат</span><p>${esc(project.result)}</p></section>
      </div>
      <div class="tag-list">${project.stack.map((tag) => `<span>${esc(tag)}</span>`).join("")}</div>
      ${project.url ? `<a class="button button-primary" href="${esc(project.url)}" target="_blank" rel="noreferrer">Открыть проект ↗</a>` : ""}
    `;
    dialog.showModal();
  }));
  $(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  const menuButton = $("#menu-button");
  const mobileNav = $("#mobile-nav");
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    mobileNav.hidden = true;
  };
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    mobileNav.hidden = open;
  });
  $$("#mobile-nav a").forEach((link) => link.addEventListener("click", closeMenu));

  const themeButton = $("#theme-toggle");
  const storedTheme = localStorage.getItem("portfolio-theme");
  const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const setTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    themeButton.setAttribute("aria-label", theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему");
  };
  setTheme(storedTheme || (preferredDark ? "dark" : "light"));
  themeButton.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("portfolio-theme", next);
  });

  $(".print-button").addEventListener("click", () => window.print());

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach((element) => observer.observe(element));

  const sections = $$("main section[id]");
  const navLinks = $$("nav a[href^='#']");
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.classList.toggle("active", link.hash === `#${entry.target.id}`));
    });
  }, { rootMargin: "-35% 0px -55%" });
  sections.forEach((section) => spy.observe(section));

  $("#person-schema").textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.shortName,
    jobTitle: data.role,
    email: `mailto:${data.email}`,
    address: data.location,
    sameAs: data.socials.filter((item) => item.url).map((item) => item.url)
  });
})();
