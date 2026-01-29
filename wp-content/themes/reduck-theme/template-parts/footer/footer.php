<?php
$site_name = function_exists('carbon_get_theme_option') ? carbon_get_theme_option('site_name') : 'reduck.studio';
$copyright_year = function_exists('carbon_get_theme_option') ? carbon_get_theme_option('copyright_year') : date('Y');
$location = function_exists('carbon_get_theme_option') ? carbon_get_theme_option('location') : 'EU, MD, Chisinau';
?>
<footer class="footer container">
  <div class="footer-content">
    <div class="footer-left">
      <span>&copy; <?php echo esc_html($copyright_year); ?> <?php echo esc_html($site_name); ?></span>
      <span><?php echo esc_html($location); ?></span>
    </div>
    <div class="footer-right">
      <a href="#"><?php esc_html_e('Privacy Policy', 'reduck-theme'); ?></a>
      <a href="#"><?php esc_html_e('Terms', 'reduck-theme'); ?></a>
    </div>
  </div>
</footer>
