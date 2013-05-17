define(['jquery',
    'app/widget/report-generator/content-block/base/main',
    'template!./main.html'], function ($, Widget, template) {
    'use strict';
    function render() {
        var me = this;

        me.html(template, {}).then(function () {
            me.$element.addClass('page-break');
        });
    }

    return Widget.extend(function () {
        this._type = 'page-break';
    }, {
        'sig/initialize': function () {
            render.call(this);
        }
    });
});