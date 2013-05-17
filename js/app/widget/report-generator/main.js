define(['jquery',
    'troopjs-browser/component/widget',
    'template!./main.html',
    'jquery.ui'], function ($, Widget, template) {
    'use strict';

    function render() {
        var me = this;

        return me.request = me.publish('ajax', {
            url: 'mock/resume.json',
            type: 'get'
        });
    }

    function onRendered() {
        var me = this;

        me.request.spread(function (res) {
            console.log(res);
            console.log('onRendered');
        });
    }

    return Widget.extend({
        'sig/initialize': function () {
            render.call(this);
        },
        'sig/start': function () {
            onRendered.call(this);
        }
    });
});