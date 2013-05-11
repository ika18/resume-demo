define(['compose',
    'jquery',
    'app/widget/report-generator/content-block/base/main',
    'troopjs-utils/deferred',
    'template!./main.html'], function (Compose, $, Widget, deferred, template) {
    'use strict';
    var HUB_UPDATE_EMPLOYMENT_HISTORY = 'report-generator/employment-history/update';

    function render(deferred) {
        var me = this;

        me.publish(HUB_UPDATE_EMPLOYMENT_HISTORY, me._json);

        me.html(template, me._json, deferred);
    }

    return Widget.extend(function () {
        this._type = 'professional-experience';
    }, {
        'sig/initialize': function (signal, deferred) {
            render.call(this, deferred);
        },
        'afterOperation': function (topic, event) {
            var me = this;
            me.publish(HUB_UPDATE_EMPLOYMENT_HISTORY, me._json);
        }
    });
});