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

  // Get theme URLs from WordPress localized data
  function getThemeUrl(themeName) {
    if (typeof reduckTheme !== 'undefined') {
      return themeName === THEMES.DARK ? reduckTheme.darkCss : reduckTheme.lightCss;
    }
    // Fallback for non-WordPress environments
    return `/assets/theme-${themeName}.css`;
  }

  function setTheme(themeName) {
    if (!isValidTheme(themeName)) {
      console.error('Invalid theme name:', themeName);
      themeName = THEMES.DARK;
    }

    try {
      requestAnimationFrame(() => {
        themeStylesheet.setAttribute('href', getThemeUrl(themeName));
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

// Back button functionality
document.addEventListener('DOMContentLoaded', () => {
  const backButton = document.querySelector('.back-button');

  if (backButton) {
    backButton.addEventListener('click', () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = '/';
      }
    });
  }
});

// Testimonial animation on scroll
document.addEventListener('DOMContentLoaded', () => {
  const testimonialSection = document.querySelector('.client-testimonial');

  if (testimonialSection) {
    const testimonialObserver = createAnimationObserver(0.2);
    testimonialObserver.observe(testimonialSection);
  }

  // Handle image loading errors
  const authorAvatar = document.querySelector('.author-avatar img');
  if (authorAvatar) {
    authorAvatar.addEventListener('error', function () {
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

// Project navigation functionality
document.addEventListener('DOMContentLoaded', () => {
  const projectNavigation = document.querySelector('.project-navigation');
  const prevProject = document.querySelector('.project-nav-prev');
  const nextProject = document.querySelector('.project-nav-next');

  if (projectNavigation) {
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

        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
          if (diffX > 0) {
            nextProject?.click();
          } else {
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

  columns.forEach((col) => {
    const description = col.querySelector('.phase-description');
    if (description) {
      description.style.height = 'auto';
      description.style.minHeight = 'auto';
    }
  });

  let maxDescriptionHeight = 0;

  columns.forEach((col) => {
    const description = col.querySelector('.phase-description');
    if (description) {
      const height = description.offsetHeight;
      maxDescriptionHeight = Math.max(maxDescriptionHeight, height);
    }
  });

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

  function openContactForm() {
    formModal.classList.add('open');
    formOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    const firstInput = formModal.querySelector('input[type="email"]');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 300);
    }
  }

  function closeContactForm() {
    formModal.classList.remove('open');
    formOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  ctaButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      openContactForm();
    });
  });

  if (closeFormBtn) {
    closeFormBtn.addEventListener('click', closeContactForm);
  }

  formOverlay.addEventListener('click', closeContactForm);

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

      if (groupName === 'services') {
        option.classList.toggle('selected');
        const svg = option.querySelector('svg');
        if (svg) {
          svg.style.display = option.classList.contains('selected') ? 'block' : 'none';
        }
      } else if (groupName === 'budget') {
        optionGroup.querySelectorAll('.form-option').forEach((btn) => {
          btn.classList.remove('selected');
        });
        option.classList.add('selected');
      }
    });
  });

  // Form submission with AJAX
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      const selectedServices = Array.from(
        document.querySelectorAll('[data-option-group="services"] .form-option.selected')
      ).map((opt) => opt.getAttribute('data-value'));

      const selectedBudget = document
        .querySelector('[data-option-group="budget"] .form-option.selected')
        ?.getAttribute('data-value');

      // Check if WordPress AJAX is available
      if (typeof reduckTheme !== 'undefined' && reduckTheme.ajaxUrl) {
        const ajaxData = new FormData();
        ajaxData.append('action', 'reduck_contact');
        ajaxData.append('nonce', reduckTheme.nonce);
        ajaxData.append('email', data.email);
        ajaxData.append('name', data.name);
        ajaxData.append('message', data.message || '');
        selectedServices.forEach((service) => ajaxData.append('services[]', service));
        ajaxData.append('budget', selectedBudget || '');

        fetch(reduckTheme.ajaxUrl, {
          method: 'POST',
          body: ajaxData,
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.success) {
              alert(result.data.message || reduckTheme.i18n?.formSuccess || 'Thank you! Your message has been sent.');
              closeContactForm();
              contactForm.reset();
              formOptions.forEach((opt) => {
                opt.classList.remove('selected');
                const svg = opt.querySelector('svg');
                if (svg) svg.style.display = 'none';
              });
            } else {
              alert(result.data.message || reduckTheme.i18n?.formError || 'Failed to send message. Please try again.');
            }
          })
          .catch((error) => {
            console.error('Form submission error:', error);
            alert(reduckTheme.i18n?.formErrorGeneric || 'An error occurred. Please try again.');
          });
      } else {
        // Fallback for non-WordPress environments
        console.log('Form submitted:', { ...data, services: selectedServices, budget: selectedBudget });
        alert(reduckTheme?.i18n?.formSuccess || 'Thank you! Your message has been sent.');
        closeContactForm();
        contactForm.reset();
        formOptions.forEach((opt) => {
          opt.classList.remove('selected');
          const svg = opt.querySelector('svg');
          if (svg) svg.style.display = 'none';
        });
      }
    });
  }
});

// CTA Button with Checkpoint Constraints
document.addEventListener('DOMContentLoaded', () => {
  const fixedCta = document.querySelector('.cta-button');
  const topCheckpoint = document.querySelector('.cta-checkpoint_top');
  const bottomCheckpointDesktop = document.querySelector('.cta-checkpoint_bottom');
  const bottomCheckpointMobile = document.querySelector('.cta-checkpoint_bottom-mobile');

  const getBottomCheckpoint = () =>
    window.innerWidth <= 768 && bottomCheckpointMobile
      ? bottomCheckpointMobile
      : bottomCheckpointDesktop;

  if (!fixedCta || !topCheckpoint || !bottomCheckpointDesktop) {
    return;
  }

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
    const bottomCheckpoint = getBottomCheckpoint();
    const bottomRect = bottomCheckpoint.getBoundingClientRect();

    const bottomCheckpointInViewport = bottomRect.top;
    const topCheckpointAbsolute = topRect.top + scrollY;
    const bottomCheckpointAbsolute = bottomRect.top + scrollY;

    let isAtTopCheckpoint = false;
    let isAtBottomCheckpoint = false;

    if (cachedFullButtonHeight === null || cachedSmallButtonHeight === null) {
      const hadFloating = fixedCta.classList.contains('floating');

      fixedCta.style.transition = 'none';
      const svg = fixedCta.querySelector('svg');
      if (svg) svg.style.transition = 'none';

      if (hadFloating) {
        fixedCta.classList.remove('floating');
        fixedCta.offsetHeight;
      }
      cachedFullButtonHeight = fixedCta.getBoundingClientRect().height;

      fixedCta.classList.add('floating');
      fixedCta.offsetHeight;
      cachedSmallButtonHeight = fixedCta.getBoundingClientRect().height;

      if (!hadFloating) {
        fixedCta.classList.remove('floating');
      }
    }

    const smallButtonHeight = cachedSmallButtonHeight;
    const floatingPosition = viewportHeight - getBottomOffset() - smallButtonHeight;

    if (scrollY === 0) {
      isAtTopCheckpoint = true;
    } else if (bottomCheckpointInViewport <= floatingPosition) {
      isAtBottomCheckpoint = true;
    }

    if (isAtTopCheckpoint || isAtBottomCheckpoint) {
      if (isInitialLoad || isAtBottomCheckpoint) {
        fixedCta.classList.add('no-position-transition');
      } else {
        fixedCta.classList.remove('no-position-transition');
      }

      if (!isAbsoluteMode) {
        fixedCta.style.position = 'absolute';
        fixedCta.style.setProperty('--button-top', 'auto');
        isAbsoluteMode = true;
      }

      const heightForPositioning = cachedFullButtonHeight;
      const isMobile = window.innerWidth <= 768;
      if (isAtTopCheckpoint) {
        fixedCta.style.top = isMobile
          ? `${topCheckpointAbsolute + 32}px`
          : `${topCheckpointAbsolute - heightForPositioning}px`;
      } else {
        fixedCta.style.top = `${bottomCheckpointAbsolute}px`;
      }
    } else {
      fixedCta.classList.remove('no-position-transition');

      if (isAbsoluteMode || fixedCta.style.position !== 'fixed') {
        fixedCta.style.position = 'fixed';
        fixedCta.style.top = '';
        isAbsoluteMode = false;
      }

      fixedCta.style.setProperty('--button-top', `${floatingPosition}px`);
    }

    const shouldBeFloating = !isAtTopCheckpoint && !isAtBottomCheckpoint;
    if (shouldBeFloating && !isFloating) {
      isFloating = true;

      if (isInitialLoad || fixedCta.style.transition === 'none') {
        fixedCta.style.removeProperty('transition');
        const svg = fixedCta.querySelector('svg');
        if (svg) svg.style.removeProperty('transition');
        fixedCta.offsetHeight;
        isInitialLoad = false;
      }

      fixedCta.classList.add('floating');
    } else if (!shouldBeFloating && isFloating) {
      isFloating = false;

      fixedCta.style.removeProperty('transition');
      const svg = fixedCta.querySelector('svg');
      if (svg) svg.style.removeProperty('transition');
      fixedCta.offsetHeight;
      fixedCta.classList.remove('floating');
    } else if (!shouldBeFloating && !isFloating && isInitialLoad) {
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

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      updateButtonPosition();
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

  // Get base path from WordPress or use default
  const basePath = typeof reduckTheme !== 'undefined'
    ? reduckTheme.themeUri + '/assets/images/logo-gifs/'
    : '/assets/images/logo-gifs/';

  const GIFS = {
    idle: basePath + 'idle.png',
    look: basePath + 'look.gif',
    walkLeft: basePath + 'walk-left.gif',
    walkRight: basePath + 'walk-right.gif',
    turnLeft: basePath + 'turn-left.gif',
    turnRight: basePath + 'turn-right.gif',
    quack: basePath + 'quack.gif',
  };

  const TIMING = {
    look: 800,
    turn: 500,
    quackDuration: 600,
    quackInterval: 2 * 60 * 1000,
    lookInterval: 1 * 60 * 1000,
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

  function setGif(src) {
    duckImg.src = src + '?t=' + Date.now();
  }

  function playQuack(callback) {
    if (state !== 'quacking') return;
    setGif(GIFS.quack);
    animationTimeout = setTimeout(() => {
      if (state !== 'quacking') return;
      duckImg.src = GIFS.idle;
      if (callback) callback();
    }, TIMING.quackDuration);
  }

  function playLook(callback) {
    if (state !== 'quacking') return;
    setGif(GIFS.look);
    animationTimeout = setTimeout(() => {
      if (state !== 'quacking') return;
      duckImg.src = GIFS.idle;
      if (callback) callback();
    }, TIMING.look);
  }

  function runAnimationCycle() {
    if (state !== 'quacking') return;

    playQuack(() => {
      animationTimeout = setTimeout(() => {
        playQuack(() => {
          animationTimeout = setTimeout(() => {
            playLook(() => {
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

    textElements.forEach((el) => el.classList.add('hidden'));

    setTimeout(() => {
      setGif(GIFS.turnLeft);

      setTimeout(() => {
        setGif(GIFS.walkLeft);
        duckContainer.classList.add('walking-left');

        setTimeout(() => {
          setGif(GIFS.turnRight);

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

    setGif(GIFS.walkRight);
    duckContainer.classList.remove('walking-left');

    setTimeout(() => {
      duckImg.src = GIFS.idle;
      textElements.forEach((el) => el.classList.remove('hidden'));
      state = 'idle';
    }, getWalkDuration());
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
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
