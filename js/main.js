/* =========================================================
   Be Yogiic: site settings
   Edit these values. Everything on every page updates automatically.
   ========================================================= */
const CONFIG = {
  phoneDisplay: "+91 82910 01827",   // shown on the page
  phone: "918291001827",             // digits with country code
  whatsapp: "",                      // digits with country code (leave "" to use phone)
  instagram: "",                     // full URL, e.g. "https://instagram.com/beyogiic"
};

/* ========================================================= */

document.documentElement.classList.add("js");

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

/* Pages inside /blog set data-root="../" on <body> */
const ROOT = document.body.dataset.root || "";
const ENQUIRE = ROOT ? `${ROOT}index.html#enquire` : "#enquire";

const waNumber = (CONFIG.whatsapp || CONFIG.phone).replace(/\D/g, "");
const waUrl = (text) =>
  waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}` : ENQUIRE;

/* ---------- Contact links ---------- */
$$("[data-wa-link]").forEach((a) => {
  const topic = a.dataset.waTopic ? ` I just read "${a.dataset.waTopic}".` : "";
  a.href = waUrl(`Hi Kiirti,${topic} I'd like to know more about yoga classes at Be Yogiic.`);
  if (waNumber) { a.target = "_blank"; a.rel = "noopener"; }
});
$$("[data-phone-link]").forEach((a) => {
  a.href = CONFIG.phone ? `tel:+${CONFIG.phone.replace(/\D/g, "")}` : ENQUIRE;
});
$$("[data-phone-text]").forEach((el) => (el.textContent = CONFIG.phoneDisplay));
$$("[data-insta-link]").forEach((a) => {
  if (CONFIG.instagram) a.href = CONFIG.instagram;
  else a.remove();
});

/* On blog posts, the Book icon jumps to the booking form on the same page */
if ($("#book")) $$(".qa-book").forEach((a) => (a.href = "#book"));

$$(".js-year").forEach((el) => (el.textContent = new Date().getFullYear()));

/* ---------- Header ---------- */
const header = $(".site-header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const toggle = $(".nav-toggle");
const setNav = (open) => {
  document.body.classList.toggle("nav-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
};
toggle.addEventListener("click", () => setNav(!document.body.classList.contains("nav-open")));
$$(".main-nav a").forEach((a) => a.addEventListener("click", () => setNav(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setNav(false); });

/* Highlight the nav link for the section in view (home page) */
const navLinks = $$('.main-nav a[href^="#"]:not(.btn)');
if (navLinks.length) {
  const sectionObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${entry.target.id}`));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  navLinks.forEach((l) => { const s = $(l.getAttribute("href")); if (s) sectionObs.observe(s); });
}

/* ---------- Reveal on scroll ---------- */
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("in"); revealObs.unobserve(entry.target); }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
$$(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 90}ms`;
  revealObs.observe(el);
});

/* ---------- Service pre-selection ---------- */
function selectService(val) {
  $$('select[name="service"]').forEach((sel) => {
    const match = Array.from(sel.options).find((o) => o.value === val || o.text === val);
    if (match) sel.value = match.value;
  });
}
$$("[data-service]").forEach((a) => a.addEventListener("click", () => selectService(a.dataset.service)));
/* Links like index.html?service=Park%20Yoga#enquire (used by blog posts) */
const urlService = new URLSearchParams(location.search).get("service");
if (urlService) selectService(urlService);

/* ---------- Lead forms: send straight to WhatsApp (home page + blog posts) ---------- */
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* Phones and tablets open the WhatsApp app in the same tab; computers open WhatsApp Web / Desktop in a new tab */
const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
  (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));

function openWhatsApp(url) {
  if (isMobile) { location.href = url; return; }
  const w = window.open(url, "_blank");
  if (w) w.opener = null;
  else location.href = url; // pop-up blocked
}

function initLeadForm(form) {
  const status = $(".form-status", form);
  const val = (name) => (form.elements[name] ? form.elements[name].value.trim() : "");
  const setStatus = (msg, type = "") => { status.textContent = msg; status.className = `form-status ${type}`; };

  function validate() {
    let ok = true;
    const phoneDigits = val("phone").replace(/\D/g, "");
    const checks = [
      [form.elements.name, val("name").length >= 2],
      [form.elements.phone, !phoneDigits || (phoneDigits.length >= 10 && phoneDigits.length <= 13)],
      [form.elements.service, !!val("service")],
    ];
    checks.forEach(([el, valid]) => {
      if (!el) return;
      el.closest(".field")?.classList.toggle("invalid", !valid);
      el.setAttribute("aria-invalid", String(!valid));
      if (!valid) ok = false;
    });
    if (!ok) {
      setStatus("Please add your name and choose a service (and check the phone number, if you added one).", "err");
      form.querySelector('[aria-invalid="true"]')?.focus();
    }
    return ok;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (form.elements.botcheck?.checked) return; // bot
    if (!validate()) return;

    const d = {
      name: val("name"),
      phone: val("phone"),
      service: val("service"),
      preferred_time: val("preferred_time"),
      message: val("message"),
    };
    const fromArticle = ROOT ? `\n(I found you through: ${document.title.split(" | ")[0]})` : "";
    const text =
      `Hi Kiirti, I'd like to book a yoga session.\n\nName: ${d.name}\nInterested in: ${d.service}` +
      (d.preferred_time ? `\nPreferred time: ${d.preferred_time}` : "") +
      (d.phone ? `\nPhone: ${d.phone}` : "") +
      (d.message ? `\nGoals: ${d.message}` : "") +
      fromArticle;
    const url = waUrl(text);

    openWhatsApp(url);
    form.innerHTML = `
      <div class="form-success">
        <h3>Thank you, ${escapeHtml(d.name.split(" ")[0])}</h3>
        <p>WhatsApp has opened with your message ready. Just tap <strong>Send</strong> and Kiirti will reply personally.</p>
        <a class="btn btn-primary" href="${url}" target="_blank" rel="noopener">Didn't open? Send on WhatsApp</a>
      </div>`;
  });

  $$("input, select", form).forEach((el) =>
    el.addEventListener("input", () => el.closest(".field")?.classList.remove("invalid"))
  );
}
$$("form.lead-form").forEach(initLeadForm);

/* ---------- Gallery lightbox ---------- */
const lb = $(".lightbox");
if (lb) {
  const lbImg = $("img", lb);
  const items = $$(".g-item");
  let current = 0;
  let lastFocus = null;

  const show = (i) => {
    current = (i + items.length) % items.length;
    const img = $("img", items[current]);
    lbImg.src = img.src;
    lbImg.alt = img.alt;
  };
  const openLb = (i) => {
    lastFocus = document.activeElement;
    show(i);
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    $(".lb-close", lb).focus();
  };
  const closeLb = () => {
    lb.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  };

  items.forEach((btn, i) => btn.addEventListener("click", () => openLb(i)));
  $(".lb-close", lb).addEventListener("click", closeLb);
  $(".lb-prev", lb).addEventListener("click", () => show(current - 1));
  $(".lb-next", lb).addEventListener("click", () => show(current + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  let touchX = null;
  lb.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    touchX = null;
  });
}
