# Be Yogiic website

A single-page site: plain HTML, CSS and JS, with no build step. Open `index.html` in a browser to preview it.

## Before going live

1. **Contact details:** edit the `CONFIG` block at the top of `js/main.js`.
   The phone and WhatsApp number (+91 82910 01827) is already set. Add the Instagram URL if there is one.
   The booking forms send enquiries straight to WhatsApp (the app on phones, WhatsApp Web or Desktop on computers),
   with the name, service, preferred time and goals filled in. Blog-post enquiries also say which article the visitor read.
2. **Testimonials:** in `index.html`, search for `TODO: replace the three placeholder testimonials`,
   replace the quotes and names, and delete each `<span class="sample-badge">Sample</span>`.
3. **Package details:** search for `TODO: add the number of sessions` and update each `.price-meta` line.
4. **About Kiirti:** search for `TODO: add Kiirti's certifications` to add credentials and experience.

## Blog

Articles live in `blog/`. To publish a new one:

1. Copy `blog/_template.html` and rename it, e.g. `blog/yoga-for-better-sleep.html` (lowercase, with hyphens).
2. Replace the title, description, date, cover image and article text. The booking form at the bottom is already set up.
   Set which service is pre-selected by moving the `selected` attribute in the form's `<select>`.
3. Add a card linking to it on `blog/index.html`, and optionally in the "journal" section of `index.html`.

WhatsApp enquiries sent from an article say which article it was, so you can see which posts bring in clients.

## SEO checklist before launch

1. **Domain:** the site is set up for `https://www.beyogiic.in` (canonical links, sitemap, robots.txt and the `CNAME` file GitHub Pages uses).
   DNS at the registrar: four A records for `@` (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153)
   and a CNAME for `www` pointing to `jude1234.github.io`. Then tick **Enforce HTTPS** in the repository Settings → Pages.
2. **Instagram:** if you have an Instagram page, add `"sameAs": ["https://instagram.com/..."]` to the business details in the `<head>` of `index.html`, next to `"telephone"`.
3. **Google Search Console** (free): add the site, then submit `https://www.beyogiic.in/sitemap.xml`.
4. **Google Business Profile:** set it up as a service-area business (address hidden, serving Malad West and nearby), using the same name and phone number as the website.
5. **Keep the FAQ in sync.** If you edit an FAQ answer in `index.html`, update the matching text in the `FAQPage` data in the `<head>`.
6. **New blog posts:** add each one to `sitemap.xml`, and change `noindex` to `index` in your copy of the template.

## Hosting

Hosted on GitHub Pages from https://github.com/jude1234/beyogiic-website (branch `main`, root folder). Changes go live a minute or two after they are pushed.
