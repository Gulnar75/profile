# Промпт: премиум сайт-портфолио + резюме (один сайт)

> Готово к копипасту в Cursor / Lovable / v0 / Claude / Bolt / и т.д.
> Замени плейсхолдеры `[...]` на свои данные.

```markdown
# Задача
Ты — senior product-дизайнер и front-end инженер уровня Awwwards.
Сделай ОДИН сайт, который одновременно работает как:
1) Портфолио с визуальными кейсами (storytelling + метрики),
2) Резюме (структурированный опыт, навыки, образование — чтобы HR за 30 сек
   понял, кто я, и мог распечатать в A4).

Не делай два отдельных сайта. Один сайт, два режима восприятия.
Сайт должен выглядеть так, чтобы рекрутер из FAANG / McKinsey / top-studio
подумал «вау» в первые 3 секунды.

# Стек (выбери ОДИН и обоснуй)
- A) Next.js 14 (App Router) + TypeScript + Tailwind + Framer Motion + shadcn/ui
- B) Astro + TypeScript + Tailwind + островки React только где нужен интерактив
- C) Чистый HTML5 + CSS (Grid/Flex, variables) + vanilla JS — если важны
  скорость и отсутствие сборки
Рекомендую A для премиума с интерактивом или C для максимально лёгкого
статического варианта под print.

# Структура (порядок секций)
1. Hero — фото/графика, имя, должность, 1 строка ценности, CTA:
   «Связаться», «Скачать резюме (PDF)», «Смотреть работы».
2. About — 3–5 предложений + 3 ключевые цифры (X лет / Y проектов / Z юзеров).
3. Skills — сгруппированные теги по категориям (Frontend / Backend / Tools /
   Languages). Уровень — элегантно, без звёздочек из 2003.
4. Experience (resume-формат) — вертикальный timeline, свежее сверху.
   Каждая позиция: Компания · Должность · Период · 3–5 буллетов с
   ИЗМЕРИМЫМИ результатами (% / X× / $) · стек.
5. Selected Work — сетка 3–6 кейсов. Карточка: превью, название, роль,
   краткое описание. Hover-эффект. Клик → отдельная страница кейса или
   модалка: Problem → Process → Solution → Metrics.
6. Education & Certifications.
7. Talks / Publications / Awards (если есть).
8. Contact — email, telegram, linkedin, github/behance + простая форма
   (Formspree / Resend).
9. Footer — © год, «Built with care», ссылка на исходники, если open-source.

# Дизайн
- Эстетика: премиальный минимализм, много воздуха, типографика — главный
  герой. Референсы по вкусу: rauchg.com, brianlovin.com, read.cv, linear.app.
- Шрифты: Inter или Satoshi (UI) + Instrument Serif или Fraunces (акценты).
  НЕ используй Roboto/Open Sans по умолчанию.
- Палитра: нейтральная база (off-white #FAFAF7, near-black #0A0A0A) + 1
  акцент. Поддержать dark mode с автодетектом системной темы.
- Сетка: 12 колонок, max-width 1200–1280, padding ≥ 24px mobile / 64px desktop.
- Анимации: subtle, осмысленные, уважай prefers-reduced-motion.
- Иконки: Lucide или Phosphor, единый stroke-width.
- Изображения: WebP/AVIF, lazy, blur-placeholder, правильные aspect-ratio.

# Функциональные требования
- [ ] Mobile-first, breakpoints 640 / 768 / 1024 / 1280.
- [ ] Light/dark theme с автодетектом.
- [ ] Плавный scroll по якорям с offset под sticky header.
- [ ] Sticky header с scrollspy (активный пункт подсвечивается).
- [ ] SEO: meta, Open Graph, Twitter card, JSON-LD Person schema.
- [ ] A11y WCAG AA: фокус-кольца, alt, semantic HTML, skip-to-content,
      навигация с клавиатуры.
- [ ] Lighthouse: Perf ≥ 95, A11y ≥ 95, BP ≥ 95, SEO ≥ 95.
- [ ] Кнопка «Скачать резюме» → print-friendly PDF текущей страницы.
- [ ] Print-stylesheet: A4, ч/б, без навигации, только Experience+Skills+
      Education.
- [ ] Опционально: Plausible / Umami (privacy-first аналитика).
- [ ] README с деплоем на Vercel / Netlify / Cloudflare Pages за 1 клик.

# Контент-плейсхолдеры (заполни моими данными)
- Имя: [ИМЯ]
- Должность: [ДОЛЖНОСТЬ]
- Локация: [ГОРОД]
- Email / Telegram / LinkedIn / GitHub: [ССЫЛКИ]
- About (5 предложений): [ТЕКСТ]
- Опыт: [{ company, role, period, bullets: [«сделал X → метрика Y»], stack }]
- Образование: [{ school, degree, years }]
- Проекты: [{ title, description, role, link, screenshot }] (3–6 шт)
- Навыки: { Frontend: [...], Backend: [...], Tools: [...], Languages: [...] }
- Языки: [{ lang, level }]

# Definition of Done
1. Открывается < 1.5 сек на 3G.
2. 0 ошибок в console, валидный HTML/CSS.
3. Печатается как A4-резюме.
4. Всё доступно с клавиатуры, tab-order логичен.
5. Все ссылки живые, no 404.
6. На РЕАЛЬНОМ контенте (не Lorem Ipsum) выглядит как готовое портфолио,
   которое не стыдно отправить рекрутеру.
7. Деплой за 1 команду из README.

# Процесс
СНАЧАЛА план, ПОТОМ код. До написания кода выдай:
- выбор стека + обоснование (1 абзац),
- sitemap (список секций),
- текстовый wireframe каждой секции,
- палитра (hex) + шрифты (с font-family),
- этапы реализации (что делаешь на каждом шаге).
Дождись моего «ок» → начинай кодить.
```

## Как пользоваться

1. Скопируй промпт целиком.
2. Замени `[ПЛЕЙСХОЛДЕРЫ]` на свои данные (чем конкретнее цифры в опыте — тем
   сильнее результат).
3. Залей в Cursor Composer / Claude / v0 / Lovable / Bolt.
4. На этапе «плана» — попроси его утвердить, иначе он начнёт фигачить код
   с потолка.
5. Когда получишь первую версию — прогони по чек-листу DoD, особенно
   Lighthouse и print-режим.
