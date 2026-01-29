<?php
/**
 * Enqueue scripts and styles
 *
 * @package Reduck_Theme
 */

defined('ABSPATH') || exit;

add_action('wp_enqueue_scripts', function () {
    // Main stylesheet
    wp_enqueue_style(
        'reduck-style',
        get_stylesheet_uri(),
        [],
        REDUCK_THEME_VERSION
    );

    // Google Fonts - Roboto
    wp_enqueue_style(
        'reduck-google-fonts',
        'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap',
        [],
        null
    );

    // Register theme CSS files (dark/light) - loaded dynamically via JS
    wp_register_style('reduck-theme-dark', REDUCK_THEME_URI . '/theme-dark.css', [], REDUCK_THEME_VERSION);
    wp_register_style('reduck-theme-light', REDUCK_THEME_URI . '/theme-light.css', [], REDUCK_THEME_VERSION);

    // Main JavaScript
    wp_enqueue_script(
        'reduck-script',
        REDUCK_THEME_URI . '/assets/js/script.js',
        [],
        REDUCK_THEME_VERSION,
        true
    );

    // Localize script with theme data
    wp_localize_script('reduck-script', 'reduckTheme', [
        'themeUri' => REDUCK_THEME_URI,
        'darkCss' => REDUCK_THEME_URI . '/theme-dark.css',
        'lightCss' => REDUCK_THEME_URI . '/theme-light.css',
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('reduck_contact_nonce'),
        'i18n' => [
            'formSuccess' => reduck_pll__('Thank you! Your message has been sent.'),
            'formError' => reduck_pll__('Failed to send message. Please try again.'),
            'formErrorGeneric' => reduck_pll__('An error occurred. Please try again.'),
        ],
    ]);
});

// Preload Bebas Neue font
add_action('wp_head', function () {
    ?>
    <link rel="preload" href="<?php echo esc_url(REDUCK_THEME_URI . '/assets/fonts/BebasNeue/BebasNeue-Bold.otf'); ?>" as="font" type="font/otf" crossorigin>
    <?php
}, 1);

// Add preconnect for Google Fonts
add_action('wp_head', function () {
    ?>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <?php
}, 1);
