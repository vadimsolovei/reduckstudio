<?php
/**
 * Project translation sync and cloning
 *
 * @package Reduck_Theme
 */

defined('ABSPATH') || exit;

/**
 * Show clone/sync buttons on project edit screen
 */
add_action('edit_form_after_title', function ($post) {
    if ($post->post_type !== 'project' || !function_exists('pll_get_post_language')) {
        return;
    }

    if ($post->post_status === 'auto-draft') {
        return;
    }

    $current_lang = pll_get_post_language($post->ID);
    $translations = pll_get_post_translations($post->ID);
    $languages = pll_languages_list(['fields' => 'slug']);

    foreach ($languages as $lang) {
        if ($lang === $current_lang) {
            continue;
        }

        $has_translation = !empty($translations[$lang]);
        $label = $has_translation
            ? sprintf('Sync all fields to %s', strtoupper($lang))
            : sprintf('Clone to %s', strtoupper($lang));

        $url = wp_nonce_url(
            admin_url(sprintf(
                'admin-post.php?action=reduck_clone_to_translation&post_id=%d&lang=%s',
                $post->ID,
                $lang
            )),
            'reduck_clone_' . $post->ID
        );

        printf(
            '<div class="reduck-sync-notice" style="margin:12px 0;padding:8px 12px;background:#f0f6fc;border:1px solid #72aee6;border-radius:4px;display:inline-flex;align-items:center;gap:8px;">
                <span class="dashicons dashicons-translation" style="color:#2271b1;"></span>
                <a href="%s" class="button button-primary button-small">%s</a>
            </div>',
            esc_url($url),
            esc_html($label)
        );
    }
});

/**
 * Handle clone/sync action
 */
add_action('admin_post_reduck_clone_to_translation', function () {
    $post_id = absint($_GET['post_id'] ?? 0);
    $target_lang = sanitize_text_field($_GET['lang'] ?? '');

    if (!$post_id || !$target_lang) {
        wp_die('Invalid request.');
    }

    check_admin_referer('reduck_clone_' . $post_id);

    if (!current_user_can('edit_post', $post_id)) {
        wp_die('Insufficient permissions.');
    }

    $source = get_post($post_id);
    if (!$source || $source->post_type !== 'project') {
        wp_die('Invalid project.');
    }

    if (!function_exists('pll_get_post') || !function_exists('pll_get_post_language')) {
        wp_die('Polylang is required.');
    }

    $existing_translation = pll_get_post($post_id, $target_lang);
    $is_new = empty($existing_translation);

    if ($is_new) {
        $target_id = wp_insert_post([
            'post_type'   => 'project',
            'post_status' => 'draft',
            'post_title'  => $source->post_title . ' [' . strtoupper($target_lang) . ']',
            'post_name'   => $source->post_name . '-' . $target_lang,
        ]);

        if (is_wp_error($target_id)) {
            wp_die('Failed to create translation post.');
        }

        // Set language and link translations
        pll_set_post_language($target_id, $target_lang);

        $source_lang = pll_get_post_language($post_id);
        $translations = pll_get_post_translations($post_id);
        $translations[$source_lang] = $post_id;
        $translations[$target_lang] = $target_id;

        if (function_exists('pll_save_post_translations')) {
            pll_save_post_translations($translations);
        } elseif (function_exists('PLL')) {
            PLL()->model->post->save_translations($post_id, $translations);
        }
    } else {
        $target_id = $existing_translation;
    }

    reduck_copy_all_meta($post_id, $target_id);

    $thumbnail_id = get_post_thumbnail_id($post_id);
    if ($thumbnail_id) {
        set_post_thumbnail($target_id, $thumbnail_id);
    } else {
        delete_post_thumbnail($target_id);
    }

    $redirect = admin_url('post.php?post=' . $target_id . '&action=edit&reduck_synced=1');
    wp_safe_redirect($redirect);
    exit;
});

/**
 * Show success notice after clone/sync
 */
add_action('admin_notices', function () {
    if (!isset($_GET['reduck_synced'])) {
        return;
    }

    $screen = get_current_screen();
    if (!$screen || $screen->post_type !== 'project') {
        return;
    }

    echo '<div class="notice notice-success is-dismissible"><p>Project fields synced successfully.</p></div>';
});

/**
 * Copy all post meta from source to target
 */
function reduck_copy_all_meta($source_id, $target_id) {
    $skip_keys = ['_edit_lock', '_edit_last', '_wp_old_slug', '_wp_trash_meta_status', '_wp_trash_meta_time'];

    $meta = get_post_meta($source_id);
    if (!$meta) {
        return;
    }

    foreach ($meta as $key => $values) {
        if (in_array($key, $skip_keys, true)) {
            continue;
        }
        // Skip Polylang internal meta
        if (strpos($key, '_polylang') === 0) {
            continue;
        }

        delete_post_meta($target_id, $key);
        foreach ($values as $value) {
            add_post_meta($target_id, $key, maybe_unserialize($value));
        }
    }
}

/**
 * Auto-sync media fields to translation on save
 */
add_action('save_post_project', 'reduck_sync_media_on_save', 20, 2);

function reduck_sync_media_on_save($post_id, $post) {
    static $syncing = false;
    if ($syncing) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if ($post->post_status === 'auto-draft') {
        return;
    }

    if (!function_exists('pll_get_post') || !function_exists('pll_languages_list')) {
        return;
    }

    $languages = pll_languages_list(['fields' => 'slug']);
    $current_lang = pll_get_post_language($post_id);

    foreach ($languages as $lang) {
        if ($lang === $current_lang) {
            continue;
        }

        $translation_id = pll_get_post($post_id, $lang);
        if (!$translation_id) {
            continue;
        }

        $syncing = true;
        reduck_sync_media_fields($post_id, $translation_id);
        $syncing = false;
    }
}

/**
 * Sync only media-related meta keys between posts
 */
function reduck_sync_media_fields($source_id, $target_id) {
    // Direct media fields
    $media_keys = ['_hero_bg_image', '_testimonial_avatar'];

    foreach ($media_keys as $key) {
        $value = get_post_meta($source_id, $key, true);
        if ($value !== '') {
            update_post_meta($target_id, $key, $value);
        } else {
            delete_post_meta($target_id, $key);
        }
    }

    // Sync galleries complex field (all meta keys starting with _galleries)
    $source_meta = get_post_meta($source_id);
    $target_meta = get_post_meta($target_id);

    // Remove existing gallery meta from target
    foreach ($target_meta as $key => $values) {
        if ($key === '_galleries' || strpos($key, '_galleries|') === 0 || strpos($key, '_galleries-') === 0) {
            delete_post_meta($target_id, $key);
        }
    }

    // Copy gallery meta from source
    foreach ($source_meta as $key => $values) {
        if ($key === '_galleries' || strpos($key, '_galleries|') === 0 || strpos($key, '_galleries-') === 0) {
            foreach ($values as $value) {
                add_post_meta($target_id, $key, maybe_unserialize($value));
            }
        }
    }

    // Sync featured image
    $thumbnail_id = get_post_thumbnail_id($source_id);
    if ($thumbnail_id) {
        set_post_thumbnail($target_id, $thumbnail_id);
    } else {
        delete_post_thumbnail($target_id);
    }
}
