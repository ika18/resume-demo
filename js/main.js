require.config({
    paths: {
        'troopjs-bundle': 'lib/troopjs/2.0.0-88/maxi',
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



    require(["troopjs-browser/application/widget",
        "troopjs-browser/route/widget",
        "troopjs-browser/ajax/service"], function (Application, RouteWidget, ajax) {

        $(function () {
            var $WINDOW = $(window);
            var $HTML = $("html");

            Application($HTML, "bootstrap", RouteWidget($WINDOW, "route"), ajax()).start()
                .then(function onFulfilled() {
                }, function onRejected() {
                    console.warn(arguments);
                }, function onProgress() {
                    console.info(arguments);
                });
        });

    });
});
