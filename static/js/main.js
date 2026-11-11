// Header: change style on scroll, mobile menu toggle
const header = document.getElementById('site-header');
const nav = document.getElementById('site-nav');
const toggle = document.getElementById('menu-toggle');

const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 50);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// Sliders: banner (fades with .active) and testimonials (shows one card)
document.querySelectorAll('[data-slider]').forEach(slider => {
  const slides = [...slider.querySelectorAll('[data-slide]')];
  const dots = [...slider.querySelectorAll('[data-dot]')];
  const delay = Number(slider.dataset.delay) || 5000;
  let current = 0;
  let timer;

  const show = index => {
    current = (index + slides.length) % slides.length;
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === current);
      if (s.hasAttribute('hidden') || s.classList.contains('card')) s.hidden = i !== current;
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    restart();
  };
  const restart = () => {
    clearInterval(timer);
    if (slides.length > 1) timer = setInterval(() => show(current + 1), delay);
  };

  dots.forEach((d, i) => d.addEventListener('click', () => show(i)));
  slider.querySelector('[data-prev]')?.addEventListener('click', () => show(current - 1));
  slider.querySelector('[data-next]')?.addEventListener('click', () => show(current + 1));
  restart();
});

// Statistics: count up when the section scrolls into view
const counters = document.querySelector('[data-counters]');
if (counters) {
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    const items = [...counters.querySelectorAll('[data-count]')];
    const start = performance.now(), duration = 1800;
    const step = now => {
      const p = Math.min((now - start) / duration, 1);
      items.forEach(el => { el.textContent = Math.floor(Number(el.dataset.count) * p); });
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, { threshold: 0.4 });
  observer.observe(counters);
}
