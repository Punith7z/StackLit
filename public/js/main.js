// ─── MVJ ShelfIQ Client JS ───────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // ── Autocomplete Search ──────────────────────────────────────────────────
  const searchInputs = document.querySelectorAll('.nav-search-input');

  searchInputs.forEach(input => {
    const form = input.closest('form');
    const wrapper = input.closest('.nav-search');
    if (!wrapper) return;

    let dropdown = wrapper.querySelector('.autocomplete-dropdown');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.className = 'autocomplete-dropdown';
      wrapper.appendChild(dropdown);
    }

    let debounceTimer;

    input.addEventListener('input', () => {
      const q = input.value.trim();
      clearTimeout(debounceTimer);

      if (q.length < 2) {
        dropdown.classList.remove('active');
        dropdown.innerHTML = '';
        return;
      }

      debounceTimer = setTimeout(async () => {
        try {
          const res = await fetch(`/api/suggest?q=${encodeURIComponent(q)}`);
          const suggestions = await res.json();

          if (suggestions.length === 0) {
            dropdown.classList.remove('active');
            return;
          }

          dropdown.innerHTML = suggestions.map(s => `
            <a href="/book/${s.id}" class="autocomplete-item">
              <div class="autocomplete-item-icon">📘</div>
              <div>
                <div class="autocomplete-item-title">${highlight(s.title, q)}</div>
                <div class="autocomplete-item-sub">${s.subject} · ${s.author}</div>
              </div>
            </a>
          `).join('');

          dropdown.classList.add('active');
        } catch (e) {
          console.error('Autocomplete error:', e);
        }
      }, 220);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });

    // Navigate with keyboard
    input.addEventListener('keydown', (e) => {
      const items = dropdown.querySelectorAll('.autocomplete-item');
      const active = dropdown.querySelector('.autocomplete-item.focused');

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!active) {
          items[0]?.classList.add('focused');
        } else {
          const idx = [...items].indexOf(active);
          active.classList.remove('focused');
          items[(idx + 1) % items.length]?.classList.add('focused');
        }
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (active) {
          const idx = [...items].indexOf(active);
          active.classList.remove('focused');
          items[(idx - 1 + items.length) % items.length]?.classList.add('focused');
        }
      }

      if (e.key === 'Enter' && active) {
        e.preventDefault();
        active.click();
      }

      if (e.key === 'Escape') {
        dropdown.classList.remove('active');
      }
    });
  });

  // ── Highlight matching text ──────────────────────────────────────────────
  function highlight(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark style="background:var(--blue-100);color:var(--blue-700);border-radius:3px;padding:0 2px">$1</mark>');
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // ── Sort form auto-submit ────────────────────────────────────────────────
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      sortSelect.closest('form').submit();
    });
  }

  // ── Scroll reveal animation ──────────────────────────────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = entry.target.dataset.delay || '0ms';
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.book-card').forEach((card, i) => {
    card.dataset.delay = `${(i % 6) * 60}ms`;
    observer.observe(card);
  });

  // ── Focused autocomplete item style ─────────────────────────────────────
  document.addEventListener('mouseenter', (e) => {
    if (e.target.classList.contains('autocomplete-item')) {
      document.querySelectorAll('.autocomplete-item.focused')
        .forEach(el => el.classList.remove('focused'));
    }
  }, true);

  // ── Navbar scroll effect ─────────────────────────────────────────────────
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar.style.boxShadow = '0 2px 20px rgba(15,45,110,0.10)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });

  // ── Book card hover pulse ─────────────────────────────────────────────────
  document.querySelectorAll('.book-card').forEach(card => {
    card.addEventListener('click', () => {
      const link = card.querySelector('a');
      if (link) window.location.href = link.href;
    });
  });

});