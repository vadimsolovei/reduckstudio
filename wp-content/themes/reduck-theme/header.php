<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <?php wp_head(); ?>
    <script>
        (function() {
            var savedTheme = localStorage.getItem('theme');
            var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            var theme = savedTheme || (prefersDark ? 'dark' : 'light');
            document.documentElement.setAttribute('data-theme', theme);
            var themeUrl = '<?php echo esc_url(REDUCK_THEME_URI); ?>/theme-' + theme + '.css';
            document.write('<link rel="stylesheet" id="theme-stylesheet" href="' + themeUrl + '">');
        })();
    </script>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<?php get_template_part('template-parts/components/gradient-bg'); ?>
<?php get_template_part('template-parts/header/header'); ?>
