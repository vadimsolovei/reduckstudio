<?php
/**
 * Project Card Template Part
 *
 * @var int $project_id The project post ID
 */

$project_id = $args['project_id'] ?? get_the_ID();

$card_video_id = function_exists('carbon_get_post_meta') ? carbon_get_post_meta($project_id, 'card_video') : 0;
$card_description = function_exists('carbon_get_post_meta') ? carbon_get_post_meta($project_id, 'card_description') : get_the_excerpt($project_id);
$card_tags = function_exists('carbon_get_post_meta') ? carbon_get_post_meta($project_id, 'card_tags') : [];

$thumbnail_id = get_post_thumbnail_id($project_id);
$thumbnail_url = $thumbnail_id ? wp_get_attachment_image_url($thumbnail_id, 'full') : REDUCK_THEME_URI . '/assets/images/content.jpg';
?>
<a href="<?php echo esc_url(get_permalink($project_id)); ?>" class="project-card">
  <div class="project-image">
    <?php if ($card_video_id && wp_attachment_is('video', $card_video_id)) :
        $video_url = wp_get_attachment_url($card_video_id);
        $video_mime = get_post_mime_type($card_video_id);
    ?>
    <video autoplay muted loop playsinline>
      <source src="<?php echo esc_url($video_url); ?>" type="<?php echo esc_attr($video_mime); ?>" />
    </video>
    <?php else : ?>
    <img
      src="<?php echo esc_url($thumbnail_url); ?>"
      alt="<?php echo esc_attr(get_the_title($project_id)); ?>"
      loading="lazy"
      decoding="async"
    />
    <?php endif; ?>
  </div>
  <div class="project-info">
    <h3><?php echo esc_html(get_the_title($project_id)); ?></h3>
    <?php if ($card_description) : ?>
    <p><?php echo wp_kses_post($card_description); ?></p>
    <?php endif; ?>
    <?php if (!empty($card_tags)) : ?>
    <div class="tags">
      <?php foreach ($card_tags as $tag) : ?>
      <span class="tag"><?php echo esc_html($tag['tag']); ?></span>
      <?php endforeach; ?>
    </div>
    <?php endif; ?>
  </div>
</a>
