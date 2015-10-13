'use strict';

angular.module('bahmni.common.displaycontrol.bacteriologyresults')
    .directive('bacteriologyResultsControl', ['bacteriologyResultsService', '$q','spinner', '$filter','$translate',
        function (bacteriologyResultsService, $q, spinner, $filter) {
            var controller = function($scope){

                if ($scope.config.showHeader === null || $scope.config.showHeader === undefined) {
                    $scope.config.showHeader = true;
                }

                var includeAllObs = true;
                var getBacteriologyResults = function () {
                    var params = {
                        patientUuid:$scope.patient.uuid,
                        scope: $scope.scope,
                        conceptNames:$scope.config.conceptNames,
                        includeObs:includeAllObs
                    };
                    return bacteriologyResultsService.getBacteriologyResults(params).then(function (response) {
                        $scope.bahmniObservations = response.data;
                    });
                };
                var init = function() {
                    return getBacteriologyResults().then(function(){
                        var results = [];
                        _.forEach($scope.bahmniObservations, function(observation){
                            _.forEach(observation.groupMembers,function(testObs){
                               if(testObs.concept.name=="Bacteriology Results"){
                                   results.push(testObs);
                               }
                            });

                        });
                        $scope.results = results;
                        if (_.isEmpty($scope.bahmniObservations)) {
                            $scope.noObservationsMessage = $scope.section.translationKey;
                        }
                        else{
                            $scope.bahmniObservations[0].isOpen = true;
                        }
                    });
                };
                $scope.getTitle = function(observation){
                    return observation.conceptName + " on " + $filter('bahmniDateTime')(observation.observationDate) + " by " + observation.provider;
                };

                $scope.toggle= function(element){
                    element.isOpen = !element.isOpen;
                };

                $scope.dialogData = {
                    "patient": $scope.patient,
                    "section": $scope.section
                };

                $scope.isClickable= function(){
                    return $scope.isOnDashboard ;
                };

                $scope.hasTitleToBeShown = function() {
                    return !$scope.isClickable() && $scope.getSectionTranslationKey();
                };

                $scope.message = Bahmni.Common.Constants.messageForNoFulfillment;

                $scope.getSectionTranslationKey = function(){
                    return $scope.section.translationKey;
                };

                spinner.forPromise(init());
            };
            return {
                restrict:'E',
                controller: controller,
                templateUrl:"../common/displaycontrols/bacteriologyresults/views/bacteriologyResultsControl.html",
                scope:{
                    patient:"=",
                    section:"=",
                    observationUuid:"=",
                    config:"=",
                    isOnDashboard:"=",
                    visitUuid:"="
                }
            }
        }]);
