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

    // CTA button
    pll_register_string('cta_button', 'Submit a request', 'Reduck Theme');

    // Contact section
    pll_register_string('lets_chat_telegram', "Let's chat on Telegram", 'Reduck Theme');
    pll_register_string('call_us', 'Call us', 'Reduck Theme');
    pll_register_string('email_us', 'Email us', 'Reduck Theme');

    // Project page
    pll_register_string('works', 'works', 'Reduck Theme');
    pll_register_string('industry', 'Industry', 'Reduck Theme');
    pll_register_string('services', 'Services', 'Reduck Theme');
    pll_register_string('from_the_client', 'From the client:', 'Reduck Theme');
    pll_register_string('previous_work', 'Previous work', 'Reduck Theme');
    pll_register_string('next_work', 'Next work', 'Reduck Theme');

    // Project meta fallbacks
    pll_register_string('website', 'Website', 'Reduck Theme');
    pll_register_string('development', 'Development', 'Reduck Theme');

    // Footer
    pll_register_string('privacy_policy', 'Privacy Policy', 'Reduck Theme');
    pll_register_string('terms', 'Terms', 'Reduck Theme');

    // Header
    pll_register_string('theme_switcher_sr', 'Switch between light and dark theme', 'Reduck Theme');

    // Contact form modal
    pll_register_string('lets_start', "Let's start", 'Reduck Theme');
    pll_register_string('awesome_project', 'an awesome project!', 'Reduck Theme');
    pll_register_string('requirements', 'Requirements', 'Reduck Theme');
    pll_register_string('budget', 'Budget', 'Reduck Theme');
    pll_register_string('send_request', 'Send request', 'Reduck Theme');
    pll_register_string('privacy_accept', 'By clicking send you accept our %s', 'Reduck Theme');
    pll_register_string('privacy_policy_link', 'privacy policy', 'Reduck Theme');
    pll_register_string('prefer_email', 'Prefer email?', 'Reduck Theme');
    pll_register_string('placeholder_email', 'E-mail', 'Reduck Theme');
    pll_register_string('placeholder_name', 'Full name', 'Reduck Theme');
    pll_register_string('placeholder_message', 'Tell us briefly about your task', 'Reduck Theme');
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
