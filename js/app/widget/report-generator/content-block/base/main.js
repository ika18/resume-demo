define(['jquery',
    'troopjs-core/component/widget',
    'troopjs-utils/deferred',
    'template!app/widget/report-generator/fields/pair.html',
    'template!app/widget/report-generator/fields/list.html',
    'template!app/widget/report-generator/fields/experience.html',
    'template!app/widget/report-generator/fields/education.html'], function ($, Widget, tDeferred, pairTemplate, listTemplate, expTemplate, eduTemplate) {
    'use strict';
    var HUB_DISABLE_DRAGGABLE = 'report-generator/disable/draggable';
    var HUB_ENABLE_DRAGGABLE = 'report-generator/enable/draggable';
    var HUB_REMOVE_CONTENT = 'report-generator/remove/content/block';

    var FIELDS = {
        pair: pairTemplate(),
        list: listTemplate(),
        exp: expTemplate(),
        education: eduTemplate()
    };

    return Widget.extend(function (el, module, json) {
        var me = this;
        me._json = json;
        me._type = null;
    }, {
        'sig/initialize': function (signal, deferred) {
            var me = this;

            me.publish(HUB_DISABLE_DRAGGABLE, me._type);
            deferred.resolve();
        },
        'sig/finalize': function (signal, deferred) {
            var me = this;

            me.publish(HUB_ENABLE_DRAGGABLE, me._type);
            me.publish(HUB_REMOVE_CONTENT, me._type.replace('-', ' '));
            deferred.resolve();
        },
        "dom/action.click": $.noop,
        "dom/action/block/remove.click": function (topic, $e) {
            $e.preventDefault();
            var me = this;
            var confirm = window.confirm('Do you really want to delete this block?');

            if (confirm) {
                me.$element.remove();
            }
            
        },
        "dom/action/item/remove.click": function (topic, $e) {
            $e.preventDefault();
            var me = this;
            var $target = $($e.target);

            var confirm = window.confirm('Do you really want to delete this item?');

            if (confirm) {
                $target.closest('.item').remove();
            }
            
        },
        'dom/action/item/add.click': function (topic, $e, type) {
            $e.preventDefault();
            var me = this;
            var $target = $($e.target);
            var $container = (function () {
                var $block = $target.closest('.content-block');
                if ($block.hasClass('item-container')) {
                    return $block;
                } else {
                    return $block.find('.item-container');
                }
            }());

            $container.append(FIELDS[type]);
        }
    });
});