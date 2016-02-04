'use strict';

var fs = require('fs');
var angular = require('angular');

module.exports = function ($scope, $rootScope, $mdDialog, $mdToast, $translate, Patient) {

    // init top bar
    $translate('PATIENTS').then(function (translation) {
        $rootScope.$broadcast('title', translation);
        $rootScope.$broadcast('allowSearch', true);
    });

    _load();

    $scope.add = function () {
        $scope.showDetails(new Patient(), false);
    };

    $scope.update = function (entity) {
        $scope.showDetails(entity, true);
    };

    $scope.isFiltering = false;
    // search word from search bar
    $scope.$on('search', function (event, query) {
        $scope.isFiltering = query ? true : false;
        _load(query);
    });

    $scope.showDetails = function (entity, isEntityUpdate) {
        var details = {
            template: fs.readFileSync(__dirname + '/patient.details.html'),
            controller: DetailsDialogController,
            locals: {
                entity: entity,
                isEntityUpdate: isEntityUpdate
            }
        };

        $mdDialog.show(details)
            .then(function (result) {
                // all outputs
                if (result && result.reload) {
                    _load();
                }
            }, function () {
                // 'esc' pressed
                _load();
            }).finally(function () {
                // clean up
                details = undefined;
            });
    };

    function DetailsDialogController($scope, $mdDialog, $mdToast, entity, isEntityUpdate) {

        $scope.entity = angular.copy(entity);

        // 'viewMode' controls the change between view and edit mode
        // if we are updating then starts in 'view only' mode
        // if is an add then starts in 'editing' mode (allow edit)
        $scope.viewMode = isEntityUpdate;
        $scope.isEntityUpdate = isEntityUpdate;
        $scope.wasEntityUpdated = false;
        $scope.isUpdating = false;

        $scope.toggleViewMode = function () {
            $scope.viewMode = !$scope.viewMode;
        };

        $scope.cancel = function () {
            if (isEntityUpdate) {
                // update
                $scope.clean();
                $scope.toggleViewMode();
            } else {
                // add
                $scope.close($scope.wasEntityUpdated);
            }
        };

        $scope.clean = function () {
            // retrieve the original entity
            $scope.entity = angular.copy(entity);
        };

        $scope.save = function () {
            if (isEntityUpdate) {
                _update();
            } else {
                _add();
            }
        };

        $scope.delete = function () {
            _delete();
        };

        $scope.close = function (reload) {
            var result = {reload: reload};
            $mdDialog.hide(result);
        };

        function _add() {
            $translate(['ADDING', 'PATIENT_ADDED']).then(function (translations) {
                var addingToast = _simpleToast(translations.ADDING + '...', false);
                $scope.isUpdating = true;
                $scope.wasEntityUpdated = true;

                // UI sends a string. Need to convert to date before sending to BE
                $scope.entity.birthday = _convertStringToDate($scope.entity.birthday);

                $scope.entity.$save(function () {
                    $mdToast.hide(addingToast);
                    _simpleToast(translations.PATIENT_ADDED + '!', 3000);
                    $scope.close(true);
                }, function (error) {
                    $mdToast.hide(addingToast);
                    _errorToast(error, _add);
                });
            });
        }

        function _delete() {
            $translate(['REMOVING', 'PATIENT_REMOVED']).then(function (translations) {
                var deletingToast = _simpleToast(translations.REMOVING + '...', false);
                $scope.isUpdating = true;
                $scope.wasEntityUpdated = true;
                Patient.delete({id: $scope.entity.id}, function () {
                    $mdToast.hide(deletingToast);
                    _simpleToast(translations.PATIENT_REMOVED + '!', 3000);
                    $scope.close(true);
                }, function (error) {
                    $mdToast.hide(deletingToast);
                    _errorToast(error, _delete);
                });
            });
        }

        function _update() {
            $translate(['UPDATING', 'PATIENT_UPDATED']).then(function (translations) {
                var updatingToast = _simpleToast(translations.UPDATING + '...', false);
                $scope.isUpdating = true;
                $scope.wasEntityUpdated = true;
                $scope.toggleViewMode();

                // UI sends a string. Need to convert to date before sending to BE
                $scope.entity.birthday = _convertStringToDate($scope.entity.birthday);

                Patient.update({id: $scope.entity.id}, $scope.entity, function () {
                    $mdToast.hide(updatingToast);
                    _simpleToast(translations.PATIENT_UPDATED + '!', 3000);
                    $scope.isUpdating = false;
                }, function (error) {
                    $mdToast.hide(updatingToast);
                    _errorToast(error, _update);
                });
            });
        }

        /**
         * @param delay int in milliseconds or false if never hide the toast.
         * @returns toast object. Can be used to hide ($mdToast.hide()) if delay param is false (the toast will not hide itself).
         */
        function _simpleToast(message, delay) {
            var toast = $mdToast.simple()
                .content(message)
                .hideDelay(delay);
            $mdToast.show(toast);
            return toast;
        }
    }

    /**
     * Load entity.
     * @param filter optional filter
     * @private
     */
    function _load(filter) {
        $scope.isLoading = true;
        $scope.entities = Patient.query({filter: filter}, function () {
            $scope.isLoading = false;
        }, function (error) {
            $scope.entities = {};
            $scope.isLoading = false;
            _errorToast(error, _load);
        });
    }

    /**
     * Shows error toast
     * @param errorObj object to be logged for error trace
     * @param retry function when user click retry button
     * @private
     */
    function _errorToast(errorObj, retry) {
        if (errorObj) {
            console.warn(errorObj);
        }
        $translate(['SERVER_COMMUNICATION_ERROR', 'RETRY']).then(function (translations) {
            var toast = $mdToast.simple()
                .content(translations.SERVER_COMMUNICATION_ERROR)
                .action(translations.RETRY)
                .hideDelay(6000);
            $mdToast.show(toast).then(function (option) {
                if (option === 'ok') { // pressed RETRY
                    retry();
                }
            });
        });
    }

    /**
    * Converts a string date to a Date object.
    */
    function _convertStringToDate(strDate) {
        return new Date(strDate);
    }

};