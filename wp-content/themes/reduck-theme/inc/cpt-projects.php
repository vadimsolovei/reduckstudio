<?php
/**
 * Register Projects Custom Post Type
 *
 * @package Reduck_Theme
 */

defined('ABSPATH') || exit;

add_action('init', function () {
    $labels = [
        'name' => __('Projects', 'reduck-theme'),
        'singular_name' => __('Project', 'reduck-theme'),
        'menu_name' => __('Projects', 'reduck-theme'),
        'add_new' => __('Add New', 'reduck-theme'),
        'add_new_item' => __('Add New Project', 'reduck-theme'),
        'edit_item' => __('Edit Project', 'reduck-theme'),
        'new_item' => __('New Project', 'reduck-theme'),
        'view_item' => __('View Project', 'reduck-theme'),
        'view_items' => __('View Projects', 'reduck-theme'),
        'search_items' => __('Search Projects', 'reduck-theme'),
        'not_found' => __('No projects found', 'reduck-theme'),
        'not_found_in_trash' => __('No projects found in Trash', 'reduck-theme'),
        'all_items' => __('All Projects', 'reduck-theme'),
        'archives' => __('Project Archives', 'reduck-theme'),
        'attributes' => __('Project Attributes', 'reduck-theme'),
        'insert_into_item' => __('Insert into project', 'reduck-theme'),
        'uploaded_to_this_item' => __('Uploaded to this project', 'reduck-theme'),
        'featured_image' => __('Featured Image', 'reduck-theme'),
        'set_featured_image' => __('Set featured image', 'reduck-theme'),
        'remove_featured_image' => __('Remove featured image', 'reduck-theme'),
        'use_featured_image' => __('Use as featured image', 'reduck-theme'),
    ];

    $args = [
        'labels' => $labels,
        'public' => true,
        'publicly_queryable' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => true,
        'query_var' => true,
        'rewrite' => [
            'slug' => 'products',
            'with_front' => false,
        ],
        'capability_type' => 'post',
        'has_archive' => false,
        'hierarchical' => false,
        'menu_position' => 5,
        'menu_icon' => 'dashicons-portfolio',
        'supports' => [
            'title',
            'thumbnail',
            'excerpt',
        ],
    ];

    register_post_type('project', $args);
});
