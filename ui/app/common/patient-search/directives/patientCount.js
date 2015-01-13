'use strict';

angular.module('bahmni.common.patientSearch')
    .directive('patientCount', function (spinner, patientService, $rootScope, $interval) {
        var controller = function($scope) {

        };

        var link = function($scope,element,attrs){


            var promise;

            var cancelSchedule = function(){
                if(promise){
                    $interval.cancel(promise);
                    promise=null;
                }
            };

            var startSchedule = function(){
                if(!promise){
                    promise = $interval($scope.triggerFunction, $scope.refreshTime * 1000);
                }
            };

            $scope.$watch(function(){return $scope.search.searchParameter}, function(value) {
                if($scope.refreshTime > 0){
                    value ? cancelSchedule() : startSchedule();
                }
            });

            $scope.triggerFunction;

            $scope.$on('$destroy', function() {
                cancelSchedule();
            });
        };

        //var template = '<span>({{count}})</span>';

        return {
            restrict: 'A',
            controller: controller,
            link: link,
            scope: {
                refreshTime: "=",
                search: "=",
                triggerFunction: "&"
            }
            //template: template
        };
    });