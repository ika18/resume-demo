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

    function render(deferred) {
        var me = this;

        $.get('mock/resume.json').done(function (res) {
            me._json = res;
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

                if (type) {
                    var json = (function () {
                        return me._json.content.filter(function (obj) {
                            return obj.type === type.replace('-', ' ');
                        })[0].content;
                    }());
                    var weave = 'app/widget/report-generator/content-block/' + type + '/main(json)';
                    $item.data('json', json)
                        .attr('data-weave', weave).weave();
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
    });
});
