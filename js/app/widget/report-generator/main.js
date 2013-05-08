define(['jquery',
    'troopjs-core/component/widget',
    'troopjs-utils/deferred',
    'template!./main.html',
    'template!app/widget/report-generator/fields/pair.html',
    'template!app/widget/report-generator/fields/list.html',
    'template!app/widget/report-generator/fields/experience.html',
    'jquery.ui'], function ($, Widget, tDeferred, template, pairTemplate, listTemplate, expTemplate) {
    'use strict';

    var FIELDS = {
        pair: pairTemplate(),
        list: listTemplate(),
        exp: expTemplate()
    };


    function render(deferred) {
        var me = this;

        me.html(template, deferred);
    }

    function onRendered(deferred) {
        var me = this;
        // Sort section
        $(".sortable-container").sortable({
            cursor: "move",
            placeholder: "sortable-placeholder",
            containment: me.$element.find('.page-inner'),
            // forcePlaceholderSize: true,
            axis: "y",
            revert: true,
            start: function (e, ui) {
                ui.item.addClass('moving');
            },
            stop: function (e, ui) {
                ui.item.removeClass('moving');
            },
            update: function (e, ui) {
                var $item = ui.item;

                console.log($item.html('change'));
            }
        });

        $('.options li').draggable({
            connectToSortable: ".sortable-container",
            helper: 'clone',
            revert: "invalid",
            stop: function (e, ui) {

                // console.log(ui.removeClass('').removeAttr('style'));
            }
        });

        $('.sortable-items').sortable({
            cursor: "move",
            placeholder: "sortable-placeholder",
            forcePlaceholderSize: true,
            axis: "y",
            start: function (e, ui) {
                ui.item.addClass('moving');
            },
            stop: function (e, ui) {
                ui.item.removeClass('moving');  
            }
        });

        deferred.resolve();
    }

    return Widget.extend({
        'sig/initialize': function (singal, deferred) {
            render.call(this, deferred);
        },
        'sig/start': function (singal, deferred) {
            onRendered.call(this, deferred);
        },
        "dom/action.click": $.noop,
        "dom/action/item/remove.click": function (topic, $e) {
            $e.preventDefault();
            var me = this;
            var $target = $($e.target);

            $target.closest('.item').remove();
        },
        'dom/action/item/add.click': function (topic, $e, type) {
            $e.preventDefault();
            var me = this;
            var $target = $($e.target);
            var $container = (function () {
                var $section = $target.closest('section');
                if ($section.hasClass('item-container')) {
                    return $section;
                } else {
                    return $section.find('.item-container');
                }
            }());

            $container.append(FIELDS[type]);
        }
    });
});
