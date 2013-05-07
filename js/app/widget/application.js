define(["jquery",
    "troopjs-utils/deferred",
    "troopjs-utils/when",
    "troopjs-utils/tr",
    "troopjs-utils/grep",
    "troopjs-utils/uri",
    "troopjs-core/widget/application",
    "troopjs-core/route/router",
    "troopjs-core/remote/ajax"
], function ApplicationModule($, tDeferred, when, tr, grep, URI, Application, tRouter, Ajax) {
    "use strict";
    var SERVICES = [tRouter($(window))];

    /**
     * Forwards signals to services
     * @param signal Signal
     * @param deferred tDeferred
     * @returns me
     */
    function forward(signal, deferred) {
        var me = this;

        var services = tr.call(SERVICES, function (service, index) {
            return tDeferred(function (dfd) {
                service.signal(signal, dfd);
            });
        });

        if (deferred) {
            when.apply($, services).then(deferred.resolve, deferred.reject, deferred.notify);
        }

        me.publish("application/signal/" + signal, deferred);

        return me;
    }

    return Application.extend({
        "sig/initialize" : forward,
        "sig/finalize" : forward,
        "sig/start" : forward,
        "sig/stop" : forward
    });
});