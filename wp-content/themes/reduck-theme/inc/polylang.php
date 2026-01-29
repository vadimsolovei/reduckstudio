<?php
/**
 * Polylang integration
 *
 * @package Reduck_Theme
 */

defined('ABSPATH') || exit;

/**
 * Register theme strings for Polylang translation
 * These appear in Languages > String translations
 */
add_action('init', function () {
    if (!function_exists('pll_register_string')) {
        return;
    }

    // Form messages (used in JavaScript)
    pll_register_string('form_success', 'Thank you! Your message has been sent.', 'Reduck Theme');
    pll_register_string('form_error', 'Failed to send message. Please try again.', 'Reduck Theme');
    pll_register_string('form_error_generic', 'An error occurred. Please try again.', 'Reduck Theme');

    // Email strings
    pll_register_string('email_subject', '[Reduck Studio] New inquiry from %s', 'Reduck Theme');
    pll_register_string('email_new_submission', 'New contact form submission:', 'Reduck Theme');
    pll_register_string('email_name', 'Name:', 'Reduck Theme');
    pll_register_string('email_email', 'Email:', 'Reduck Theme');
    pll_register_string('email_services', 'Services:', 'Reduck Theme');
    pll_register_string('email_budget', 'Budget:', 'Reduck Theme');
    pll_register_string('email_message', 'Message:', 'Reduck Theme');

    // Default form options (fallbacks)
    pll_register_string('service_product_design', 'Product design', 'Reduck Theme');
    pll_register_string('service_website', 'Website', 'Reduck Theme');
    pll_register_string('service_development', 'Development', 'Reduck Theme');
    pll_register_string('service_branding', 'Branding', 'Reduck Theme');
    pll_register_string('service_marketing', 'Marketing', 'Reduck Theme');
});

/**
 * Helper: Get translated string (with Polylang support)
 */
function reduck_pll__($string) {
    if (function_exists('pll__')) {
        return pll__($string);
    }
    return $string;
}

/**
 * Helper: Echo translated string (with Polylang support)
 */
function reduck_pll_e($string) {
    echo reduck_pll__($string);
}
