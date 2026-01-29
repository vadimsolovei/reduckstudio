<?php
/**
 * Carbon Fields Configuration
 *
 * @package Reduck_Theme
 */

defined('ABSPATH') || exit;

use Carbon_Fields\Container;
use Carbon_Fields\Field;

add_action('carbon_fields_register_fields', 'reduck_register_carbon_fields');

function reduck_register_carbon_fields() {
    // Theme Options - Site Settings
    Container::make('theme_options', __('Site Settings', 'reduck-theme'))
        ->set_icon('dashicons-admin-site')
        ->add_tab(__('General', 'reduck-theme'), [
            Field::make('text', 'site_name', __('Site Name', 'reduck-theme'))
                ->set_default_value('reduck.studio'),
            Field::make('text', 'copyright_year', __('Copyright Year', 'reduck-theme'))
                ->set_default_value(date('Y')),
            Field::make('text', 'location', __('Location', 'reduck-theme'))
                ->set_default_value('EU, MD, Chisinau'),
        ])
        ->add_tab(__('Contact', 'reduck-theme'), [
            Field::make('text', 'contact_email', __('Contact Email', 'reduck-theme'))
                ->set_default_value('hello@reduck.studio'),
            Field::make('text', 'contact_phone', __('Contact Phone', 'reduck-theme'))
                ->set_default_value('+ 373 022 235-334'),
            Field::make('text', 'telegram_handle', __('Telegram Handle', 'reduck-theme'))
                ->set_default_value('@kristijanbinski'),
            Field::make('text', 'telegram_url', __('Telegram URL', 'reduck-theme'))
                ->set_default_value('https://t.me/kristijanbinski'),
            Field::make('text', 'telegram_name', __('Telegram Display Name', 'reduck-theme'))
                ->set_default_value('Kristijan Binski'),
        ])
        ->add_tab(__('Contact Form', 'reduck-theme'), [
            Field::make('complex', 'form_services', __('Service Options', 'reduck-theme'))
                ->set_layout('tabbed-horizontal')
                ->add_fields([
                    Field::make('text', 'value', __('Value', 'reduck-theme')),
                    Field::make('text', 'label', __('Label', 'reduck-theme')),
                ])
                ->set_default_value([
                    ['value' => 'product-design', 'label' => 'Product design'],
                    ['value' => 'website', 'label' => 'Website'],
                    ['value' => 'development', 'label' => 'Development'],
                    ['value' => 'branding', 'label' => 'Branding'],
                    ['value' => 'marketing', 'label' => 'Marketing'],
                ]),
            Field::make('complex', 'form_budgets', __('Budget Options', 'reduck-theme'))
                ->set_layout('tabbed-horizontal')
                ->add_fields([
                    Field::make('text', 'value', __('Value', 'reduck-theme')),
                    Field::make('text', 'label', __('Label', 'reduck-theme')),
                ])
                ->set_default_value([
                    ['value' => '1-5k', 'label' => '$1–5k'],
                    ['value' => '5-10k', 'label' => '$5–10k'],
                    ['value' => '10-50k', 'label' => '$10–50k'],
                    ['value' => '50k+', 'label' => '$50k+'],
                ]),
        ]);

    // Homepage Fields
    Container::make('post_meta', __('Homepage Settings', 'reduck-theme'))
        ->where('post_type', '=', 'page')
        ->where('post_template', '=', 'front-page.php')
        ->or_where(function ($condition) {
            $front_page_id = get_option('page_on_front');
            if ($front_page_id) {
                $condition->where('post_id', '=', $front_page_id);
            }
        })
        ->add_tab(__('Hero', 'reduck-theme'), [
            Field::make('rich_text', 'hero_title', __('Hero Title', 'reduck-theme'))
                ->set_help_text('Use <em> tags for disabled color text'),
            Field::make('textarea', 'hero_description', __('Hero Description', 'reduck-theme')),
        ])
        ->add_tab(__('Projects', 'reduck-theme'), [
            Field::make('text', 'projects_title', __('Section Title', 'reduck-theme'))
                ->set_default_value('Проекты'),
            Field::make('association', 'featured_projects', __('Featured Projects', 'reduck-theme'))
                ->set_types([
                    ['type' => 'post', 'post_type' => 'project'],
                ])
                ->set_help_text('Select projects to display on homepage'),
        ])
        ->add_tab(__('Services', 'reduck-theme'), [
            Field::make('text', 'services_title', __('Section Title', 'reduck-theme')),
            Field::make('image', 'services_image', __('Services Image', 'reduck-theme')),
            Field::make('complex', 'services_categories', __('Service Categories', 'reduck-theme'))
                ->set_layout('tabbed-vertical')
                ->add_fields([
                    Field::make('text', 'title', __('Category Title', 'reduck-theme')),
                    Field::make('complex', 'tags', __('Tags', 'reduck-theme'))
                        ->set_layout('tabbed-horizontal')
                        ->add_fields([
                            Field::make('text', 'tag', __('Tag', 'reduck-theme')),
                        ]),
                ]),
        ])
        ->add_tab(__('Process', 'reduck-theme'), [
            Field::make('text', 'process_title', __('Section Title', 'reduck-theme')),
            Field::make('complex', 'process_phases', __('Phases', 'reduck-theme'))
                ->set_layout('tabbed-vertical')
                ->add_fields([
                    Field::make('text', 'title', __('Phase Title', 'reduck-theme')),
                    Field::make('textarea', 'description', __('Phase Description', 'reduck-theme')),
                    Field::make('complex', 'steps', __('Steps', 'reduck-theme'))
                        ->set_layout('tabbed-horizontal')
                        ->add_fields([
                            Field::make('text', 'step', __('Step', 'reduck-theme')),
                        ]),
                ]),
        ]);

    // Project Fields
    Container::make('post_meta', __('Project Details', 'reduck-theme'))
        ->where('post_type', '=', 'project')
        ->add_tab(__('Hero', 'reduck-theme'), [
            Field::make('image', 'hero_bg_image', __('Hero Background Image', 'reduck-theme'))
                ->set_help_text('Large background image for the hero section'),
        ])
        ->add_tab(__('Content Blocks', 'reduck-theme'), [
            Field::make('complex', 'content_blocks', __('Content Blocks', 'reduck-theme'))
                ->set_layout('tabbed-vertical')
                ->add_fields([
                    Field::make('text', 'label', __('Label', 'reduck-theme'))
                        ->set_help_text('e.g., "Задача" or ".01"'),
                    Field::make('text', 'title', __('Title', 'reduck-theme')),
                    Field::make('separator', 'sep_paragraph', __('— Paragraph —', 'reduck-theme')),
                    Field::make('rich_text', 'content', __('Content', 'reduck-theme')),
                    Field::make('separator', 'sep_list', __('— List —', 'reduck-theme')),
                    Field::make('text', 'list_title', __('List Title', 'reduck-theme')),
                    Field::make('complex', 'list_items', __('List Items', 'reduck-theme'))
                        ->set_layout('tabbed-horizontal')
                        ->add_fields([
                            Field::make('text', 'item', __('Item', 'reduck-theme')),
                        ]),
                    Field::make('separator', 'sep_meta', __('— Meta —', 'reduck-theme')),
                    Field::make('complex', 'meta_industry', __('Industry Tags', 'reduck-theme'))
                        ->set_layout('tabbed-horizontal')
                        ->add_fields([
                            Field::make('text', 'tag', __('Tag', 'reduck-theme')),
                        ]),
                    Field::make('complex', 'meta_services', __('Service Tags', 'reduck-theme'))
                        ->set_layout('tabbed-horizontal')
                        ->add_fields([
                            Field::make('text', 'tag', __('Tag', 'reduck-theme')),
                        ]),
                    Field::make('text', 'project_url', __('Project URL', 'reduck-theme')),
                    Field::make('text', 'project_url_text', __('Project URL Text', 'reduck-theme'))
                        ->set_default_value('Сайт'),
                    Field::make('text', 'dev_url', __('Development URL', 'reduck-theme')),
                    Field::make('text', 'dev_url_text', __('Development URL Text', 'reduck-theme'))
                        ->set_default_value('Разработка'),
                ]),
        ])
        ->add_tab(__('Galleries', 'reduck-theme'), [
            Field::make('complex', 'galleries', __('Galleries', 'reduck-theme'))
                ->set_layout('tabbed-vertical')
                ->add_fields([
                    Field::make('select', 'gallery_type', __('Gallery Type', 'reduck-theme'))
                        ->set_options([
                            'single' => 'Single Image',
                            'grid-2' => '2 Column Grid',
                            'grid-4' => '4 Column Grid',
                        ])
                        ->set_default_value('single'),
                    Field::make('text', 'position', __('Position After Block', 'reduck-theme'))
                        ->set_help_text('Enter the content block index (0-based) after which this gallery should appear')
                        ->set_default_value('0'),
                    Field::make('image', 'single_image', __('Image', 'reduck-theme'))
                        ->set_conditional_logic([
                            ['field' => 'gallery_type', 'value' => 'single'],
                        ]),
                    Field::make('text', 'single_alt', __('Image Alt Text', 'reduck-theme'))
                        ->set_conditional_logic([
                            ['field' => 'gallery_type', 'value' => 'single'],
                        ]),
                    Field::make('media_gallery', 'grid_2_images', __('Grid Images (2 columns)', 'reduck-theme'))
                        ->set_type(['image'])
                        ->set_conditional_logic([
                            ['field' => 'gallery_type', 'value' => 'grid-2'],
                        ]),
                    Field::make('media_gallery', 'grid_4_images', __('Grid Images (4 columns)', 'reduck-theme'))
                        ->set_type(['image'])
                        ->set_conditional_logic([
                            ['field' => 'gallery_type', 'value' => 'grid-4'],
                        ]),
                ]),
        ])
        ->add_tab(__('Testimonial', 'reduck-theme'), [
            Field::make('textarea', 'testimonial_quote', __('Quote', 'reduck-theme')),
            Field::make('image', 'testimonial_avatar', __('Avatar', 'reduck-theme')),
            Field::make('text', 'testimonial_name', __('Client Name', 'reduck-theme')),
            Field::make('text', 'testimonial_role', __('Client Role', 'reduck-theme')),
        ])
        ->add_tab(__('Navigation', 'reduck-theme'), [
            Field::make('association', 'nav_prev', __('Previous Project', 'reduck-theme'))
                ->set_types([
                    ['type' => 'post', 'post_type' => 'project'],
                ])
                ->set_max(1),
            Field::make('association', 'nav_next', __('Next Project', 'reduck-theme'))
                ->set_types([
                    ['type' => 'post', 'post_type' => 'project'],
                ])
                ->set_max(1),
        ]);

    // Project Card Settings (for homepage display)
    Container::make('post_meta', __('Card Display Settings', 'reduck-theme'))
        ->where('post_type', '=', 'project')
        ->set_context('side')
        ->add_fields([
            Field::make('text', 'card_metric', __('Card Metric', 'reduck-theme'))
                ->set_help_text('e.g., "+30% конверсия"'),
            Field::make('textarea', 'card_description', __('Card Description', 'reduck-theme'))
                ->set_help_text('Short description for homepage card'),
            Field::make('complex', 'card_tags', __('Card Tags', 'reduck-theme'))
                ->set_layout('tabbed-horizontal')
                ->add_fields([
                    Field::make('text', 'tag', __('Tag', 'reduck-theme')),
                ]),
        ]);
}
