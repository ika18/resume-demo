define(['jquery',
    'troopjs-browser/component/widget',
    'template!./main.html',
    'jquery.ui'], function ($, Widget, template) {
    'use strict';

    function render() {
        var me = this;

        return me.publish('ajax', {
            url: 'mock/resume.json',
            type: 'get'
        }).spread(function (res) {
            console.log(res);
            return;
        });;
    }

    function onRendered() {
        var me = this;

        console.log('onRendered');
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