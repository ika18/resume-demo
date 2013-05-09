define(['compose',
    'jquery',
    'app/widget/report-generator/content-block/base/main',
    'troopjs-utils/deferred',
    'template!./main.html',
    'redactor'], function (Compose, $, Widget, deferred, template) {
    'use strict';
    var HUB_UPDATE_EMPLOYMENT_HISTORY = 'report-generator/employment-history/update';

    var REDACTOR_OPT = { 
        // focus: true,
        air: true,
        airButtons: ['bold', 'italic', 'deleted', '|', 'unorderedlist', 'orderedlist', 'outdent', 'indent', '|', 'table', 'link', '|', 'alignment', ]
    };

    function render(deferred) {
        var me = this;

        me.publish(HUB_UPDATE_EMPLOYMENT_HISTORY, me._json);

        me.html(template, me._json, deferred);
    }

    function onRendered(deferred) {
        var me = this;

        me.$element.find('textarea').redactor(REDACTOR_OPT);

        deferred.resolve();
    }

    return Widget.extend(function () {
        this._type = 'professional-experience';
    }, {
        'sig/initialize': function (signal, deferred) {
            render.call(this, deferred);
        },
        'sig/start': function (signal, deferred) {
            onRendered.call(this, deferred);
        },
        'dom/action.click': $.noop,
        'dom/action/item/add.click': Compose.around(function (base) {      
            return function (topic, $e, type) {
                var me = this;

                base.call(this, topic, $e, type);
                
                me.$container.find('.item:last-child').find('textarea').redactor(REDACTOR_OPT);
            };
        })
    });
});