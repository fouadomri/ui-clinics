'use strict';

angular.module('bahmni.clinical')
    .directive('visitsTable', ['patientVisitHistoryService', 'spinner', '$state', '$bahmniCookieStore', function (patientVisitHistoryService, spinner, $state, $bahmniCookieStore) {
        var controller = function ($scope,$rootScope) {
            spinner.forPromise(patientVisitHistoryService.getVisitHistory($scope.patientUuid).then(function (visitHistory) {
                $scope.visits = visitHistory.visits;
            }));
            
            $scope.openVisit = function(visit) {
                if($scope.$parent.closeThisDialog){
                    $scope.$parent.closeThisDialog("closing modal");
                }
                $state.go('patient.visit', {visitUuid: visit.uuid});
            };

            $scope.hasVisits = function () {
                return $scope.visits && $scope.visits.length > 0;
            };
            $scope.params = angular.extend(
                {
                    maximumNoOfVisits: 4,
                    title: "Visits"
                }, $scope.params);

            $scope.noVisitsMessage = "No Visits for this patient.";

            $scope.toggle = function(visit) {
                visit.isOpen = !visit.isOpen;
            };

            $scope.editConsultation = function(encounter){
                $bahmniCookieStore.remove(Bahmni.Common.Constants.retrospectiveEntryEncounterDateCookieName);
                $bahmniCookieStore.put(Bahmni.Common.Constants.retrospectiveEntryEncounterDateCookieName,  encounter.encounterDatetime, {path: '/', expires: 1});

                $bahmniCookieStore.remove(Bahmni.Common.Constants.grantProviderAccessDataCookieName);
                $bahmniCookieStore.put(Bahmni.Common.Constants.grantProviderAccessDataCookieName, encounter.provider, {path: '/', expires: 1});

                $rootScope.retrospectiveEntry = Bahmni.Common.Domain.RetrospectiveEntry.createFrom(Bahmni.Common.Util.DateUtil.getDate(encounter.encounterDatetime));

                $state.go('patient.consultation.conceptSet',{conceptSetGroupName: "observations", encounterUuid: encounter.uuid});
            }
        };
        return {
            restrict: 'E',
            controller: controller,
            templateUrl: "displaycontrols/allvisits/views/visitsTable.html",
            scope: {
                params: "=",
                patientUuid: "="
            }
        };
    }]);