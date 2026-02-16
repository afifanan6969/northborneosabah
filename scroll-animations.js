// Scroll Animation Engine with Glassmorphism & Counter Effects
document.documentElement.style.scrollBehavior = 'smooth';

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      
      // Trigger number counters if present
      const counters = entry.target.querySelectorAll('.counter-value');
      counters.forEach(counter => {
        if (!counter.dataset.animated) {
          animateCounter(counter);
        }
      });
      
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Animate elements with fade-in + slide-up
document.querySelectorAll('.card, .stat-card, .benefit-card, .section, .product-item, .org-box, .tradingview').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  observer.observe(el);
});

// Counter animation for statistics
function animateCounter(element) {
  const finalValue = parseInt(element.textContent.replace(/\D/g, ''));
  const duration = 1500; // ms
  const steps = 60;
  const stepDuration = duration / steps;
  let currentStep = 0;

  const prefix = element.textContent.match(/^[^\d]*/)[0];
  const suffix = element.textContent.match(/[^\d]*$/)[0];

  const interval = setInterval(() => {
    currentStep++;
    const progress = currentStep / steps;
    const currentValue = Math.floor(finalValue * progress);
    element.textContent = prefix + currentValue.toLocaleString() + suffix;

    if (currentStep === steps) {
      element.textContent = prefix + finalValue.toLocaleString() + suffix;
      element.dataset.animated = 'true';
      clearInterval(interval);
    }
  }, stepDuration);
}

// Add glassmorphism hover lift effect to interactive elements
document.querySelectorAll('a, button, .card, .product-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    el.style.transform = (el.style.transform || '') + ' translateY(-4px)';
    el.style.boxShadow = '0 20px 40px rgba(11, 102, 35, 0.2)';
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = el.style.transform.replace('translateY(-4px)', '');
    el.style.boxShadow = '';
  });
});

// Smooth parallax on hero sections
window.addEventListener('scroll', () => {
  document.querySelectorAll('.hero-section').forEach(hero => {
    const scrollPos = window.scrollY;
    const rect = hero.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      hero.style.backgroundPosition = `center ${scrollPos * 0.5}px`;
    }
  });
});
