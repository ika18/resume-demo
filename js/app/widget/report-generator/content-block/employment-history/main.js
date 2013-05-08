define(['jquery',
    'app/widget/report-generator/content-block/base/main',
    'troopjs-utils/deferred',
    'template!./main.html'], function ($, Widget, deferred, template) {
    'use strict';
    function render(deferred) {
        var me = this;

        me.html(template, {}, deferred);
    }

    return Widget.extend(function () {
        this._type = 'employment-history';
    }, {
        'sig/initialize': function (signal, deferred) {
            render.call(this, deferred);
        }
    });
});