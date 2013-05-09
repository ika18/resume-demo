define(['jquery',
    'troopjs-core/component/widget',
    'troopjs-utils/deferred',
    'template!app/widget/report-generator/fields/pair.html',
    'template!app/widget/report-generator/fields/list.html',
    'template!app/widget/report-generator/fields/experience.html',
    'template!app/widget/report-generator/fields/education.html',
    'redactor'], function ($, Widget, tDeferred, pairTemplate, listTemplate, expTemplate, eduTemplate) {
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

    var REDACTOR_OPT = { 
        focus: true,
        air: true,
        buttons: ['bold', 'italic', 'deleted', '|', 'unorderedlist', 'orderedlist', 'outdent', 'indent', '|', 'table', 'link', '|', 'alignment'],
        airButtons: ['bold', 'italic', 'deleted', '|', 'unorderedlist', 'orderedlist', 'outdent', 'indent', '|', 'table', 'link', '|', 'alignment']
    };

    function updateData(index, key, value) {
        var me = this;

        if (!me._json[index]) {
            me._json[index] = {};
        }

        if (key) {
            me._json[index][key] = value;
        } else {
            me._json[index] = value;
        }
    }

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
        updateData.call(me, index, key, val);
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
        "dom/action.click.keyup.focusout": $.noop,
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
            var $items = me.$container.find('.item');
            var $thisItem = $target.closest('.item');
            var index = $items.index($thisItem);

            var confirm = window.confirm('Do you really want to delete this item?');

            if (confirm) {
                // remove this item in array
                me._json.splice(index, 1);

                $target.closest('.item').remove();

                if (me.afterOperation) {
                    me.afterOperation(topic);
                }
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

                if (me.afterOperation) {
                    me.afterOperation(topic);
                }
            }
        },
        'dom/action/change/value.focusout': function (topic, $e, key) {
            $e.stopPropagation();
            var me = this;
            changeValue.call(me, $e, key);

            if (me.afterOperation) {
                me.afterOperation(topic);
            }
        },
        'dom/action/redactor/edit.click': function (topic, $e) {
            $e.preventDefault();
            var me = this;
            var $target = $($e.target);

            $target.closest('.redactor-area').addClass('editing').find('.redactor-content').redactor(REDACTOR_OPT);
        },
        'dom/action/redactor/save.click': function (topic, $e) {
            $e.preventDefault();
            var me = this;
            var $target = $($e.target);
            var $items = me.$container.find('.item');
            var $thisItem = $target.closest('.item');
            var index = $items.index($thisItem);
            var $area = $target.closest('.redactor-area').removeClass('editing');
            var $content = $area.removeClass('editing').find('.redactor-content')
            var html = $content.getCode(); 

            $content.destroyEditor();

            updateData.call(me, index, 'description', html);
        }
    });
});