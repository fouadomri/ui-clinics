'use strict';

angular.module('bahmni.clinical')
    .controller('BacteriologyController', ['$scope', '$rootScope', 'contextChangeHandler', 'spinner', 'conceptSetService', 'messagingService',
        function ($scope, $rootScope, contextChangeHandler, spinner, conceptSetService, messagingService) {
            $scope.newSamples = [];
            $scope.newSample = {"additionalAttributes": []};
            $scope.conceptSetName = "Tubercolises Specimen Concepot Set";
            var init = function () {
                spinner.forPromise(conceptSetService.getConceptSetMembers({
                    name: Bahmni.Clinical.Constants.labConceptSetName,
                    v: "custom:(uuid,setMembers:(uuid,name,conceptClass,setMembers:(uuid,name,conceptClass,setMembers:(uuid,name,conceptClass))))"}, true))
                    .then(function(response){
                        $scope.allSamples = response.data.results[0].setMembers;
                });
            };

            $scope.clearNewSample = function () {
                $scope.newSample = {"sample": {"additionalAttributes": []}};
            };

            var isFormCleared = function () {
                return $scope.newSample == undefined || (!$scope.newSample.dateCollected && !$scope.newSample.type && $scope.newSample.additionalAttributes.length == 0);
            };

            $scope.addSample = function () {
                console.log($scope.newSample);
                $scope.newSamples = $scope.newSample;
                $scope.consultation.extentions = {"mdrtb.specimen": $scope.newSamples};
                $scope.clearNewSample();
            };

            $scope.editSample = function (sample) {
                if (isFormCleared()) {
                    $scope.newSample.sample = sample;
                    $scope.newSamples = _.without($scope.newSamples, sample);
                } else {
                    messagingService.showMessage('formError', Bahmni.Clinical.Constants.errorMessages.incompleteForm);
                }
            };

            $scope.removeSample = function(sample){
                $scope.newSamples = _.without($scope.newSamples, sample);
            };

            init();
        }
    ]);
