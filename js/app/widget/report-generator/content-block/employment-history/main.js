define(['jquery',
    'app/widget/report-generator/content-block/base/main',
    'template!./main.html',
    'template!./row.html'], function ($, Widget, template, rowTemplate) {
    'use strict';
    function render() {
        var me = this;

        me.html(template, {});
    }

    return Widget.extend(function () {
        this._type = 'employment-history';
    }, {
        'sig/initialize': function () {
            render.call(this);
        },
        'hub:memory/report-generator/employment-history/update': function (data) {
            var me = this;
            var $tbody = me.$element.find('tbody');

            $tbody.html(rowTemplate(data));
        }
    });
});