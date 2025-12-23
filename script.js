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

// Contact Form Modal
document.addEventListener('DOMContentLoaded', () => {
  const formModal = document.getElementById('contactFormModal');
  const formOverlay = document.getElementById('contactFormOverlay');
  const closeFormBtn = document.getElementById('closeFormBtn');
  const contactForm = document.getElementById('contactForm');
  const ctaButtons = document.querySelectorAll('.cta-button');

  if (!formModal || !formOverlay) return;

  // Open form function
  function openContactForm() {
    formModal.classList.add('open');
    formOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus first input for accessibility
    const firstInput = formModal.querySelector('input[type="email"]');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 300);
    }
  }

  // Close form function
  function closeContactForm() {
    formModal.classList.remove('open');
    formOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Attach click handlers to all CTA buttons
  ctaButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      openContactForm();
    });
  });

  // Close button
  if (closeFormBtn) {
    closeFormBtn.addEventListener('click', closeContactForm);
  }

  // Close on overlay click
  formOverlay.addEventListener('click', closeContactForm);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && formModal.classList.contains('open')) {
      closeContactForm();
    }
  });

  // Form option selection (toggle buttons)
  const formOptions = document.querySelectorAll('.form-option');
  formOptions.forEach((option) => {
    option.addEventListener('click', () => {
      const optionGroup = option.closest('[data-option-group]');
      const groupName = optionGroup?.getAttribute('data-option-group');

      // For services group, allow multiple selections with checkmarks
      if (groupName === 'services') {
        option.classList.toggle('selected');
        const svg = option.querySelector('svg');
        if (svg) {
          svg.style.display = option.classList.contains('selected')
            ? 'block'
            : 'none';
        }
      }
      // For budget group, allow only single selection without checkmarks
      else if (groupName === 'budget') {
        // Deselect all other options in the budget group
        optionGroup.querySelectorAll('.form-option').forEach((btn) => {
          btn.classList.remove('selected');
        });
        // Select the clicked option
        option.classList.add('selected');
      }
    });
  });

  // Form submission
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      // Collect selected services (multiple selections allowed)
      const selectedServices = Array.from(
        document.querySelectorAll(
          '[data-option-group="services"] .form-option.selected'
        )
      ).map((opt) => opt.getAttribute('data-value'));

      // Collect selected budget (single selection only)
      const selectedBudget = document
        .querySelector('[data-option-group="budget"] .form-option.selected')
        ?.getAttribute('data-value');

      data.services = selectedServices;
      data.budget = selectedBudget;

      console.log('Form submitted:', data);

      // Here you would typically send the data to a server
      // For now, just show a success message and close the form
      alert('Спасибо! Ваша заявка отправлена.');
      closeContactForm();
      contactForm.reset();

      // Reset selected options
      formOptions.forEach((opt) => {
        opt.classList.remove('selected');
        const svg = opt.querySelector('svg');
        if (svg) svg.style.display = 'none';
      });
    });
  }
});

// Simple Fixed CTA with Fade Transition (Product Page)
document.addEventListener('DOMContentLoaded', () => {
  const fixedCta = document.querySelector('.cta-button');
  const footerCta = document.querySelector(
    '.contact-cta_footer .cta-button_footer'
  );
  const heroContact = document.querySelector('.hero-contact');

  if (!fixedCta || !footerCta) {
    console.log('Missing buttons:', { fixedCta, footerCta });
    return;
  }

  console.log('Simple fade initialized');

  const FOOTER_THRESHOLD = 100; // Start moving to footer when within 300px
  const SCROLL_THRESHOLD = 100; // Add fixed class after scrolling 100px
  let isAnimating = false;
  let isAtFooter = false;

  function animateToFixed() {
    if (isAnimating) return;
    isAnimating = true;

    console.log('Animating to fixed position');

    // Get current position before changing to fixed
    const currentRect = fixedCta.getBoundingClientRect();
    const currentTop = currentRect.top;
    const currentLeft = currentRect.left;

    console.log('Current position:', { currentTop, currentLeft });

    // Temporarily disable only transform transition for instant positioning
    fixedCta.style.transition =
      'background-color 0.2s, padding 0.6s cubic-bezier(0.4, 0, 0.2, 1), font-size 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-in-out, line-height 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

    // Add fixed class (this will trigger padding/font-size transitions)
    fixedCta.classList.add('cta-button--fixed');

    // Add shifted class to hero-contact if it exists
    if (heroContact) {
      heroContact.classList.add('hero-contact--shifted');
    }

    // Force reflow to apply the fixed positioning
    fixedCta.offsetHeight;

    // Get target position after fixed
    const targetRect = fixedCta.getBoundingClientRect();
    const targetTop = targetRect.top;
    const targetLeft = targetRect.left;

    console.log('Target position:', { targetTop, targetLeft });

    // Calculate offset needed to keep button visually in same place
    const deltaX = currentLeft - targetLeft;
    const deltaY = currentTop - targetTop;

    console.log('Delta:', { deltaX, deltaY });

    // Apply initial transform to keep button in original position
    fixedCta.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

    // Force reflow
    fixedCta.offsetHeight;

    // Re-enable all transitions including transform
    fixedCta.style.transition =
      'background-color 0.2s, padding 0.6s cubic-bezier(0.4, 0, 0.2, 1), font-size 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-in-out, line-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

    // Animate to final position
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fixedCta.style.transform = 'translate(0, 0)';
        setTimeout(() => {
          isAnimating = false;
          console.log('Animation complete');
        }, 600);
      });
    });
  }

  function animateToNormal() {
    if (isAnimating) return;
    isAnimating = true;

    console.log('Animating to normal position');

    // Get current fixed position
    const currentRect = fixedCta.getBoundingClientRect();
    const currentTop = currentRect.top;
    const currentLeft = currentRect.left;

    // Disable only transform transition for instant positioning
    fixedCta.style.transition =
      'background-color 0.2s, padding 0.6s cubic-bezier(0.4, 0, 0.2, 1), font-size 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-in-out';

    // Remove fixed class (this will trigger padding/font-size transitions)
    fixedCta.classList.remove('cta-button--fixed');
    fixedCta.style.opacity = 1;
    fixedCta.classList.remove('fading');

    // Remove shifted class from hero-contact if it exists
    if (heroContact) {
      heroContact.classList.remove('hero-contact--shifted');
    }

    // Force reflow
    fixedCta.offsetHeight;

    // Get new normal position
    const targetRect = fixedCta.getBoundingClientRect();
    const targetTop = targetRect.top;
    const targetLeft = targetRect.left;

    // Calculate offset
    const deltaX = currentLeft - targetLeft;
    const deltaY = currentTop - targetTop;

    // Start from fixed position
    fixedCta.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

    // Force reflow
    fixedCta.offsetHeight;

    // Re-enable all transitions
    fixedCta.style.transition =
      'background-color 0.2s, padding 0.6s cubic-bezier(0.4, 0, 0.2, 1), font-size 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-in-out, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

    // Animate back to normal position
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fixedCta.style.transform = 'translate(0, 0)';
        setTimeout(() => {
          isAnimating = false;
          console.log('Return animation complete');
        }, 600);
      });
    });
  }

  function animateToFooter() {
    if (isAtFooter) return;
    isAtFooter = true;

    console.log('Animating to footer position');

    // Get current button position in viewport
    const currentRect = fixedCta.getBoundingClientRect();

    // Get footer button position
    const footerRect = footerCta.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;

    // Calculate offset to move to footer position
    const deltaX = footerRect.left - currentRect.left;
    const deltaY = footerRect.top - currentRect.top;

    console.log('Animating to footer with delta:', { deltaX, deltaY });

    // Add at-footer class to trigger size growth animation
    fixedCta.classList.add('at-footer');

    // Animate transform to footer position (this will be smooth due to CSS transitions)
    fixedCta.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

    // After animation completes, switch to absolute positioning
    setTimeout(() => {
      console.log('Animation complete, switching to absolute positioning');

      const absoluteTop = footerRect.top + scrollY;
      const absoluteLeft = footerRect.left;

      // Disable transitions temporarily
      const savedTransition = fixedCta.style.transition;
      fixedCta.style.transition = 'none';

      // Change to absolute positioning
      fixedCta.style.position = 'absolute';
      fixedCta.style.top = `${absoluteTop}px`;
      fixedCta.style.left = `${absoluteLeft}px`;
      fixedCta.style.bottom = 'auto';
      fixedCta.style.transform = 'none';

      // Force reflow
      fixedCta.offsetHeight;

      // Restore transitions
      fixedCta.style.transition = savedTransition;

      console.log('Button now locked at footer position');
    }, 600); // Match the transition duration
  }

  function animateFromFooter() {
    if (!isAtFooter) return;
    isAtFooter = false;

    console.log('Animating from footer position');

    // Get current absolute position
    const currentRect = fixedCta.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;

    // Change back to fixed positioning
    fixedCta.style.position = '';
    fixedCta.style.top = '';
    fixedCta.style.left = '';
    fixedCta.style.bottom = '';

    // Get new fixed position
    const newRect = fixedCta.getBoundingClientRect();

    // Calculate the offset to maintain visual position
    const deltaX = currentRect.left - newRect.left;
    const deltaY = currentRect.top - newRect.top;

    // Temporarily disable transitions
    const savedTransition = fixedCta.style.transition;
    fixedCta.style.transition = 'none';

    // Apply transform to stay in same visual position
    fixedCta.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

    // Force reflow
    fixedCta.offsetHeight;

    // Re-enable transitions
    fixedCta.style.transition = savedTransition;

    // Remove at-footer class to shrink back
    fixedCta.classList.remove('at-footer');

    // Animate back to fixed position
    requestAnimationFrame(() => {
      fixedCta.style.transform = 'translate(0, 0)';
    });
  }

  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;

    // Add/remove fixed class based on scroll position
    if (scrollY > SCROLL_THRESHOLD) {
      if (!fixedCta.classList.contains('cta-button--fixed')) {
        animateToFixed();
      }
    } else {
      if (fixedCta.classList.contains('cta-button--fixed')) {
        animateToNormal();
        return;
      }
      return;
    }

    // Only handle footer animation if button is fixed
    if (!fixedCta.classList.contains('cta-button--fixed')) return;

    const footerCtaRect = footerCta.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Calculate distance from footer button to bottom of viewport
    const distanceFromBottom = footerCtaRect.top - viewportHeight;

    // When footer button is approaching the viewport
    if (distanceFromBottom < FOOTER_THRESHOLD) {
      animateToFooter();
    } else {
      animateFromFooter();
    }
  }

  // Throttle scroll events
  let scrollTimeout;
  window.addEventListener(
    'scroll',
    () => {
      if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
      }
      scrollTimeout = window.requestAnimationFrame(handleScroll);
    },
    { passive: true }
  );

  // Initial check
  handleScroll();
});
