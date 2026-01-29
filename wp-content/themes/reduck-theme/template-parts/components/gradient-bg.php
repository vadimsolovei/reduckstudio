<?php if (is_front_page()) : ?>
<div class="gradient-bg" aria-hidden="true">
  <svg viewBox="0 0 100vw 100vw" xmlns="http://www.w3.org/2000/svg" class="noise-bg">
    <filter id="noiseFilterBg">
      <feTurbulence type="fractalNoise" baseFrequency="0.6" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noiseFilterBg)" />
  </svg>
  <svg xmlns="http://www.w3.org/2000/svg" class="svg-blur">
    <defs>
      <filter id="goo">
        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
        <feColorMatrix
          in="blur"
          mode="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
          result="goo"
        />
        <feBlend in="SourceGraphic" in2="goo" />
      </filter>
    </defs>
  </svg>
  <div class="gradients-container">
    <div class="g1"></div>
    <div class="g2"></div>
    <div class="g3"></div>
    <div class="g4"></div>
    <div class="g5"></div>
  </div>
</div>
<?php endif; ?>
