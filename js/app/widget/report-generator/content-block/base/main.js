define(['jquery',
    'troopjs-browser/component/widget',
    'template!app/widget/report-generator/fields/pair.html',
    'template!app/widget/report-generator/fields/experience.html',
    'template!app/widget/report-generator/fields/education.html',
    'redactor'], function ($, Widget, pairTemplate, expTemplate, eduTemplate) {
    'use strict';
    var HUB_DISABLE_DRAGGABLE = 'report-generator/disable/draggable';
    var HUB_ENABLE_DRAGGABLE = 'report-generator/enable/draggable';
    var HUB_REMOVE_CONTENT = 'report-generator/remove/content/block';

    var FIELDS = {
        pair: pairTemplate(),
        exp: expTemplate(),
        education: eduTemplate()
    };

    var REDACTOR_OPT = { 
        focus: true,
        buttons: ['unorderedlist', 'orderedlist', 'outdent', 'indent']
    };

    // Updated experience
    function updateData(index, key, value) {
        var me = this;

        if (!me._json.content[index]) {
            me._json.content[index] = {};
        }

        if (key) {
            me._json.content[index][key] = value;
        } else {
            me._json.content[index] = value;
        }
    }

    // Update other type's content
    function updateData2(value) {
        var me = this;

        me._json.content = value;
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
        'sig/initialize': function () {
            var me = this;

            if (me._type !== 'page-break') {
                me.publish(HUB_DISABLE_DRAGGABLE, me._type);
            }
        },
        'sig/start': function () {
            var me = this;

            me.$container = (function () {
                var $root = me.$element;
                if ($root.hasClass('item-container')) {
                    return $root;
                } else {
                    return $root.find('.item-container');
                }
            }());
        },
        'sig/finalize': function () {
            var me = this;

            me.publish(HUB_ENABLE_DRAGGABLE, me._type);
            me.publish(HUB_REMOVE_CONTENT, me._type.replace('-', ' '));
        },
        "dom/action.click.keyup.focusout": $.noop,
        "dom/action/block/remove.click": function ($e) {
            $e.preventDefault();
            var me = this;
            var confirm = window.confirm('Do you really want to delete this block?');

            if (confirm) {
                me.$element.remove();
            }
            
        },
        "dom/action/item/remove.click": function ($e) {
            $e.preventDefault();
            var me = this;
            var $target = $($e.target);
            var $items = me.$container.find('.item');
            var $thisItem = $target.closest('.item');
            var index = $items.index($thisItem);

            var confirm = window.confirm('Do you really want to delete this item?');

            if (confirm) {
                // remove this item in array
                me._json.content.splice(index, 1);

                $target.closest('.item').remove();

                if (me.afterOperation) {
                    me.afterOperation();
                }
            }
            
        },
        'dom/action/item/add.click': function ($e, type) {
            $e.preventDefault();
            var me = this;
            var $target = $($e.target);

            me.$container.append(FIELDS[type]);
        },
        'dom/action/editable.click': function ($e) {
            var me = this;
            var $target = $($e.target);
            var $view = $target.find('.view');
            var $input = $target.find('.edit').removeClass('hide').find('input');

            $view.addClass('hide');
            $input.focus().val($view.html());
        },
        'dom/action/change/value.keyup': function ($e, key) {
            $e.stopPropagation();
            var me = this;

            if ($e.originalEvent.keyCode === 13) {
                changeValue.call(me, $e, key);

                if (me.afterOperation) {
                    me.afterOperation();
                }
            }
        },
        'dom/action/change/value.focusout': function ($e, key) {
            $e.stopPropagation();
            var me = this;
            changeValue.call(me, $e, key);

            if (me.afterOperation) {
                me.afterOperation();
            }
        },
        'dom/action/redactor/edit.click': function ($e) {
            $e.preventDefault();
            var me = this;
            var $target = $($e.target);

            $target.closest('.redactor-area').addClass('editing').find('.redactor-content').redactor(REDACTOR_OPT);
        },
        'dom/action/redactor/save.click': function ($e) {
            $e.preventDefault();
            
            var me = this;
            var $target = $($e.target);
            var $area = $target.closest('.redactor-area').removeClass('editing');
            var $content = $area.removeClass('editing').find('.redactor-content')
            var $items = me.$container.find('.item');
            // Get content's html
            var html = $content.getCode(); 

            if ($items.length) {
                var $thisItem = $target.closest('.item');
                var index = $items.index($thisItem);
                updateData.call(me, index, 'description', html);
            } else {
                updateData2.call(me, html);
            }

            // Destroy editor
            $content.destroyEditor();
        }
    });
});