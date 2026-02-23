<?php
$contact_email = function_exists('carbon_get_theme_option') ? carbon_get_theme_option('contact_email') : '';
$form_services = function_exists('carbon_get_theme_option') ? carbon_get_theme_option('form_services') : [];
$form_budgets = function_exists('carbon_get_theme_option') ? carbon_get_theme_option('form_budgets') : [];

?>
<div class="contact-form-overlay" id="contactFormOverlay"></div>
<div class="contact-form-modal" id="contactFormModal">
  <div class="contact-form-content">
    <div class="contact-form-header">
      <h2 class="contact-form-title"><?php reduck_pll_e("Let's start"); ?> <em><?php reduck_pll_e('an awesome project!'); ?></em></h2>
      <button class="contact-form-close" id="closeFormBtn" aria-label="<?php esc_attr_e('Close form', 'reduck-theme'); ?>">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6 6L18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <form class="contact-form-body" id="contactForm">
      <div class="form-row">
        <div class="form-field">
          <input type="email" name="email" placeholder="<?php echo esc_attr(reduck_pll__('E-mail')); ?>" autocomplete="email" required />
        </div>
        <div class="form-field">
          <input type="text" name="name" placeholder="<?php echo esc_attr(reduck_pll__('Full name')); ?>" autocomplete="name" required />
        </div>
      </div>

      <div class="form-field">
        <textarea name="message" placeholder="<?php echo esc_attr(reduck_pll__('Tell us briefly about your task')); ?>"></textarea>
      </div>

      <div class="form-section">
        <div class="form-section-label"><?php reduck_pll_e('Requirements'); ?></div>
        <div class="form-options" data-option-group="services">
          <?php foreach ($form_services as $service) : ?>
          <button type="button" class="form-option" data-value="<?php echo esc_attr($service['label']); ?>">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: none">
              <path d="M20 6L9 17L4 12" stroke="var(--color-content-general-inverted-primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <?php echo esc_html(reduck_pll__($service['label'])); ?>
          </button>
          <?php endforeach; ?>
        </div>
      </div>

      <div class="form-section form-section--last">
        <div class="form-section-label"><?php reduck_pll_e('Budget'); ?></div>
        <div class="form-options" data-option-group="budget">
          <?php foreach ($form_budgets as $budget) : ?>
          <button type="button" class="form-option" data-value="<?php echo esc_attr($budget['label']); ?>">
            <?php echo esc_html(reduck_pll__($budget['label'])); ?>
          </button>
          <?php endforeach; ?>
        </div>
      </div>

      <button type="submit" class="form-submit">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_form_submit)">
            <path d="M20.24 12.24C21.3658 11.1142 21.9983 9.58722 21.9983 7.99504C21.9983 6.40285 21.3658 4.87588 20.24 3.75004C19.1142 2.62419 17.5872 1.9917 15.995 1.9917C14.4028 1.9917 12.8758 2.62419 11.75 3.75004L5 10.5V19H13.5L20.24 12.24Z" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 8L2 22" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17.5 15H9" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
          <defs>
            <clipPath id="clip0_form_submit">
              <rect width="24" height="24" fill="white"/>
            </clipPath>
          </defs>
        </svg>
        <?php reduck_pll_e('Send request'); ?>
      </button>

      <div class="form-footer">
        <p class="form-footer-text">
          <?php printf(
            esc_html(reduck_pll__('By clicking send you accept our %s')),
            '<a href="#">' . esc_html(reduck_pll__('privacy policy')) . '</a>'
          ); ?>
        </p>
        <p class="form-footer-email">
          <?php reduck_pll_e('Prefer email?'); ?> <a href="mailto:<?php echo esc_attr($contact_email); ?>"><?php echo esc_html($contact_email); ?></a>
        </p>
      </div>
    </form>
  </div>
</div>
