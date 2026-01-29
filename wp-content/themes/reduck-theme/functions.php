<?php
/**
 * Reduck Theme functions and definitions
 *
 * @package Reduck_Theme
 */

defined('ABSPATH') || exit;

define('REDUCK_THEME_VERSION', '1.0.0');
define('REDUCK_THEME_DIR', get_template_directory());
define('REDUCK_THEME_URI', get_template_directory_uri());

// Define Carbon Fields constants before loading (fix for symlinked themes)
define('Carbon_Fields\DIR', REDUCK_THEME_DIR . '/vendor/htmlburger/carbon-fields');
define('Carbon_Fields\URL', REDUCK_THEME_URI . '/vendor/htmlburger/carbon-fields/');

// Load Composer autoloader for Carbon Fields
if (file_exists(REDUCK_THEME_DIR . '/vendor/autoload.php')) {
    require_once REDUCK_THEME_DIR . '/vendor/autoload.php';
}

// Boot Carbon Fields
add_action('after_setup_theme', function () {
    if (class_exists('\Carbon_Fields\Carbon_Fields')) {
        \Carbon_Fields\Carbon_Fields::boot();
    }
});

// Theme setup
add_action('after_setup_theme', function () {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', [
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ]);

    // Custom image sizes
    add_image_size('project-hero', 1920, 760, true);
    add_image_size('project-gallery', 1440, 800, true);
    add_image_size('project-card', 800, 600, true);
    add_image_size('project-thumb', 400, 300, true);
});

// Include theme files
require_once REDUCK_THEME_DIR . '/inc/enqueue.php';
require_once REDUCK_THEME_DIR . '/inc/cpt-projects.php';
require_once REDUCK_THEME_DIR . '/inc/carbon-fields.php';
require_once REDUCK_THEME_DIR . '/inc/polylang.php';

/**
 * Helper function: Insert <br> after first word (replicates Nunjucks breakAfterFirst filter)
 *
 * @param string $text The text to process
 * @return string Text with <br> after first word
 */
function reduck_break_after_first($text) {
    $words = explode(' ', trim($text), 2);
    if (count($words) > 1) {
        return $words[0] . '<br>' . $words[1];
    }
    return $text;
}

/**
 * Add custom body classes
 */
add_filter('body_class', function ($classes) {
    if (is_front_page()) {
        $classes[] = 'homepage';
    }

    if (is_singular('project')) {
        $classes[] = 'productpage';
    }

    return $classes;
});

/**
 * Flush rewrite rules on theme activation
 */
add_action('after_switch_theme', function () {
    flush_rewrite_rules();
});

/**
 * AJAX Contact Form Handler
 */
add_action('wp_ajax_reduck_contact', 'reduck_handle_contact_form');
add_action('wp_ajax_nopriv_reduck_contact', 'reduck_handle_contact_form');

function reduck_handle_contact_form() {
    // Verify nonce
    if (!wp_verify_nonce($_POST['nonce'] ?? '', 'reduck_contact_nonce')) {
        wp_send_json_error(['message' => 'Security check failed'], 403);
    }

    // Sanitize form data
    $email = sanitize_email($_POST['email'] ?? '');
    $name = sanitize_text_field($_POST['name'] ?? '');
    $message = sanitize_textarea_field($_POST['message'] ?? '');
    $services = array_map('sanitize_text_field', (array) ($_POST['services'] ?? []));
    $budget = sanitize_text_field($_POST['budget'] ?? '');

    // Validate required fields
    if (empty($email) || !is_email($email)) {
        wp_send_json_error(['message' => 'Please provide a valid email address'], 400);
    }

    if (empty($name)) {
        wp_send_json_error(['message' => 'Please provide your name'], 400);
    }

    // Get admin email (or custom from theme options)
    $to = function_exists('carbon_get_theme_option')
        ? carbon_get_theme_option('contact_email')
        : get_option('admin_email');

    if (empty($to)) {
        $to = get_option('admin_email');
    }

    // Build email (translatable strings)
    $subject = sprintf(reduck_pll__('[Reduck Studio] New inquiry from %s'), $name);

    $body = reduck_pll__('New contact form submission:') . "\n\n";
    $body .= reduck_pll__('Name:') . " {$name}\n";
    $body .= reduck_pll__('Email:') . " {$email}\n";

    if (!empty($services)) {
        $body .= reduck_pll__('Services:') . " " . implode(', ', $services) . "\n";
    }

    if (!empty($budget)) {
        $body .= reduck_pll__('Budget:') . " {$budget}\n";
    }

    if (!empty($message)) {
        $body .= "\n" . reduck_pll__('Message:') . "\n{$message}\n";
    }

    $headers = [
        'Content-Type: text/plain; charset=UTF-8',
        "Reply-To: {$name} <{$email}>",
    ];

    // Send email
    $sent = wp_mail($to, $subject, $body, $headers);

    if ($sent) {
        wp_send_json_success(['message' => reduck_pll__('Thank you! Your message has been sent.')]);
    } else {
        wp_send_json_error(['message' => reduck_pll__('Failed to send message. Please try again.')], 500);
    }
}
