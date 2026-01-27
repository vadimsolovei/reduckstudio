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

// Header scroll behavior - fixed over hero, then scrolls away with content
// Skip on homepage where header should always be absolute and scroll naturally
function initHeaderScroll() {
  if (document.body.classList.contains('homepage')) return;

  const header = document.querySelector('header');
  const hero = document.querySelector('.hero');

  if (!header || !hero) return;

  let frozenTop = null;

  const getOffset = () => {
    const isMobile = window.innerWidth <= 768;
    return isMobile ? 24 : window.innerWidth * (24 / 1440);
  };

  const checkScroll = () => {
    const heroBottom = hero.getBoundingClientRect().bottom;
    const headerHeight = header.offsetHeight;
    const offset = getOffset();

    if (heroBottom <= headerHeight + offset) {
      if (!header.classList.contains('header-scrolled')) {
        // Calculate the exact scroll position where header should freeze
        // This is where hero bottom reaches headerHeight + offset from viewport top
        frozenTop = hero.offsetTop + hero.offsetHeight - headerHeight - offset;
        header.style.position = 'absolute';
        header.style.top = frozenTop + 'px';
        header.classList.add('header-scrolled');
      }
    } else {
      if (header.classList.contains('header-scrolled')) {
        header.style.position = '';
        header.style.top = '';
        header.classList.remove('header-scrolled');
        frozenTop = null;
      }
    }
  };

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();
}

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
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

  // Set initial theme data attribute for CSS-based icon switching
  const initialTheme = getPreferredTheme();
  document.documentElement.setAttribute('data-theme', initialTheme);
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

  // First pass: always reset to auto
  columns.forEach((col) => {
    const description = col.querySelector('.phase-description');
    if (description) {
      description.style.height = 'auto';
      description.style.minHeight = 'auto';
    }
  });

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
  const topCheckpoint = document.querySelector('.cta-checkpoint_top');
  const bottomCheckpoint = document.querySelector('.cta-checkpoint_bottom');

  if (!fixedCta || !topCheckpoint || !bottomCheckpoint) {
    console.log('Missing required elements for CTA scroll');
    return;
  }

  // Distance from viewport bottom when floating (3.47vw, same as left offset)
  const getBottomOffset = () => window.innerWidth * 0.0347;

  let rafId = null;
  let isFloating = false;
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

    // Cache both button sizes on first run (regardless of scroll position)
    if (cachedFullButtonHeight === null || cachedSmallButtonHeight === null) {
      const hadFloating = fixedCta.classList.contains('floating');

      // Disable transitions before measuring
      fixedCta.style.transition = 'none';
      const svg = fixedCta.querySelector('svg');
      if (svg) svg.style.transition = 'none';

      // Measure full size (without .floating)
      if (hadFloating) {
        fixedCta.classList.remove('floating');
        fixedCta.offsetHeight; // Force reflow
      }
      cachedFullButtonHeight = fixedCta.getBoundingClientRect().height;

      // Measure small size (with .floating)
      fixedCta.classList.add('floating');
      fixedCta.offsetHeight; // Force reflow
      cachedSmallButtonHeight = fixedCta.getBoundingClientRect().height;

      // Restore original state
      if (!hadFloating) {
        fixedCta.classList.remove('floating');
      }
    }

    const smallButtonHeight = cachedSmallButtonHeight;

    // Where button wants to be when floating (fixed at bottom of viewport)
    const floatingPosition = viewportHeight - getBottomOffset() - smallButtonHeight;

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
      const isMobile = window.innerWidth <= 768;
      if (isAtTopCheckpoint) {
        // On mobile: position below checkpoint + 32px gap, on desktop: position above
        fixedCta.style.top = isMobile
          ? `${topCheckpointAbsolute + 32}px`
          : `${topCheckpointAbsolute - heightForPositioning}px`;
      } else {
        fixedCta.style.top = `${bottomCheckpointAbsolute}px`;
      }
    } else {
      // Enable position transitions when floating
      fixedCta.classList.remove('no-position-transition');

      // Float freely - use fixed positioning
      if (isAbsoluteMode || fixedCta.style.position !== 'fixed') {
        fixedCta.style.position = 'fixed';
        fixedCta.style.top = '';
        isAbsoluteMode = false;
      }

      // Use floating position
      fixedCta.style.setProperty('--button-top', `${floatingPosition}px`);
    }

    // Handle size change: full size at checkpoints (no class), small when floating (.floating class)
    const shouldBeFloating = !isAtTopCheckpoint && !isAtBottomCheckpoint;
    if (shouldBeFloating && !isFloating) {
      isFloating = true;

      // Enable transitions before shrinking
      if (isInitialLoad || fixedCta.style.transition === 'none') {
        fixedCta.style.removeProperty('transition');
        const svg = fixedCta.querySelector('svg');
        if (svg) svg.style.removeProperty('transition');
        // Force reflow to ensure CSS transitions are applied
        fixedCta.offsetHeight;
        isInitialLoad = false;
      }

      // Add floating class to shrink
      fixedCta.classList.add('floating');
    } else if (!shouldBeFloating && isFloating) {
      isFloating = false;

      // Ensure transitions are enabled before growing
      fixedCta.style.removeProperty('transition');
      const svg = fixedCta.querySelector('svg');
      if (svg) svg.style.removeProperty('transition');
      // Force reflow to ensure transitions are active
      fixedCta.offsetHeight;
      // Remove floating class to grow back to full size
      fixedCta.classList.remove('floating');
    } else if (!shouldBeFloating && !isFloating && isInitialLoad) {
      // Initial load at checkpoint - mark as loaded
      isInitialLoad = false;
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

// Logo Animation
function initLogoAnimation() {
  const logo = document.querySelector('.logo');
  const duckContainer = document.querySelector('.logo-duck');
  const duckImg = document.querySelector('.logo-duck img');
  const textElements = document.querySelectorAll('.logo-text');

  if (!logo || !duckImg || textElements.length === 0) return;

  const GIFS = {
    idle: '/assets/images/logo-gifs/idle.png',
    look: '/assets/images/logo-gifs/look.gif',
    walkLeft: '/assets/images/logo-gifs/walk-left.gif',
    walkRight: '/assets/images/logo-gifs/walk-right.gif',
    turnLeft: '/assets/images/logo-gifs/turn-left.gif',
    turnRight: '/assets/images/logo-gifs/turn-right.gif',
    quack: '/assets/images/logo-gifs/quack.gif',
  };

  const TIMING = {
    look: 800,
    turn: 500,
    quackDuration: 600, // how long quack.gif plays before switching to idle
    quackInterval: 2 * 60 * 1000, // 2 minutes between quacks
    lookInterval: 1 * 60 * 1000, // 1 minute between looks
  };

  function getWalkDuration() {
    return window.innerWidth <= 768 ? 2000 : 3000;
  }

  // Preload GIFs
  Object.values(GIFS).forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  let state = 'idle';
  let lastScrollY = 0;
  let animationTimeout = null;

  // Force GIF restart by appending timestamp
  function setGif(src) {
    duckImg.src = src + '?t=' + Date.now();
  }

  // Play quack once then return to idle
  function playQuack(callback) {
    if (state !== 'quacking') return;
    setGif(GIFS.quack);
    animationTimeout = setTimeout(() => {
      if (state !== 'quacking') return;
      duckImg.src = GIFS.idle;
      if (callback) callback();
    }, TIMING.quackDuration);
  }

  // Play look once then return to idle
  function playLook(callback) {
    if (state !== 'quacking') return;
    setGif(GIFS.look);
    animationTimeout = setTimeout(() => {
      if (state !== 'quacking') return;
      duckImg.src = GIFS.idle;
      if (callback) callback();
    }, TIMING.look);
  }

  // Sequential cycle: quack → 2min → quack → 1min → look → repeat
  function runAnimationCycle() {
    if (state !== 'quacking') return;

    // Step 1: quack
    playQuack(() => {
      // Step 2: wait 2 min, then quack again
      animationTimeout = setTimeout(() => {
        playQuack(() => {
          // Step 3: wait 1 min, then look
          animationTimeout = setTimeout(() => {
            playLook(() => {
              // Step 4: restart cycle
              runAnimationCycle();
            });
          }, TIMING.lookInterval);
        });
      }, TIMING.quackInterval);
    });
  }

  function startQuacking() {
    runAnimationCycle();
  }

  function stopQuacking() {
    if (animationTimeout) {
      clearTimeout(animationTimeout);
      animationTimeout = null;
    }
  }

  function transitionToQuacking() {
    if (state !== 'idle') return;
    state = 'transitioning';

    // 1. Fade out text
    textElements.forEach((el) => el.classList.add('hidden'));

    // 2. Turn left (after text fade)
    setTimeout(() => {
      setGif(GIFS.turnLeft);

      // 3. Walk left (after turn)
      setTimeout(() => {
        setGif(GIFS.walkLeft);
        duckContainer.classList.add('walking-left');

        // 4. Turn right (after walk)
        setTimeout(() => {
          setGif(GIFS.turnRight);

          // 5. Set idle briefly to prevent turn-right loop glitch
          setTimeout(() => {
            duckImg.src = GIFS.idle;
            state = 'quacking';
            startQuacking();
          }, TIMING.turn);
        }, getWalkDuration());
      }, TIMING.turn);
    }, 200);
  }

  function transitionToIdle() {
    if (state !== 'quacking') return;
    state = 'transitioning';
    stopQuacking();

    // 1. Walk right back to origin
    setGif(GIFS.walkRight);
    duckContainer.classList.remove('walking-left');

    // 2. Return to idle, show text
    setTimeout(() => {
      duckImg.src = GIFS.idle;
      textElements.forEach((el) => el.classList.remove('hidden'));
      state = 'idle';
    }, getWalkDuration());
  }

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Simplified behavior for reduced motion: instant state changes
    window.addEventListener(
      'scroll',
      () => {
        const scrollY = window.scrollY;
        if (scrollY > 0 && state === 'idle') {
          textElements.forEach((el) => el.classList.add('hidden'));
          duckContainer.classList.add('walking-left');
          setGif(GIFS.quack);
          state = 'quacking';
        } else if (scrollY === 0 && state === 'quacking') {
          stopQuacking();
          textElements.forEach((el) => el.classList.remove('hidden'));
          duckContainer.classList.remove('walking-left');
          duckImg.src = GIFS.idle;
          state = 'idle';
        }
      },
      { passive: true }
    );
  } else {
    window.addEventListener(
      'scroll',
      () => {
        const scrollY = window.scrollY;
        if (scrollY > 0 && lastScrollY === 0) {
          transitionToQuacking();
        } else if (scrollY === 0 && lastScrollY > 0) {
          transitionToIdle();
        }
        lastScrollY = scrollY;
      },
      { passive: true }
    );
  }
}

document.addEventListener('DOMContentLoaded', initLogoAnimation);
