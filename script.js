/* =============================================
   AFFAN RAHMANI — PORTFOLIO
   script.js
   ============================================= */

/* ---------- PAGE IDs IN ORDER ---------- */
const PAGE_ORDER = ['profile', 'about', 'resume', 'portfolio', 'blog', 'contact'];

/* ---------- SCROLL TO SECTION (replaces showPage) ---------- */
function scrollToSection(id, btn) {
  const target = document.getElementById('page-' + id);
  if (!target) return;

  // Update nav active state
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  if (btn) {
    btn.classList.add('active');
  } else {
    // Find the matching nav button
    const allBtns = document.querySelectorAll('.nav-btn');
    allBtns.forEach(b => {
      if (b.getAttribute('onclick') && b.getAttribute('onclick').includes("'" + id + "'")) {
        b.classList.add('active');
      }
    });
  }

  // Scroll smoothly to section
  const navHeight = document.querySelector('.nav').offsetHeight;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
  window.scrollTo({ top: targetTop, behavior: 'smooth' });
}

/* ---------- LEGACY showPage (still works if called anywhere) ---------- */
function showPage(id, btn) {
  scrollToSection(id, btn);
}

/* ---------- SCROLL SPY — updates nav as you scroll ---------- */
function initScrollSpy() {
  const navHeight = document.querySelector('.nav').offsetHeight;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id.replace('page-', '');
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        const allBtns = document.querySelectorAll('.nav-btn');
        allBtns.forEach(b => {
          if (b.getAttribute('onclick') && b.getAttribute('onclick').includes("'" + id + "'")) {
            b.classList.add('active');
          }
        });

        // Trigger skill bar animation when resume section is visible
        if (id === 'resume') animateSkills();
      }
    });
  }, {
    root: null,
    rootMargin: `-${navHeight + 10}px 0px -50% 0px`,
    threshold: 0
  });

  PAGE_ORDER.forEach(id => {
    const el = document.getElementById('page-' + id);
    if (el) observer.observe(el);
  });
}

/* ---------- SKILL BAR ANIMATION ---------- */
let skillsAnimated = false;
function animateSkills() {
  if (skillsAnimated) return;
  skillsAnimated = true;
  setTimeout(() => {
    document.querySelectorAll('.skill-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });
  }, 150);
}

/* ---------- PROJECT FILTER ---------- */
function filterProjects(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.project-card').forEach(card => {
    card.style.display =
      (cat === 'all' || card.dataset.cat === cat)
        ? 'block'
        : 'none';
  });
}

/* ---------- MOBILE SIDEBAR (kept for compatibility) ---------- */
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('overlay');
  if (sb) sb.classList.toggle('open');
  if (ov) ov.classList.toggle('show');
}

function closeSidebar() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('overlay');
  if (sb) sb.classList.remove('open');
  if (ov) ov.classList.remove('show');
}

/* ---------- CONTACT FORM ---------- */
document.addEventListener('DOMContentLoaded', () => {

  // Make all pages visible for scroll layout
  document.querySelectorAll('.page').forEach(p => {
    p.style.display = 'block';
  });

  // Init scroll spy
  initScrollSpy();

  // Contact form
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('.form-btn');
    const originalText = btn.innerHTML;

    btn.innerHTML = 'Sending...';
    btn.disabled = true;

    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim()
    };

    try {
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbySIxcdPWrh9_TpW19PDRVTSNQLy72s7iVHOled00l1irETpD4xMNIr0-V0R6Ia7uMn/exec',
        {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: { 'Content-Type': 'text/plain;charset=utf-8' }
        }
      );

      await response.text();
      btn.innerHTML = 'Message Sent ✓';
      form.reset();

    } catch (err) {
      console.error(err);
      btn.innerHTML = 'Failed!';
    }

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }, 2500);
  });

});
