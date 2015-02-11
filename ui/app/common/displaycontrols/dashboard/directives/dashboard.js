'use strict';

angular.module('bahmni.common.displaycontrol.dashboard')
    .directive('dashboard', ['$q', 'spinner',
        function ($q, spinner) {

            var controller = function ($scope) {
                $scope.sections = Bahmni.Common.DisplayControl.Dashboard.create($scope.config);
            };

            return {
                restrict: 'E',
                controller: controller,
                templateUrl: "../common/displaycontrols/dashboard/views/dashboard.html",
                scope: {
                    config: "=",
                    patient: "="
                }
            }
        }]);
