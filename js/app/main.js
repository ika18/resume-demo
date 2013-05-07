require.config({
    paths: {
        'troopjs-bundle': '../lib/troopjs/1.0.9-8/troopjs-bundle.min',
        'jquery': '../lib/jquery-1.9.1.min',
        'jquery.ui': '../lib/jqueryui/jquery-ui.min'
    },
    shim: {
        'jquery.ui': ['jquery']
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

    require(['widget/application',
        "troopjs-jquery/weave",
        "troopjs-jquery/destroy",
        "troopjs-jquery/action"], function (Application) {

        $(document).ready(function () {
            (Application()).start();
        });

    });
});
