'use strict';

var RESPONSE_DELAY = 1000; // 1s

var angular = require('angular');
require('../../app/js/main.js'); // app
require('angular-mocks'); // ngMockE2E

var requires = [
    'app',
    'ngMockE2E'
];

angular.module('app-mock', requires).run(function ($httpBackend) {

    $httpBackend.whenGET(/^\/services\/dashboard/).respond(function (method, url) {
        return [200, {}];
    });

    $httpBackend.whenPOST('/services/dashboard').respond(function (method, url, data) {
        return [200, {}];
    });

    $httpBackend.whenPUT(/^\/services\/dashboard\/\d+$/).respond(function (method, url, data) {
        return [200, {}];
    });

    $httpBackend.whenDELETE(/^\/services\/dashboard\/\d+$/).respond(function (method, url) {
        return [200, {}];
    });

}).config(function ($provide) {
    // simula um delay na resposta http
    // https://endlessindirection.wordpress.com/2013/05/18/angularjs-delay-response-from-httpbackend/
    $provide.decorator('$httpBackend', function ($delegate) {
        var proxy = function (method, url, data, callback, headers) {
            var interceptor = function () {
                var _this = this,
                    _arguments = arguments;
                setTimeout(function () {
                    callback.apply(_this, _arguments);
                }, RESPONSE_DELAY);
            };
            return $delegate.call(this, method, url, data, interceptor, headers);
        };
        for (var key in $delegate) {
            proxy[key] = $delegate[key];
        }
        return proxy;
    });
});

