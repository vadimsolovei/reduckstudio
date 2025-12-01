// Reusable IntersectionObserver helper
function createAnimationObserver(threshold = 0.2) {
  const observerOptions = {
    threshold,
    rootMargin: '0px 0px -50px 0px',
  };

  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
}

// Reusable keyboard activation helper
function addKeyboardActivation(element, callback) {
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
  };

  const themeSwitcher = document.getElementById('theme-switcher');
  const themeStylesheet = document.getElementById('theme-stylesheet');

  if (!themeSwitcher || !themeStylesheet) {
    console.error('Required theme elements not found');
    return;
  }

  // Debounce mechanism
  let themeChangeTimeout;

  function isValidTheme(theme) {
    return Object.values(THEMES).includes(theme);
  }

  function setTheme(themeName) {
    if (!isValidTheme(themeName)) {
      console.error('Invalid theme name:', themeName);
      themeName = THEMES.DARK;
    }

    try {
      requestAnimationFrame(() => {
        themeStylesheet.setAttribute('href', `theme-${themeName}.css`);
        localStorage.setItem('theme', themeName);
        document.documentElement.setAttribute('data-theme', themeName);
      });
    } catch (error) {
      console.error('Failed to set theme:', error);
    }
  }

  function debouncedSetTheme(themeName) {
    clearTimeout(themeChangeTimeout);
    themeChangeTimeout = setTimeout(() => setTheme(themeName), 100);
  }

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && isValidTheme(savedTheme)) {
      return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: light)').matches
      ? THEMES.LIGHT
      : THEMES.DARK;
  }

  function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || getPreferredTheme();
    const newTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    debouncedSetTheme(newTheme);
  }

  // Initialize theme
  setTheme(getPreferredTheme());

  // Mouse/touch events
  themeSwitcher.addEventListener('click', toggleTheme);

  // Keyboard events
  addKeyboardActivation(themeSwitcher, toggleTheme);

  // System theme changes
  window
    .matchMedia('(prefers-color-scheme: light)')
    .addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? THEMES.LIGHT : THEMES.DARK);
      }
    });

  // Burger Menu Toggle
  const burgerMenu = document.getElementById('burger-menu');
  const navButtons = document.querySelector('.nav-buttons');

  if (burgerMenu && navButtons) {
    function toggleMenu() {
      const isOpen = burgerMenu.getAttribute('aria-expanded') === 'true';
      burgerMenu.setAttribute('aria-expanded', !isOpen);
      navButtons.classList.toggle('open');

      // Announce to screen readers
      const announcement = !isOpen ? 'Меню открыто' : 'Меню закрыто';
      const ariaLive = document.createElement('div');
      ariaLive.setAttribute('aria-live', 'polite');
      ariaLive.setAttribute('aria-atomic', 'true');
      ariaLive.className = 'sr-only';
      ariaLive.textContent = announcement;
      document.body.appendChild(ariaLive);
      setTimeout(() => document.body.removeChild(ariaLive), 1000);
    }

    // Toggle menu on burger button click
    burgerMenu.addEventListener('click', toggleMenu);

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      const isOpen = burgerMenu.getAttribute('aria-expanded') === 'true';
      if (
        isOpen &&
        !navButtons.contains(e.target) &&
        !burgerMenu.contains(e.target)
      ) {
        toggleMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const isOpen = burgerMenu.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
          toggleMenu();
          burgerMenu.focus();
        }
      }
    });

    // Close menu when clicking on nav buttons
    navButtons.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-button')) {
        const isOpen = burgerMenu.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
          toggleMenu();
        }
      }
    });

    // Close menu on window resize if switching to desktop view
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        const isOpen = burgerMenu.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
          burgerMenu.setAttribute('aria-expanded', 'false');
          navButtons.classList.remove('open');
        }
      }
    });
  }
});

document.querySelectorAll('.phase-column h5').forEach((el) => {
  const words = el.textContent.trim().split(' ');
  if (words.length > 1) {
    el.innerHTML = `${words[0]}<br>${words.slice(1).join(' ')}`;
  }
});

// Add to your existing script.js file
document.addEventListener('DOMContentLoaded', () => {
  // Back button functionality
  const backButton = document.querySelector('.back-button');

  if (backButton) {
    backButton.addEventListener('click', () => {
      // Check if there's a previous page in history
      if (window.history.length > 1) {
        window.history.back();
      } else {
        // Fallback to home page
        window.location.href = '/';
      }
    });
  }

  // External link handling
  const externalLinks = document.querySelectorAll('a[target="_blank"]');
  externalLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      // Add analytics tracking here if needed
    });
  });
});

// Add to your existing script.js file
document.addEventListener('DOMContentLoaded', () => {
  // Testimonial animation on scroll
  const testimonialSection = document.querySelector('.client-testimonial');

  if (testimonialSection) {
    const testimonialObserver = createAnimationObserver(0.2);
    testimonialObserver.observe(testimonialSection);
  }

  // Handle image loading errors
  const authorAvatar = document.querySelector('.author-avatar img');
  if (authorAvatar) {
    authorAvatar.addEventListener('error', function () {
      // Create a fallback avatar with initials
      const authorName =
        document.querySelector('.author-name')?.textContent || 'Client';
      const initials = authorName
        .split(' ')
        .map((name) => name[0])
        .join('')
        .toUpperCase();

      const fallbackDiv = document.createElement('div');
      fallbackDiv.className = 'avatar-fallback';
      fallbackDiv.textContent = initials;
      fallbackDiv.style.cssText = `
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        font-size: calc(var(--space-23xl) * 0.4);
      `;

      this.parentNode.replaceChild(fallbackDiv, this);
    });
  }

  // Add keyboard navigation for testimonial
  const testimonialQuote = document.querySelector('.testimonial-quote');
  if (testimonialQuote) {
    testimonialQuote.setAttribute('tabindex', '0');
    testimonialQuote.setAttribute('role', 'blockquote');
    testimonialQuote.setAttribute('aria-label', 'Client testimonial');
  }
});

// Add to your existing script.js file
document.addEventListener('DOMContentLoaded', () => {
  // Project navigation functionality
  const projectNavigation = document.querySelector('.project-navigation');
  const prevProject = document.querySelector('.project-nav-prev');
  const nextProject = document.querySelector('.project-nav-next');

  if (projectNavigation) {
    // Animation on scroll
    const navObserver = createAnimationObserver(0.3);
    navObserver.observe(projectNavigation);
  }

  // Navigation click handlers
  if (prevProject) {
    prevProject.addEventListener('click', () => {
      // Add your navigation logic here
      // Example: window.location.href = '/projects/previous-project';
    });

    // Keyboard navigation
    addKeyboardActivation(prevProject, () => prevProject.click());

    // Add ARIA attributes
    prevProject.setAttribute('role', 'button');
    prevProject.setAttribute('tabindex', '0');
    prevProject.setAttribute('aria-label', 'Перейти к предыдущему проекту');
  }

  if (nextProject) {
    nextProject.addEventListener('click', () => {
      // Add your navigation logic here
      // Example: window.location.href = '/projects/next-project';
    });

    // Keyboard navigation
    addKeyboardActivation(nextProject, () => nextProject.click());

    // Add ARIA attributes
    nextProject.setAttribute('role', 'button');
    nextProject.setAttribute('tabindex', '0');
    nextProject.setAttribute('aria-label', 'Перейти к следующему проекту');
  }

  // Swipe gesture support for mobile
  let startX = 0;
  let startY = 0;

  if (projectNavigation) {
    projectNavigation.addEventListener(
      'touchstart',
      (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      },
      { passive: true }
    );

    projectNavigation.addEventListener(
      'touchend',
      (e) => {
        if (!startX || !startY) return;

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;

        const diffX = startX - endX;
        const diffY = startY - endY;

        // Only trigger if horizontal swipe is more significant than vertical
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
          if (diffX > 0) {
            // Swipe left - next project
            nextProject?.click();
          } else {
            // Swipe right - previous project
            prevProject?.click();
          }
        }

        startX = 0;
        startY = 0;
      },
      { passive: true }
    );
  }

  // Keyboard shortcuts for navigation
  document.addEventListener('keydown', (e) => {
    // Only trigger if not in an input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'ArrowLeft' && e.ctrlKey) {
      e.preventDefault();
      prevProject?.click();
    } else if (e.key === 'ArrowRight' && e.ctrlKey) {
      e.preventDefault();
      nextProject?.click();
    }
  });
});

// Align phase-steps horizontally across all slider items
function alignPhaseSteps() {
  const columns = document.querySelectorAll('.phase-column');
  if (columns.length === 0) return;

  // Only apply alignment on desktop screens (above 768px)
  const isDesktop = window.innerWidth > 768;

  // First pass: always reset to auto
  columns.forEach((col) => {
    const description = col.querySelector('.phase-description');
    if (description) {
      description.style.height = 'auto';
      description.style.minHeight = 'auto';
    }
  });

  // Only calculate and apply heights on desktop
  if (!isDesktop) return;

  let maxDescriptionHeight = 0;

  // Second pass: find max height
  columns.forEach((col) => {
    const description = col.querySelector('.phase-description');
    if (description) {
      const height = description.offsetHeight;
      maxDescriptionHeight = Math.max(maxDescriptionHeight, height);
    }
  });

  // Third pass: apply max height to all
  columns.forEach((col) => {
    const description = col.querySelector('.phase-description');
    if (description) {
      description.style.minHeight = `${maxDescriptionHeight}px`;
    }
  });
}

// Initialize alignment
alignPhaseSteps();

// Recalculate on resize with debounce
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    alignPhaseSteps();
  }, 150);
});

// Recalculate after fonts load
if (document.fonts) {
  document.fonts.ready.then(alignPhaseSteps);
}
