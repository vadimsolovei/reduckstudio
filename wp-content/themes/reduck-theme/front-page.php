<?php
/**
 * Template Name: Homepage
 * The front page template
 *
 * @package Reduck_Theme
 */

get_header();

// Get homepage fields
$hero_title = function_exists('carbon_get_the_post_meta') ? carbon_get_the_post_meta('hero_title') : '';
$hero_description = function_exists('carbon_get_the_post_meta') ? carbon_get_the_post_meta('hero_description') : '';
$projects_title = function_exists('carbon_get_the_post_meta') ? carbon_get_the_post_meta('projects_title') : 'Цифровые продукты и впечатления';
$featured_projects = function_exists('carbon_get_the_post_meta') ? carbon_get_the_post_meta('featured_projects') : [];
$services_title = function_exists('carbon_get_the_post_meta') ? carbon_get_the_post_meta('services_title') : '';
$services_image_id = function_exists('carbon_get_the_post_meta') ? carbon_get_the_post_meta('services_image') : 0;
$services_categories = function_exists('carbon_get_the_post_meta') ? carbon_get_the_post_meta('services_categories') : [];
$process_title = function_exists('carbon_get_the_post_meta') ? carbon_get_the_post_meta('process_title') : '';
$process_phases = function_exists('carbon_get_the_post_meta') ? carbon_get_the_post_meta('process_phases') : [];

// Default hero if not set
if (empty($hero_title)) {
    $hero_title = '<em>Сайты и бренды, которые</em> помогают росту бизнеса';
}
if (empty($hero_description)) {
    $hero_description = 'Мы создаем цифровые продукты, которые привлекают аудиторию и способствуют росту бизнеса.';
}

// Get Telegram info
$telegram_url = function_exists('carbon_get_theme_option') ? carbon_get_theme_option('telegram_url') : 'https://t.me/kristijanbinski';
?>

<section class="hero container">
  <h1><?php echo wp_kses_post($hero_title); ?></h1>
  <div class="hero-cta">
    <div class="hero-contact">
      <p class="contact-description">
        <?php echo esc_html($hero_description); ?>
      </p>

      <div class="contact-cta">
        <a class="contact-card" href="<?php echo esc_url($telegram_url); ?>" target="_blank" rel="noopener noreferrer">
          <img src="<?php echo esc_url(REDUCK_THEME_URI . '/assets/images/avatar.png'); ?>" alt="Profile" />
          <img src="<?php echo esc_url(REDUCK_THEME_URI . '/assets/images/avatar.png'); ?>" alt="Profile" />
          <button class="contact-chat">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.66667 10.5752L14.1583 17.1669C14.2449 17.2435 14.3499 17.2963 14.4631 17.3201C14.5763 17.3439 14.6937 17.3378 14.8038 17.3025C14.9139 17.2672 15.0129 17.2039 15.0912 17.1187C15.1694 17.0336 15.2241 16.9296 15.25 16.8169L18.3833 3.13352C18.4096 3.01568 18.4034 2.89291 18.3653 2.77833C18.3273 2.66375 18.2588 2.56165 18.1673 2.48294C18.0757 2.40423 17.9645 2.35185 17.8455 2.33141C17.7266 2.31096 17.6042 2.32321 17.4917 2.36685L2.10834 8.40852C1.49167 8.65019 1.57501 9.55019 2.22501 9.68352L6.66667 10.5752Z" stroke="var(--color-action-primary-normal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6.66675 10.575L18.0084 2.3833" stroke="var(--color-action-primary-normal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10.4084 13.8669L7.80841 16.4669C7.71566 16.5611 7.59699 16.6255 7.4675 16.6521C7.33801 16.6787 7.20353 16.6662 7.08117 16.6162C6.9588 16.5662 6.85407 16.4809 6.78028 16.3712C6.70649 16.2615 6.66697 16.1324 6.66675 16.0002V10.5752" stroke="var(--color-action-primary-normal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div class="contact-card__text">
            Contact our Team <br />
            <em>on Telegram</em>
          </div>
        </a>
      </div>
    </div>
    <div class="cta-checkpoint_top"></div>
  </div>
</section>

<?php get_template_part('template-parts/components/cta-button'); ?>

<section class="projects container" id="projects">
  <div class="statement">
    <h2><?php echo wp_kses_post($projects_title); ?></h2>
  </div>
  <div class="projects-items">
    <?php
    if (!empty($featured_projects)) {
        foreach ($featured_projects as $project) {
            get_template_part('template-parts/components/project-card', null, [
                'project_id' => $project['id'],
            ]);
        }
    } else {
        // Fallback: show latest projects
        $projects_query = new WP_Query([
            'post_type' => 'project',
            'posts_per_page' => 4,
            'orderby' => 'date',
            'order' => 'DESC',
        ]);

        if ($projects_query->have_posts()) {
            while ($projects_query->have_posts()) {
                $projects_query->the_post();
                get_template_part('template-parts/components/project-card', null, [
                    'project_id' => get_the_ID(),
                ]);
            }
            wp_reset_postdata();
        }
    }
    ?>
  </div>
</section>

<section class="services container container-with_gradient">
  <div class="services-content">
    <div class="statement">
      <h2><?php echo wp_kses_post($services_title ?: 'Все что мы делаем помогает <em>вам расти</em>'); ?></h2>
      <div class="statement-icon">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30.6693 8L18.0026 20.6667L11.3359 14L1.33594 24" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M22.6641 8H30.6641V16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
    <div class="services-categories-container">
      <div class="services-image">
        <?php if ($services_image_id) : ?>
        <img src="<?php echo esc_url(wp_get_attachment_image_url($services_image_id, 'large')); ?>" alt="<?php esc_attr_e('Product Design', 'reduck-theme'); ?>" loading="lazy" decoding="async" />
        <?php else : ?>
        <img src="<?php echo esc_url(REDUCK_THEME_URI . '/assets/images/product-grow.png'); ?>" alt="<?php esc_attr_e('Product Design', 'reduck-theme'); ?>" loading="lazy" decoding="async" />
        <?php endif; ?>
      </div>
      <div class="services-categories">
        <?php if (!empty($services_categories)) : ?>
          <?php foreach ($services_categories as $category) : ?>
          <div class="services-category">
            <h3 class="category-title"><?php echo esc_html($category['title']); ?></h3>
            <?php if (!empty($category['tags'])) : ?>
            <div class="services-tags">
              <?php foreach ($category['tags'] as $tag) : ?>
              <span class="service-tag"><?php echo esc_html($tag['tag']); ?></span>
              <?php endforeach; ?>
            </div>
            <?php endif; ?>
          </div>
          <?php endforeach; ?>
        <?php else : ?>
          <div class="services-category">
            <h3 class="category-title">Product Design</h3>
            <div class="services-tags">
              <span class="service-tag">UX</span>
              <span class="service-tag">UI</span>
              <span class="service-tag">Design systems</span>
              <span class="service-tag">Prototype</span>
              <span class="service-tag">Strategy</span>
              <span class="service-tag">Mobile apps</span>
              <span class="service-tag">Execution</span>
              <span class="service-tag">3D</span>
            </div>
          </div>
          <div class="services-category">
            <h3 class="category-title">Branding</h3>
            <div class="services-tags">
              <span class="service-tag">Brand and Communication</span>
              <span class="service-tag">Marketing</span>
              <span class="service-tag">Logo Design</span>
            </div>
          </div>
          <div class="services-category">
            <h3 class="category-title">Development</h3>
            <div class="services-tags">
              <span class="service-tag">Frontend</span>
              <span class="service-tag">Backend</span>
            </div>
          </div>
        <?php endif; ?>
      </div>
    </div>
  </div>
</section>

<section class="process container container-with_gradient">
  <div class="statement">
    <h2><?php echo wp_kses_post($process_title ?: 'понятные <em>этапы разработки</em> и сроки сдачи'); ?></h2>
  </div>

  <div class="breakdown-phases">
    <?php if (!empty($process_phases)) : ?>
      <?php foreach ($process_phases as $index => $phase) : ?>
      <div class="phase-column">
        <div class="phase-column__icon"></div>
        <div class="phase-column__title">
          <span class="phase-number"><?php echo esc_html(str_pad($index + 1, 2, '0', STR_PAD_LEFT)); ?></span>
          <h5><?php echo esc_html($phase['title']); ?></h5>
        </div>
        <p class="phase-description"><?php echo esc_html($phase['description']); ?></p>
        <?php if (!empty($phase['steps'])) : ?>
        <div class="phase-steps">
          <?php
          $step_counter = 1;
          foreach ($process_phases as $p_index => $p) {
              if ($p_index < $index && !empty($p['steps'])) {
                  $step_counter += count($p['steps']);
              }
          }
          foreach ($phase['steps'] as $step) :
          ?>
          <div class="phase-step__item">
            <span class="phase-step__number"><?php echo esc_html($step_counter++); ?></span>
            <span class="phase-step__text"><?php echo esc_html($step['step']); ?></span>
          </div>
          <?php endforeach; ?>
        </div>
        <?php endif; ?>
      </div>
      <?php endforeach; ?>
    <?php else : ?>
      <div class="phase-column">
        <div class="phase-column__icon"></div>
        <div class="phase-column__title">
          <span class="phase-number">01</span>
          <h5>Разбираемся в задаче</h5>
        </div>
        <p class="phase-description">Определяем ключевые метрики и показатели на которые хотим повлиять. Формируем ТЗ.</p>
        <div class="phase-steps">
          <div class="phase-step__item"><span class="phase-step__number">1</span><span class="phase-step__text">Strategy Workshop</span></div>
          <div class="phase-step__item"><span class="phase-step__number">2</span><span class="phase-step__text">Idea Validation</span></div>
          <div class="phase-step__item"><span class="phase-step__number">3</span><span class="phase-step__text">Market Research</span></div>
          <div class="phase-step__item"><span class="phase-step__number">4</span><span class="phase-step__text">Product Positioning</span></div>
          <div class="phase-step__item"><span class="phase-step__number">5</span><span class="phase-step__text">UX Research</span></div>
          <div class="phase-step__item"><span class="phase-step__number">6</span><span class="phase-step__text">Functional Decomposition</span></div>
        </div>
      </div>
      <div class="phase-column">
        <div class="phase-column__icon"></div>
        <div class="phase-column__title">
          <span class="phase-number">02</span>
          <h5>Анализ и стратегия</h5>
        </div>
        <p class="phase-description">Изучаем ваш рынок, конкурентов и клиентов, чтобы предложить эффективный план работ и сформировать сроки</p>
        <div class="phase-steps">
          <div class="phase-step__item"><span class="phase-step__number">7</span><span class="phase-step__text">User Flows</span></div>
          <div class="phase-step__item"><span class="phase-step__number">8</span><span class="phase-step__text">Prototyping</span></div>
        </div>
      </div>
      <div class="phase-column">
        <div class="phase-column__icon"></div>
        <div class="phase-column__title">
          <span class="phase-number">03</span>
          <h5>Дизайн и прототип</h5>
        </div>
        <p class="phase-description">Создаём дизайн-концепции и интерактивные прототипы. Продумываем визуальные решения и пользовательский опыт.</p>
        <div class="phase-steps">
          <div class="phase-step__item"><span class="phase-step__number">9</span><span class="phase-step__text">Moodboards</span></div>
          <div class="phase-step__item"><span class="phase-step__number">10</span><span class="phase-step__text">Visual Design</span></div>
          <div class="phase-step__item"><span class="phase-step__number">11</span><span class="phase-step__text">Hand-off</span></div>
        </div>
      </div>
      <div class="phase-column">
        <div class="phase-column__icon"></div>
        <div class="phase-column__title">
          <span class="phase-number">04</span>
          <h5>Разработка и запуск</h5>
        </div>
        <p class="phase-description">Запускаем проект. Следим за его работой и помогаем с дальнейшими улучшениями.</p>
        <div class="phase-steps">
          <div class="phase-step__item"><span class="phase-step__number">12</span><span class="phase-step__text">Development</span></div>
          <div class="phase-step__item"><span class="phase-step__number">13</span><span class="phase-step__text">Testing</span></div>
          <div class="phase-step__item"><span class="phase-step__number">14</span><span class="phase-step__text">Launch</span></div>
        </div>
      </div>
    <?php endif; ?>
  </div>
</section>

<?php get_template_part('template-parts/components/contact-section'); ?>

<?php
get_footer();
