<?php
/**
 * The main template file
 *
 * @package Reduck_Theme
 */

get_header();
?>

<main>
    <?php if (have_posts()) : ?>
        <?php while (have_posts()) : the_post(); ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class('container'); ?>>
                <h1><?php the_title(); ?></h1>
                <?php the_content(); ?>
            </article>
        <?php endwhile; ?>
    <?php else : ?>
        <section class="container">
            <p><?php esc_html_e('No content found.', 'reduck-theme'); ?></p>
        </section>
    <?php endif; ?>
</main>

<?php
get_footer();
