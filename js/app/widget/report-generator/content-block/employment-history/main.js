define(['compose',
    'jquery',
    'app/widget/report-generator/content-block/base/main',
    'troopjs-utils/deferred',
    'template!./main.html',
    'template!./row.html'], function (Compose, $, Widget, deferred, template, rowTemplate) {
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
        },
        'hub:memory/report-generator/employment-history/update': function (topic, data) {
            var me = this;
            var $tbody = me.$element.find('tbody');

            $tbody.html(rowTemplate(data.content));
        }
    });
});