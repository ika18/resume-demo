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

    function changeValue($e, key) {
        var me = this;
        var $target = $($e.target);
        var $root = $target.closest('[data-action="editable"]');
        var $view = $root .find('.view');
        var val = $target.val().trim();
        var $items = me.$container.find('.item');
        var $thisItem = $target.closest('.item');
        var index = $items.index($thisItem);
        
        $view.html(val);

        $view.removeClass('hide');
        $root.find('.edit').addClass('hide');

        // Update json
        if (key) {
            me._json[index][key] = val;
        } else {
            me._json[index] = val;
        }
    }

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
        'sig/start': function (signal, deferred) {
            var me = this;

            me.$container = (function () {
                var $root = me.$element;
                if ($root.hasClass('item-container')) {
                    return $root;
                } else {
                    return $root.find('.item-container');
                }
            }());
            
            deferred.resolve();
        },
        'sig/finalize': function (signal, deferred) {
            var me = this;

            me.publish(HUB_ENABLE_DRAGGABLE, me._type);
            me.publish(HUB_REMOVE_CONTENT, me._type.replace('-', ' '));
            deferred.resolve();
        },
        "dom/action.click.keyup.change": $.noop,
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

            me.$container.append(FIELDS[type]);
        },
        'dom/action/editable.click': function (topic, $e) {
            var me = this;
            var $target = $($e.target);
            var $view = $target.find('.view');
            var $input = $target.find('.edit').removeClass('hide').find('input');

            $view.addClass('hide');
            $input.focus().val($view.html());
        },
        'dom/action/change/value.keyup': function (topic, $e, key) {
            $e.stopPropagation();
            var me = this;

            if ($e.originalEvent.keyCode === 13) {
                changeValue.call(me, $e, key);
            }
        }
    });
});