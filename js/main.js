require.config({
    paths: {
        'troopjs-bundle': 'lib/troopjs/1.0.9-2/troopjs-bundle',
        'jquery': 'lib/jquery-1.7.2.min',
        'jquery.ui': 'lib/jqueryui/jquery-ui.min',
        'redactor': 'lib/redactor/8.2.6/redactor'
    },
    shim: {
        'jquery.ui': ['jquery'],
        'redactor': ['jquery']
    },
    map: {
        '*': {
            'template': 'troopjs-requirejs/template'
        }
    },
    waitSeconds: 30
});

require(['require',
    'jquery', 
    'troopjs-bundle'], function (require, $) {
    'use strict';

    require(["app/widget/application",
        "troopjs-jquery/weave",
        "troopjs-jquery/destroy",
        "troopjs-jquery/hashchange",
        "troopjs-jquery/action"], function (Application) {

        $(document).ready(function () {
            Application($(this), "demo").start();
        });

    });
});
