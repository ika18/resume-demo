define(['jquery',
    'troopjs-browser/component/widget',
    'template!./main.html',
    'jquery.ui'], function ($, Widget, template) {
    'use strict';

    var winHeight;
    var headerHeight;
    var footerHeight;

    function setPageContainerHeight() {
        var me = this;


        if (me.$element.hasClass('max')) {
            return;
        }

        headerHeight = me.$header.height();
        footerHeight = me.$footer.height();
        winHeight = $(window).height();

        me.$pageContainer.height(winHeight - headerHeight - footerHeight);
    }

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
            window._json = me._json = res;
            me.html(template, me._json).then(function () {
                onRendered.call(me);
            });
        });
    }

    function onRendered() {
        var me = this;

        me.$sortable = me.$element.find(".sortable-container");
        me.$options = me.$element.find('.options');
        me.$pageContainer = me.$element.find('.page-container');
        me.$header = me.$element.find('header');
        me.$footer = me.$element.find('footer');
        me.$containerActions = me.$element.find('.container-actions');

        initialContent.call(me);

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
        'dom/action.click.keyup.focusout': $.noop,
        'dom/action/editable.click': function (topic, $e) {
            var me = this;
            var $target = $($e.target);
            var $view = $target.find('.view');
            var $input = $target.find('.edit').removeClass('hide').find('input');

            $view.addClass('hide');
            $input.focus().val($view.html());
        },
        'dom/action/change/value.keyup': function (topic, $e, key) {
            if ($e.originalEvent.keyCode === 13) {
                changeValue.call(this, $e, key);
            }
        },
        'dom/action/change/value.focusout': function (topic, $e, key) {
            changeValue.call(this, $e, key);
        },
        'dom/action/save.click': function (topic, $e) {
            console.log(this._json.content);
        },
        'dom/action/export/pdf.click': function (topic, $e) {
            window.print();
        },
        'dom/action/container/maximize.click': function (topic, $e) {
            $e.preventDefault();

            var me = this;

            me.$footer.animate({
                height: 'toggle'
            });

            me.$header.animate({
                height: 'toggle'
            });


            me.$pageContainer.animate({
                height: winHeight
            }, function () {
                me.$element.addClass('max');
                me.$pageContainer.css('height', 'auto');
            });
        },
        'dom/action/container/minimize.click': function (topic, $e) {
            $e.preventDefault();
            
            var me = this;
            

            me.$footer.css({
                'position': 'fixed',
                'bottom': 0
            })

            .animate({
                height: 'toggle'
            });

            me.$header.animate({
                height: 'toggle'
            }, function () {
                me.$element.removeClass('max');
                setPageContainerHeight.call(me);
            });
        }
    });
});
