<?php
$contact_email = function_exists('carbon_get_theme_option') ? carbon_get_theme_option('contact_email') : 'hello@reduck.studio';
$form_services = function_exists('carbon_get_theme_option') ? carbon_get_theme_option('form_services') : [];
$form_budgets = function_exists('carbon_get_theme_option') ? carbon_get_theme_option('form_budgets') : [];

// Default services if not set
if (empty($form_services)) {
    $form_services = [
        ['value' => 'product-design', 'label' => 'Product design'],
        ['value' => 'website', 'label' => 'Website'],
        ['value' => 'development', 'label' => 'Development'],
        ['value' => 'branding', 'label' => 'Branding'],
        ['value' => 'marketing', 'label' => 'Marketing'],
    ];
}

// Default budgets if not set
if (empty($form_budgets)) {
    $form_budgets = [
        ['value' => '1-5k', 'label' => '$1–5k'],
        ['value' => '5-10k', 'label' => '$5–10k'],
        ['value' => '10-50k', 'label' => '$10–50k'],
        ['value' => '50k+', 'label' => '$50k+'],
    ];
}
?>
<div class="contact-form-overlay" id="contactFormOverlay"></div>
<div class="contact-form-modal" id="contactFormModal">
  <div class="contact-form-content">
    <div class="contact-form-header">
      <h2 class="contact-form-title"><?php esc_html_e("Let's start", 'reduck-theme'); ?> <em><?php esc_html_e('an awesome project!', 'reduck-theme'); ?></em></h2>
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
          <input type="email" name="email" placeholder="<?php esc_attr_e('E-mail', 'reduck-theme'); ?>" autocomplete="email" required />
        </div>
        <div class="form-field">
          <input type="text" name="name" placeholder="<?php esc_attr_e('Full name', 'reduck-theme'); ?>" autocomplete="name" required />
        </div>
      </div>

      <div class="form-field">
        <textarea name="message" placeholder="<?php esc_attr_e('Tell us briefly about your task', 'reduck-theme'); ?>"></textarea>
      </div>

      <div class="form-section">
        <div class="form-section-label"><?php esc_html_e('Requirements', 'reduck-theme'); ?></div>
        <div class="form-options" data-option-group="services">
          <?php foreach ($form_services as $service) : ?>
          <button type="button" class="form-option" data-value="<?php echo esc_attr($service['value']); ?>">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: none">
              <path d="M20 6L9 17L4 12" stroke="var(--color-content-general-inverted-primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <?php echo esc_html($service['label']); ?>
          </button>
          <?php endforeach; ?>
        </div>
      </div>

      <div class="form-section form-section--last">
        <div class="form-section-label"><?php esc_html_e('Budget', 'reduck-theme'); ?></div>
        <div class="form-options" data-option-group="budget">
          <?php foreach ($form_budgets as $budget) : ?>
          <button type="button" class="form-option" data-value="<?php echo esc_attr($budget['value']); ?>">
            <?php echo esc_html($budget['label']); ?>
          </button>
          <?php endforeach; ?>
        </div>
      </div>

      <button type="submit" class="form-submit">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_form_submit)">
            <path d="M20.24 12.24C21.3658 11.1142 21.9983 9.58722 21.9983 7.99504C21.9983 6.40285 21.3658 4.87588 20.24 3.75004C19.1142 2.62419 17.5872 1.9917 15.995 1.9917C14.4028 1.9917 12.8758 2.62419 11.75 3.75004L5 10.5V19H13.5L20.24 12.24Z" stroke="black" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 8L2 22" stroke="black" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17.5 15H9" stroke="black" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
          <defs>
            <clipPath id="clip0_form_submit">
              <rect width="24" height="24" fill="white"/>
            </clipPath>
          </defs>
        </svg>
        <?php esc_html_e('Send request', 'reduck-theme'); ?>
      </button>

      <div class="form-footer">
        <p class="form-footer-text">
          <?php printf(
            esc_html__('By clicking send you accept our %s', 'reduck-theme'),
            '<a href="#">' . esc_html__('privacy policy', 'reduck-theme') . '</a>'
          ); ?>
        </p>
        <p class="form-footer-email">
          <?php esc_html_e('Prefer email?', 'reduck-theme'); ?> <a href="mailto:<?php echo esc_attr($contact_email); ?>"><?php echo esc_html($contact_email); ?></a>
        </p>
      </div>
    </form>
  </div>
</div>
