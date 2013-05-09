define(['jquery',
    'troopjs-core/component/widget',
    'troopjs-utils/deferred',
    'template!./main.html',
    'jquery.ui'], function ($, Widget, tDeferred, template) {
    'use strict';

    function initialContent() {
        var me = this;
        var content = me._json.content;
        var i = 0;
        var l = content.length;
        var weave;
        var $li;
        var type;

        for (i; i < l; i++) {
            type = content[i].type.replace(' ', '-').toLowerCase();
            weave = 'app/widget/report-generator/content-block/' + type + '/main(json)';

            $li = $('<li></li>').data('json', content[i].content)
                .attr('data-weave', weave);

            me.$sortable.append($li);
            $li.weave();
        }
    }

    function changeValue($e) {
        var me = this;
        var $target = $($e.target);
        var $root = $target.closest('[data-action="editable"]');
        var $view = $root .find('.view');
        var val = $target.val().trim();

        $view.html(val);

        $view.removeClass('hide');
        $root.find('.edit').addClass('hide');
    }

    function order() {
        var me = this;
        var $contentBlock = me.$sortable.find('.content-block');
        var originContent = $.extend(true, [], me._json.content);
        var currentContent = [];
        var type;
        var item;

        $contentBlock.each(function () {
            type = $(this).attr('data-type').replace('-', ' ');
            item = originContent.filter(function (obj) {
                return obj.type === type;
            })[0];

            currentContent.push(item);
        });

        me._json.content = currentContent;
    }

    function render(deferred) {
        var me = this;

        $.get('mock/resume.json').done(function (res) {
            me._json = res;

            // Deep clone original json
            me._originJson = $.extend(true, {}, res);

            me.html(template, me._json, deferred);
        });
    }

    function onRendered(deferred) {
        var me = this;

        me.$sortable = me.$element.find(".sortable-container");
        me.$options = me.$element.find('.options');

        initialContent.call(me);

        // Sort section
        me.$sortable.sortable({
            cursor: "move",
            placeholder: "sortable-placeholder",
            containment: me.$element.find('.page-inner'),
            // forcePlaceholderSize: true,
            handle: 'h2',
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
                var type = $item.attr('data-type');
                var deferred = tDeferred();

                deferred.done(function () {
                    order.call(me);
                });

                if (type) {
                    var json = (function () {
                        return me._originJson.content.filter(function (obj) {
                            return obj.type === type.replace('-', ' ');
                        })[0].content;
                    }());
                    var weave = 'app/widget/report-generator/content-block/' + type + '/main(json)';
                    $item.data('json', json)
                        .attr('data-weave', weave).weave(deferred);
                } else {
                    order.call(me);
                }
            }
        });

        $('.options li').draggable({
            connectToSortable: ".sortable-container",
            helper: 'clone',
            revert: "invalid",
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
        'hub:memory/report-generator/disable/draggable': function (topic, type) {
            var me = this;
            if (type) {
                me.$options.find('[data-type="' + type + '"]').addClass('disabled').draggable('disable');
            }
        },
        'hub:memory/report-generator/enable/draggable': function (topic, type) {
            var me = this;
            if (type) {
                me.$options.find('[data-type="' + type + '"]').removeClass('disabled').draggable('enable');
            }
            
        },
        'hub/report-generator/remove/content/block': function (topic, type) {
            var me = this;
            me._json.content = me._json.content.filter(function (obj) {
                return obj.type !== type;
            });
        },
        'dom/action.click.keyup': $.noop,
        'dom/action/editable.click': function (topic, $e) {
            var me = this;
            var $target = $($e.target);
            var $view = $target.find('.view');
            var $input = $target.find('.edit').removeClass('hide').find('input');

            $view.addClass('hide');
            $input.focus().val($view.html());            

            $input.on('focusout', function (e) {
                changeValue.call(me, e);
            });
        },
        'dom/action/change/value.keyup': function (topic, $e) {
            if ($e.originalEvent.keyCode === 13) {
                changeValue.call(this, $e);
            }
        },
        'dom/action/export/pdf.click': function (topic, $e) {
            window.print();
        }
    });
});
