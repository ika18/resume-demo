define(['jquery',
    'app/widget/report-generator/content-block/base/main',
    'template!./main.html'], function ($, Widget, template) {
    'use strict';
    function render() {
        var me = this;

        me.html(template, me._json);
    }

    return Widget.extend(function () {
        this._type = 'training';
    }, {
        'sig/initialize': function () {
            render.call(this);
        }
    });
});