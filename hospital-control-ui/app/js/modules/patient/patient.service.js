'use strict';

var angular = require('angular');
var app = angular.module('app');

module.exports = app.factory('Patient', ['$resource', function ($resource) {
    return $resource('/hospital-control/patient/:id', {id: '@_id'}, {
        update: {
            method: 'PUT'
        }
    });
}]);
