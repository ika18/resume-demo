define(['jquery',
    'troopjs-browser/component/widget',
    'template!./main.html',
    'jquery.ui'], function ($, Widget, template) {
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

            $li = $('<li></li>').data('json', content[i])
                .attr('data-weave', weave);

            me.$sortable.append($li);
            $li.weave();
        }
    }

    function init() {
        var me = this;

        return me.publish('ajax', {
            url: 'mock/resume.json',
            type: 'get'
        }).spread(function (res) {
            me._json = res;
            me.html(template, me._json).then(function () {
                onRendered.call(me);
            });
        });
    }

    // On rendered
    function onRendered() {
        var me = this;

        me.$sortable = me.$element.find(".sortable-container");
        me.$options = me.$element.find('.options');
        me.$pageContainer = me.$element.find('.page-container');
        me.$header = me.$element.find('header');
        me.$footer = me.$element.find('footer');
        me.$containerActions = me.$element.find('.container-actions');

        initialContent.call(me);

        me.publish('test', 'hello');
    }

    return Widget.extend({
        'sig/start': function () {
            init.call(this);
        },
        'hub:memory/report-generator/disable/draggable': function (type) {
            var me = this;
            if (type) {
                me.$options.find('[data-type="' + type + '"]').addClass('disabled').draggable('disable');
            }
        },
        'hub:memory/report-generator/enable/draggable': function (type) {
            var me = this;
            if (type) {
                me.$options.find('[data-type="' + type + '"]').removeClass('disabled').draggable('enable');
            }
            
        },
        'hub/report-generator/remove/content/block': function (type) {
            var me = this;
            var newContent = me._json.content.filter(function (obj) {
                return obj.type !== type;
            });
            me._json.content = newContent;
        },
    });
});