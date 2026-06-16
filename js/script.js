document.addEventListener("DOMContentLoaded", function () {

  const texts = [
    "Front-End Developer",
    "UI/UX Designer",
    "BSIT Student",
    "QA Learner"
  ];

  let index = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentText = texts[index];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    const el = document.getElementById("changing-text");

    if (!el) return; // safety check

    el.textContent = currentText.substring(0, charIndex);

    let speed = isDeleting ? 60 : 120;

    if (!isDeleting && charIndex === currentText.length) {
      speed = 1200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      index = (index + 1) % texts.length;
      speed = 300;
    }

    setTimeout(typeEffect, speed);
  }

  typeEffect();

  // Scrollspy + sliding underline indicator
  const nav = document.querySelector('nav');
  const links = document.querySelectorAll('nav a[href^="#"], .nav-link[href^="#"]');
  const sections = Array.from(links).map(l => document.querySelector(l.hash)).filter(Boolean);

  let indicator = null;
  if (nav) {
    indicator = document.createElement('div');
    indicator.className = 'nav-underline';
    nav.appendChild(indicator);
  }

  function updateIndicator(link) {
    if (!indicator || !link || !nav) return;
    const linkRect = link.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    const left = linkRect.left - navRect.left + nav.scrollLeft;
    indicator.style.width = `${linkRect.width}px`;
    indicator.style.transform = `translateX(${left}px)`;
  }

  function clearActive() {
    links.forEach(l => l.classList.remove('active'));
  }

  if (sections.length && window.IntersectionObserver) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const link = document.querySelector(`nav a[href="#${id}"], .nav-link[href="#${id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          clearActive();
          link.classList.add('active');
          updateIndicator(link);
        }
      });
    }, { threshold: 0.6 });

    sections.forEach(s => observer.observe(s));
  }

  links.forEach(l => {
    l.addEventListener('click', (e) => {
      // let browser handle scrolling; still set active class immediately
      clearActive();
      l.classList.add('active');
      updateIndicator(l);
    });
  });

  // On load, position indicator under the active link or first link
  window.addEventListener('load', () => {
    const active = document.querySelector('nav a.active, .nav-link.active') || links[0];
    if (active) updateIndicator(active);
  });

  // Keep indicator in the right place when resizing
  window.addEventListener('resize', () => {
    const active = document.querySelector('nav a.active, .nav-link.active');
    if (active) updateIndicator(active);
  });

});

// Populate Bootstrap project modal with data-* from clicked project button
document.addEventListener('DOMContentLoaded', () => {
  const projectModalEl = document.getElementById('projectModal');
  if (!projectModalEl) return;

  projectModalEl.addEventListener('show.bs.modal', (event) => {
    const trigger = event.relatedTarget; // the element that triggered the modal
    if (!trigger) return;
    const title = trigger.dataset.title || '';
    const img1 = trigger.dataset.image1 || '';
    const img2 = trigger.dataset.image2 || '';
    const img3 = trigger.dataset.image3 || '';
    const desc = trigger.dataset.desc || '';
      const extra = trigger.dataset.extra || '';

    const label = projectModalEl.querySelector('#projectModalLabel');
    const imageEl1 = projectModalEl.querySelector('#projectModalImage1');
    const imageEl2 = projectModalEl.querySelector('#projectModalImage2');
    const imageEl3 = projectModalEl.querySelector('#projectModalImage3');
    const descEl = projectModalEl.querySelector('#projectModalDesc');

    if (label) label.textContent = title;
    if (imageEl1) imageEl1.src = img1;
    if (imageEl2) imageEl2.src = img2;
    if (imageEl3) imageEl3.src = img3;
    if (descEl) descEl.textContent = desc;
    const extraEl = projectModalEl.querySelector('#projectModalExtra');
    if (extraEl) {
      if (extra) {
        extraEl.textContent = extra;
        extraEl.classList.remove('d-none');
      } else {
        extraEl.textContent = '';
        extraEl.classList.add('d-none');
      }
    }
    // Auto-scroll modal body to the description/extra so user sees it without manual scroll
    setTimeout(() => {
      const body = projectModalEl.querySelector('.modal-body');
      const target = projectModalEl.querySelector('#projectModalExtra') || descEl;
      if (body && target) {
        // Calculate target position relative to the scroll container
        const bodyRect = body.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const offset = (targetRect.top - bodyRect.top) + body.scrollTop - 12;
        body.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
      }
    }, 200);
  });
  
  // Clear extra content when modal is hidden
  projectModalEl.addEventListener('hidden.bs.modal', () => {
    const extraEl = projectModalEl.querySelector('#projectModalExtra');
    if (extraEl) {
      extraEl.textContent = '';
      extraEl.classList.add('d-none');
    }
  });
});


const aboutSlides = document.querySelectorAll('.about-slide');
const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.25 });

aboutSlides.forEach(slide => slideObserver.observe(slide));