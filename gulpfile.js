var elixir = require('laravel-elixir');
require('laravel-elixir-sass-compass');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
    mix.compass("*", "public/css", {
            style: "nested",
            config_file: "config.rb",
            sass: "resources/assets/sass",
            font: "public/fonts",
            image: "public/images",
            javascript: "public/js",
            sourcemap: true,
            comments: false,
            relative: true
        })
        .coffee([
            "app.coffee",
            "templates.coffee",
            "components/markers/marker_model.coffee",
            "components/markers/marker_view.coffee",
            "components/markers/markers_model.coffee",
            "components/markers/markers_view.coffee",
            "components/map_menu/map_menu_model.coffee",
            "components/map_menu/map_menu_view.coffee",
            "components/add_marker_menu/add_marker_menu_model.coffee",
            "components/add_marker_menu/add_marker_menu_view.coffee",
            "components/add_type_menu/add_type_menu_model.coffee",
            "components/add_type_menu/add_type_menu_view.coffee",
            "components/context_menu/context_menu_model.coffee",
            "components/context_menu/context_menu_view.coffee",
            "components/popup/popup_model.coffee",
            "components/popup/popup_view.coffee",
            "components/map/map_model.coffee",
            "components/map/map_view.coffee",
            "components/wikilocals_model.coffee",
            "components/wikilocals_view.coffee",
            "init_app.coffee"
        ], 'public/js/app.js');
});
