<?php
/*
    Plugin Name: La Pizzeria Gutenberg Blocks
    Plugin URI: 
    Description: Add Native blocks with Gutenberg
    Version: 1.0
    Author: Nicolas CASTRO
    Author URI: 
    License: GPL2
    License URI: https://www.gnu.org/licenses/gpl-2.0.html
*/
if(!defined('ABSPATH')) exit;
 
/** Categorias Personalizadas */
function lapizzeria_categoria_personalizada($categories, $post) {
    return array_merge(
        $categories,
        array(
            array(
                'slug' => 'lapizzeria', 
                'title' => 'La Pizzeria',
                'icon' => 'store'
            )
        )
    );
}
add_filter('block_categories_all', 'lapizzeria_categoria_personalizada', 10, 2);
 
function lapizzeria_registrar_bloques() {
 
    // Si gutenberg no existe, salir
    if(!function_exists('register_block_type')) {
        return;
    }
 
    // automatically load dependencies and version
    $asset_file = include( plugin_dir_path( __FILE__ ) . 'build/index.asset.php');
 
    wp_register_script(
        'lapizzeria-editor-script',
        plugins_url( 'build/index.js', __FILE__ ),
        $asset_file['dependencies'],
        $asset_file['version']
    );
 
    wp_register_style(
        'lapizzeria-editor-styles',
        plugins_url( 'build/editor.css', __FILE__ ),
        array( 'wp-edit-blocks' ),
        filemtime( plugin_dir_path( __FILE__ ) . 'build/editor.css' )
    );
 
    wp_register_style(
        'lapizzeria-frontend-styles',
        plugins_url( 'build/styles.css', __FILE__ ),
        array( ),
        filemtime( plugin_dir_path( __FILE__ ) . 'build/styles.css' )
    );
 
    $blocks = array(
        'lapizzeria/boxes'
    );
    foreach($blocks as $block){
 
        register_block_type( $block, array(
            'api_version' => 2,
            'editor_script' => 'lapizzeria-editor-script', //escript principal para el editor
            'editor_style' => 'lapizzeria-editor-styles',  //estilos para el editor
            'style' => 'lapizzeria-frontend-styles'        //estilos para el front end
        ) );
    }

    /** REGISTRAR UN BLOQUE DINAMICO */

    register_block_type('lapizzeria/menu', array(

            'api_version' => 2,
            'editor_script' => 'lapizzeria-editor-script', //escript principal para el editor
            'editor_style' => 'lapizzeria-editor-styles',   //estilos para el editor
            'style' => 'lapizzeria-frontend-styles',        //estilos para el front end
            'render_callback' => 'lapizzeria_especialidades_front_end' //Query para la base de Datos
    ));
 
}
add_action( 'init', 'lapizzeria_registrar_bloques');


/** CONSULTA LA BASE DE DATOS PARA MOSTRAR LOS RESULTADOS EN EL FRONTEND */
function lapizzeria_especialidades_front_end($atts){


        var_dump($atts);


        //Obtener datos del Query
      $especialidades = wp_get_recent_posts(array(
        'post_type' => 'especialidades',
        'post_status' => 'publish',
        'number_posts' => 10
      ));

      //revisar que hayan resultados

      if(count($especialidades) == 0){
        return 'No hay especialidades';
      }
      $cuerpo  = '';
      $cuerpo .= '<h2>Nuestras especialidades</h2>';
      $cuerpo .= '<ul class="nuestro-menu">';
        foreach($especialidades as $esp):
            //obtener un objeto del post
            $post = get_post($esp['ID']);
            setup_postdata($post);

            $cuerpo .= sprintf(
                '<li>
                    %1$s
                        <div class="platillo">
                            <div class="precio-titulo">
                                 <h3>%2$s</h3>
                                <p>$ %3$s</p> 
                        </div>
                        <div class="contenido-platillo">
                            <p>%4$s</p>
                        </div>
                </div>
                <li>',
                    get_the_post_thumbnail($post,'especialidades'),
                    get_the_title($post),
                    get_field('precio', $post),
                    get_the_content($post)
            );
            wp_reset_postdata();
        endforeach;
      $cuerpo .= '</ul>';

      return $cuerpo;
}