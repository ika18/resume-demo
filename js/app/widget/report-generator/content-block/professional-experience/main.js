define(['jquery',
    'app/widget/report-generator/content-block/base/main',
    'template!./main.html'], function ($, Widget, template) {
    'use strict';
    var HUB_UPDATE_EMPLOYMENT_HISTORY = 'report-generator/employment-history/update';

    function render() {
        var me = this;

        me.publish(HUB_UPDATE_EMPLOYMENT_HISTORY, me._json);

        me.html(template, me._json);
    }

    return Widget.extend(function () {
        this._type = 'professional-experience';
    }, {
        'sig/initialize': function () {
            render.call(this);
        },
        'afterOperation': function (event) {
            var me = this;
            me.publish(HUB_UPDATE_EMPLOYMENT_HISTORY, me._json);
        }
    });
});