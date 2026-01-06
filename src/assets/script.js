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
        themeStylesheet.setAttribute('href', `/assets/theme-${themeName}.css`);
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

    return window.matchMedia('(prefers-color-scheme: light)').matches ? THEMES.LIGHT : THEMES.DARK;
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
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
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
      const authorName = document.querySelector('.author-name')?.textContent || 'Client';
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
          svg.style.display = option.classList.contains('selected') ? 'block' : 'none';
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
        document.querySelectorAll('[data-option-group="services"] .form-option.selected')
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

// CTA Button with Checkpoint Constraints
document.addEventListener('DOMContentLoaded', () => {
  const fixedCta = document.querySelector('.cta-button');
  const topCheckpoint = document.querySelector('.cta-checkpoint');
  const bottomCheckpoint = document.querySelector('.cta-button_footer');

  if (!fixedCta || !topCheckpoint || !bottomCheckpoint) {
    console.log('Missing required elements for CTA scroll');
    return;
  }

  const BOTTOM_OFFSET = 50; // Distance from viewport bottom when floating

  let rafId = null;
  let isAtBottom = false;
  let isAbsoluteMode = false;
  let isInitialLoad = true;
  let cachedSmallButtonHeight = null;
  let cachedFullButtonHeight = null;

  function updateButtonPosition() {
    const scrollY = window.scrollY || window.pageYOffset;
    const viewportHeight = window.innerHeight;

    const topRect = topCheckpoint.getBoundingClientRect();
    const bottomRect = bottomCheckpoint.getBoundingClientRect();

    // Get checkpoint positions
    const bottomCheckpointInViewport = bottomRect.top;
    const topCheckpointAbsolute = topRect.top + scrollY;
    const bottomCheckpointAbsolute = bottomRect.top + scrollY;

    // Determine state first (before measuring button height)
    let isAtTopCheckpoint = false;
    let isAtBottomCheckpoint = false;

    // For initial calculation, temporarily add .at-footer to measure full size (only on first page load)
    const needsFullSizeForMeasurement = scrollY === 0 && !fixedCta.classList.contains('at-footer') && isInitialLoad;
    if (needsFullSizeForMeasurement) {
      // Disable transitions before adding class to prevent animation on initial load
      fixedCta.style.transition = 'none';
      const svg = fixedCta.querySelector('svg');
      if (svg) svg.style.transition = 'none';
      fixedCta.classList.add('at-footer');
      // Force reflow to ensure class is applied before measuring
      fixedCta.offsetHeight;
    }

    // Measure button height for checkpoint positioning
    // Cache full button height for accurate positioning at checkpoints
    if (cachedFullButtonHeight === null && needsFullSizeForMeasurement) {
      cachedFullButtonHeight = fixedCta.getBoundingClientRect().height;
    }

    const buttonRect = fixedCta.getBoundingClientRect();
    const buttonHeight = buttonRect.height;

    // For floating position, use cached small button height to prevent position shift
    // Only measure once on first run to avoid constant class manipulation
    let smallButtonHeight;
    if (cachedSmallButtonHeight === null) {
      // First time: measure small button height
      const hadAtFooter = fixedCta.classList.contains('at-footer');
      if (hadAtFooter) {
        fixedCta.style.transition = 'none';
        const svg = fixedCta.querySelector('svg');
        if (svg) svg.style.transition = 'none';

        fixedCta.classList.remove('at-footer');
        fixedCta.offsetHeight; // Force reflow
        cachedSmallButtonHeight = fixedCta.getBoundingClientRect().height;
        fixedCta.classList.add('at-footer');

        // Don't restore transitions yet - they'll be enabled when needed
      } else {
        cachedSmallButtonHeight = buttonHeight;
      }
    }
    smallButtonHeight = cachedSmallButtonHeight;

    // Where button wants to be when floating (fixed at bottom of viewport)
    const floatingPosition = viewportHeight - BOTTOM_OFFSET - smallButtonHeight;

    // Check if at top checkpoint (only when page is at the very top)
    if (scrollY === 0) {
      isAtTopCheckpoint = true;
    } else if (bottomCheckpointInViewport <= floatingPosition) {
      isAtBottomCheckpoint = true;
    }

    // Handle positioning
    if (isAtTopCheckpoint || isAtBottomCheckpoint) {
      // Disable position transitions on initial load and at bottom checkpoint
      if (isInitialLoad || isAtBottomCheckpoint) {
        fixedCta.classList.add('no-position-transition');
      } else {
        fixedCta.classList.remove('no-position-transition');
      }

      // Switch to absolute positioning
      if (!isAbsoluteMode) {
        fixedCta.style.position = 'absolute';
        fixedCta.style.setProperty('--button-top', 'auto');
        isAbsoluteMode = true;
      }

      // Set absolute position using top (use full-size height for proper positioning)
      const heightForPositioning = cachedFullButtonHeight || buttonHeight;
      if (isAtTopCheckpoint) {
        fixedCta.style.top = `${topCheckpointAbsolute - heightForPositioning}px`;
      } else {
        fixedCta.style.top = `${bottomCheckpointAbsolute}px`;
      }
    } else {
      // Enable position transitions when floating
      fixedCta.classList.remove('no-position-transition');

      // Float freely - use fixed positioning
      if (isAbsoluteMode) {
        fixedCta.style.position = 'fixed';
        fixedCta.style.top = '';
        isAbsoluteMode = false;
      }

      // Use floating position
      fixedCta.style.setProperty('--button-top', `${floatingPosition}px`);
    }

    // Handle size change: full size at both checkpoints, small when floating
    const shouldBeFullSize = isAtTopCheckpoint || isAtBottomCheckpoint;
    if (shouldBeFullSize && !isAtBottom) {
      isAtBottom = true;

      // If class was added during measurement, handle animation
      if (needsFullSizeForMeasurement) {
        if (isInitialLoad) {
          // Initial page load - no animation needed, just mark as loaded
          isInitialLoad = false;
        } else {
          // Scrolling back to top - animate the growth
          // Remove class first
          fixedCta.classList.remove('at-footer');
          // Enable transitions
          fixedCta.style.removeProperty('transition');
          const svg = fixedCta.querySelector('svg');
          if (svg) svg.style.removeProperty('transition');
          // Wait for next frame to ensure removal is processed, then add class back
          requestAnimationFrame(() => {
            fixedCta.classList.add('at-footer');
          });
        }
      } else {
        // Ensure transitions are enabled before growing
        fixedCta.style.removeProperty('transition');
        const svg = fixedCta.querySelector('svg');
        if (svg) svg.style.removeProperty('transition');
        // Force reflow to ensure transitions are active
        fixedCta.offsetHeight;
        // Add class with transitions enabled - should animate now
        fixedCta.classList.add('at-footer');
      }
    } else if (!shouldBeFullSize && isAtBottom) {
      isAtBottom = false;

      // Enable transitions before shrinking
      if (isInitialLoad || fixedCta.style.transition === 'none') {
        fixedCta.style.removeProperty('transition');
        const svg = fixedCta.querySelector('svg');
        if (svg) svg.style.removeProperty('transition');
        // Force reflow to ensure CSS transitions are applied
        fixedCta.offsetHeight;
        isInitialLoad = false;
      }

      // Now remove class with transitions active
      fixedCta.classList.remove('at-footer');
    }
  }

  function scheduleUpdate() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(updateButtonPosition);
  }

  function handleResize() {
    cachedSmallButtonHeight = null;
    cachedFullButtonHeight = null;
    scheduleUpdate();
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', handleResize, { passive: true });

  // Wait for layout to be fully calculated before initial positioning
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      updateButtonPosition(); // Initial position
    });
  });
});
