<?php
/**
 * Single Project Template
 *
 * @package Reduck_Theme
 */

get_header();

while (have_posts()) :
    the_post();

    // Get project fields
    $hero_bg_image_id = function_exists('carbon_get_the_post_meta') ? carbon_get_the_post_meta('hero_bg_image') : 0;
    $content_blocks = function_exists('carbon_get_the_post_meta') ? carbon_get_the_post_meta('content_blocks') : [];
    $galleries = function_exists('carbon_get_the_post_meta') ? carbon_get_the_post_meta('galleries') : [];
    $testimonial_quote = function_exists('carbon_get_the_post_meta') ? carbon_get_the_post_meta('testimonial_quote') : '';
    $testimonial_avatar_id = function_exists('carbon_get_the_post_meta') ? carbon_get_the_post_meta('testimonial_avatar') : 0;
    $testimonial_name = function_exists('carbon_get_the_post_meta') ? carbon_get_the_post_meta('testimonial_name') : '';
    $testimonial_role = function_exists('carbon_get_the_post_meta') ? carbon_get_the_post_meta('testimonial_role') : '';
    $nav_prev = function_exists('carbon_get_the_post_meta') ? carbon_get_the_post_meta('nav_prev') : [];
    $nav_next = function_exists('carbon_get_the_post_meta') ? carbon_get_the_post_meta('nav_next') : [];

    $hero_bg_url = $hero_bg_image_id ? wp_get_attachment_image_url($hero_bg_image_id, 'project-hero') : '';
    $project_title = get_the_title();
    ?>

    <section class="hero container"<?php if ($hero_bg_url) : ?> style="background-image: url('<?php echo esc_url($hero_bg_url); ?>')"<?php endif; ?>>
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="<?php echo esc_url(home_url('/#projects')); ?>" class="breadcrumb-link"><?php esc_html_e('works', 'reduck-theme'); ?></a>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current"><?php echo esc_html($project_title); ?></span>
      </nav>
      <h1><?php echo wp_kses_post(reduck_break_after_first($project_title)); ?></h1>
    </section>

    <section class="project-overview container">
      <?php
      if (!empty($content_blocks)) :
          foreach ($content_blocks as $block_index => $block) :
              ?>
              <div class="project-overview-content">
                <div class="project-overview-main">
                  <h3 class="project-overview-label"><?php echo esc_html($block['label'] ?? ''); ?></h3>
                  <h2 class="project-overview-title"><?php echo esc_html($block['title'] ?? ''); ?></h2>
                </div>

                <div class="project-overview-description">
                  <?php if (!empty($block['content'])) : ?>
                    <?php echo wp_kses_post($block['content']); ?>
                  <?php endif; ?>
                  <?php if (!empty($block['list_title']) || !empty($block['list_items'])) : ?>
                    <ul class="project-overview-list">
                      <?php if (!empty($block['list_title'])) : ?>
                      <h4 class="project-overview-list_title"><?php echo esc_html($block['list_title']); ?></h4>
                      <?php endif; ?>
                      <?php if (!empty($block['list_items'])) : ?>
                        <?php foreach ($block['list_items'] as $item) : ?>
                        <li><?php echo esc_html($item['item']); ?></li>
                        <?php endforeach; ?>
                      <?php endif; ?>
                    </ul>
                  <?php endif; ?>
                </div>

                <?php
                $has_meta = !empty($block['meta_industry']) || !empty($block['project_url']) || !empty($block['meta_services']) || !empty($block['dev_url']);
                if ($has_meta) :
                ?>
                <div class="project-meta">
                  <?php if (!empty($block['meta_industry'])) : ?>
                  <div class="project-meta-row">
                    <h4 class="project-meta-label"><?php esc_html_e('Industry', 'reduck-theme'); ?></h4>
                    <div class="project-meta-tags">
                      <?php foreach ($block['meta_industry'] as $tag) : ?>
                      <span class="project-meta-tag"><?php echo esc_html($tag['tag']); ?></span>
                      <?php endforeach; ?>
                    </div>
                  </div>
                  <?php endif; ?>

                  <?php if (!empty($block['project_url'])) : ?>
                  <div class="project-meta-row">
                    <h4 class="project-meta-label"><?php echo esc_html($block['project_url_text'] ?? __('Website', 'reduck-theme')); ?></h4>
                    <div class="project-meta-content">
                      <a href="<?php echo esc_url($block['project_url']); ?>" class="project-meta-link" target="_blank" rel="noopener noreferrer">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.83594 14.1666L14.1693 5.83325" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M5.83594 5.83325H14.1693V14.1666" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span><?php echo esc_html($block['project_url']); ?></span>
                      </a>
                    </div>
                  </div>
                  <?php endif; ?>

                  <?php if (!empty($block['meta_services'])) : ?>
                  <div class="project-meta-row">
                    <h4 class="project-meta-label"><?php esc_html_e('Services', 'reduck-theme'); ?></h4>
                    <div class="project-meta-tags">
                      <?php foreach ($block['meta_services'] as $tag) : ?>
                      <span class="project-meta-tag"><?php echo esc_html($tag['tag']); ?></span>
                      <?php endforeach; ?>
                    </div>
                  </div>
                  <?php endif; ?>

                  <?php if (!empty($block['dev_url'])) : ?>
                  <div class="project-meta-row">
                    <h4 class="project-meta-label"><?php echo esc_html($block['dev_url_text'] ?? __('Development', 'reduck-theme')); ?></h4>
                    <div class="project-meta-content">
                      <a href="<?php echo esc_url($block['dev_url']); ?>" class="project-meta-link" target="_blank" rel="noopener noreferrer">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.83594 14.1666L14.1693 5.83325" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M5.83594 5.83325H14.1693V14.1666" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span><?php echo esc_html($block['dev_url']); ?></span>
                      </a>
                    </div>
                  </div>
                  <?php endif; ?>
                </div>
                <?php endif; ?>
              </div>

              <?php
              // Render galleries positioned after this content block
              if (!empty($galleries)) :
                  foreach ($galleries as $gallery) :
                      $gallery_position = intval($gallery['position'] ?? 0);
                      if ($gallery_position === $block_index) :
                          $gallery_type = $gallery['gallery_type'] ?? 'single';
                          ?>
                          <div class="project-gallery">
                            <?php if ($gallery_type === 'single') :
                                $single_image_url = !empty($gallery['single_image']) ? wp_get_attachment_image_url($gallery['single_image'], 'project-gallery') : '';
                                if ($single_image_url) :
                            ?>
                              <div class="project-gallery-single">
                                <img src="<?php echo esc_url($single_image_url); ?>" alt="<?php echo esc_attr($gallery['single_alt'] ?? ''); ?>" loading="lazy" />
                              </div>
                            <?php endif; ?>
                            <?php elseif ($gallery_type === 'grid-4' || $gallery_type === 'grid-2') :
                                $grid_images = $gallery_type === 'grid-2'
                                    ? ($gallery['grid_2_images'] ?? [])
                                    : ($gallery['grid_4_images'] ?? []);
                                if (!empty($grid_images)) :
                            ?>
                              <div class="project-gallery-<?php echo esc_attr($gallery_type); ?>">
                                <?php foreach ($grid_images as $image_id) :
                                    $image_url = wp_get_attachment_image_url($image_id, 'project-gallery');
                                    if ($image_url) :
                                ?>
                                <img src="<?php echo esc_url($image_url); ?>" alt="" loading="lazy" />
                                <?php endif; ?>
                                <?php endforeach; ?>
                              </div>
                            <?php endif; ?>
                            <?php endif; ?>
                          </div>
                          <?php
                      endif;
                  endforeach;
              endif;
              ?>
              <?php
          endforeach;
      endif;
      ?>
    </section>

    <?php if (!empty($testimonial_quote)) : ?>
    <section class="client-testimonial container">
      <p class="testimonial-label"><?php esc_html_e('From the client:', 'reduck-theme'); ?></p>
      <div class="testimonial-content">
        <blockquote class="testimonial-quote"><?php echo esc_html($testimonial_quote); ?></blockquote>

        <div class="testimonial-author">
          <div class="author-avatar">
            <?php if ($testimonial_avatar_id) : ?>
            <img src="<?php echo esc_url(wp_get_attachment_image_url($testimonial_avatar_id, 'thumbnail')); ?>" alt="<?php echo esc_attr($testimonial_name); ?>" loading="lazy" />
            <?php endif; ?>
          </div>
          <div class="author-info">
            <h4 class="author-name"><?php echo esc_html($testimonial_name); ?></h4>
            <p class="author-title"><?php echo esc_html($testimonial_role); ?></p>
          </div>
        </div>
      </div>
    </section>
    <?php endif; ?>

    <?php if (!empty($nav_prev) || !empty($nav_next)) : ?>
    <section class="project-navigation">
      <?php if (!empty($nav_prev) && isset($nav_prev[0]['id'])) :
          $prev_id = $nav_prev[0]['id'];
          $prev_thumb_id = get_post_thumbnail_id($prev_id);
          $prev_thumb_url = $prev_thumb_id ? wp_get_attachment_image_url($prev_thumb_id, 'project-thumb') : '';
      ?>
      <a href="<?php echo esc_url(get_permalink($prev_id)); ?>" class="project-nav-item project-nav-prev">
        <div class="project-logo">
          <?php if ($prev_thumb_url) : ?>
          <img src="<?php echo esc_url($prev_thumb_url); ?>" alt="<?php echo esc_attr(get_the_title($prev_id)); ?>" loading="lazy" />
          <?php endif; ?>
        </div>
        <div class="project-nav-info">
          <span class="project-nav-label"><?php esc_html_e('Previous work', 'reduck-theme'); ?></span>
          <h3 class="project-nav-title"><?php echo esc_html(get_the_title($prev_id)); ?></h3>
        </div>
      </a>
      <?php else : ?>
      <div class="project-nav-item project-nav-prev project-nav-disabled"></div>
      <?php endif; ?>

      <div class="project-nav-divider"></div>

      <?php if (!empty($nav_next) && isset($nav_next[0]['id'])) :
          $next_id = $nav_next[0]['id'];
          $next_thumb_id = get_post_thumbnail_id($next_id);
          $next_thumb_url = $next_thumb_id ? wp_get_attachment_image_url($next_thumb_id, 'project-thumb') : '';
      ?>
      <a href="<?php echo esc_url(get_permalink($next_id)); ?>" class="project-nav-item project-nav-next">
        <div class="project-nav-info">
          <span class="project-nav-label"><?php esc_html_e('Next work', 'reduck-theme'); ?></span>
          <h3 class="project-nav-title"><?php echo esc_html(get_the_title($next_id)); ?></h3>
        </div>
        <div class="project-logo">
          <?php if ($next_thumb_url) : ?>
          <img src="<?php echo esc_url($next_thumb_url); ?>" alt="<?php echo esc_attr(get_the_title($next_id)); ?>" loading="lazy" />
          <?php endif; ?>
        </div>
      </a>
      <?php else : ?>
      <div class="project-nav-item project-nav-next project-nav-disabled"></div>
      <?php endif; ?>
    </section>
    <?php endif; ?>

    <?php get_template_part('template-parts/components/contact-section'); ?>

<?php
endwhile;

get_footer();
