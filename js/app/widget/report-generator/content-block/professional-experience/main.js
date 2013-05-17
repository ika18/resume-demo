define(['troopjs-core/component/factory',
    'jquery',
    'app/widget/report-generator/content-block/base/main',
    'template!./main.html',
    'jquery.ui'], function (Factory, $, Widget, template) {
    'use strict';
    var HUB_UPDATE_EMPLOYMENT_HISTORY = 'report-generator/employment-history/update';

    function order() {
        var me = this;
        var newContent = [];

        me.$items.find('.item').each(function () {
            var $me = $(this);
            newContent.push({
                'start': $me.find('.from').text(),
                'end': $me.find('.to').text(),
                'company': $me.find('.company').text(),
                'title': $me.find('.title').text(),
                'description': $me.find('.description').html().trim()
            });
        });

        me._json.content = newContent;
    }

    function render(deferred) {
        var me = this;

        me.publish(HUB_UPDATE_EMPLOYMENT_HISTORY, me._json);

        me.html(template, me._json);
    }

    function onRendered(deferred) {
        var me = this;
        me.$items = me.$element.find('.sortable-items');

        me.$items.sortable({
            cursor: "move",
            placeholder: "sortable-placeholder",
            forcePlaceholderSize: true,
            axis: "y",
            start: function (e, ui) {
                ui.item.addClass('moving');
            },
            stop: function (e, ui) {
                ui.item.removeClass('moving');
                order.call(me);
                me.publish(HUB_UPDATE_EMPLOYMENT_HISTORY, me._json);
            }
        });
    }

    return Widget.extend(function () {
        this._type = 'professional-experience';
    }, {
        'sig/initialize': function () {
            render.call(this);
        },
        'sig/start': Factory.around(function (base) {
            return function (signal, deferred) {
                base.call(this, signal, deferred);
                onRendered.call(this);
            }
        }),
        'afterOperation': function () {
            var me = this;
            me.publish(HUB_UPDATE_EMPLOYMENT_HISTORY, me._json);
        }
    });
});