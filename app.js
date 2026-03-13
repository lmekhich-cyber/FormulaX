// FormulaX — L'Atlas des Sciences
// Interactive behaviors

// ─── Theme Toggle ───
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
  localStorage.setItem('formulax-theme', theme);
}

// Load saved theme
const savedTheme = localStorage.getItem('formulax-theme') || 'dark';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  setTheme(current === 'light' ? 'dark' : 'light');
});

// ─── Navbar scroll effect ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ─── Level bar active highlight ───
const levelItems = document.querySelectorAll('.level-item');
levelItems.forEach(item => {
  item.addEventListener('click', () => {
    levelItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});

// ─── Toggle solution visibility ───
function toggleSolution(btn) {
  const card = btn.closest('.exercise-card');
  const solution = card.querySelector('.solution-block');
  const isHidden = solution.classList.contains('hidden');

  solution.classList.toggle('hidden', !isHidden);
  btn.textContent = isHidden ? '🙈 Masquer la solution' : '👁 Voir la solution';

  // Re-render MathJax in revealed solution
  if (isHidden && window.MathJax) {
    MathJax.typesetPromise([solution]).catch(console.error);
  }
}

// ─── Smooth reveal on scroll ───
const observerOpts = {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOpts);

// Apply initial hidden state and observe
document.querySelectorAll('.formula-card, .exercise-card, .constant-card').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`;
  observer.observe(el);
});

// ─── MathJax config ───
window.MathJax = {
  tex: {
    inlineMath: [['\\(', '\\)']],
    displayMath: [['\\[', '\\]']],
    tags: 'none'
  },
  options: {
    skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
  },
  startup: {
    ready() {
      MathJax.startup.defaultReady();
      console.log('MathJax ready ✓');
    }
  }
};

// ─── Search / filter (keyboard shortcut) ───
document.addEventListener('keydown', e => {
  if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    // Could implement a search modal here
  }
});

// ─── Copy formula on click ───
document.querySelectorAll('.formula-display').forEach(el => {
  el.style.cursor = 'copy';
  el.title = 'Cliquer pour copier';
  el.addEventListener('click', async () => {
    const text = el.textContent.trim();
    try {
      await navigator.clipboard.writeText(text);
      const orig = el.style.background;
      el.style.background = 'rgba(129,140,248,0.2)';
      setTimeout(() => { el.style.background = orig; }, 600);
    } catch {}
  });
});

console.log('🔬 FormulaX chargé — L\'Atlas des Sciences');
