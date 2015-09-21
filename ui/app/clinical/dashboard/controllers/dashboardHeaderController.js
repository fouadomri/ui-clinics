'use strict';

angular.module('bahmni.clinical')
    .controller('DashboardHeaderController', ['$window', '$scope', 'clinicalAppConfigService', 'patientContext', 'visitHistory', 'clinicalDashboardConfig','appService','ngDialog','visitSummary','spinner','diseaseTemplateService','$state',
        function ($window, $scope, clinicalAppConfigService, patientContext, visitHistory, clinicalDashboardConfig, appService, ngDialog, visitSummary, spinner, diseaseTemplateService, $state) {

            $scope.patient = patientContext.patient;
            $scope.visitHistory = visitHistory;

            $scope.consultationBoardLink = clinicalAppConfigService.getConsultationBoardLink();
            $scope.showControlPanel = false;
            $scope.clinicalDashboardConfig = clinicalDashboardConfig;

            $scope.openConsultationInNewTab = function () {
                $window.open('#' + $scope.consultationBoardLink, '_blank');
            };

            $scope.showDashboard = function (dashboard) {
                if (!clinicalDashboardConfig.isCurrentTab(dashboard)) {
                    $scope.$parent.$parent.$broadcast("event:switchDashboard", dashboard);
                }
            };

            $scope.printDashboard = function () {
                $scope.$parent.$parent.$broadcast("event:printDashboard", clinicalDashboardConfig.currentTab.printing);
            };

            $scope.allowConsultation = function(){
                return appService.getAppDescriptor().getConfigValue('allowConsultationWhenNoOpenVisit');
            };

            $scope.closeDashboard = function (dashboard) {
                clinicalDashboardConfig.closeTab(dashboard);
                $scope.$parent.$parent.$broadcast("event:switchDashboard", clinicalDashboardConfig.currentTab);
            };

            $scope.closeAllDialogs = function() {
                $scope.myState = true;
                ngDialog.closeAll();
            };

            $scope.activeVisit = $scope.visitHistory.activeVisit;
            $scope.activeVisitData = {};
            $scope.obsIgnoreList = clinicalAppConfigService.getObsIgnoreList();
            $scope.clinicalDashboardConfig = clinicalDashboardConfig;
            $scope.visitSummary = visitSummary;

            $scope.$on("event:switchDashboard", function (event, dashboard) {
                $scope.init(dashboard);
            });

            $scope.$on("event:printDashboard", function (event) {
                printer.printFromScope("dashboard/views/dashboardPrint.html", $scope);
            });

            $scope.init = function (dashboard) {
                clinicalDashboardConfig.switchTab(dashboard);
                return diseaseTemplateService.getLatestDiseaseTemplates($scope.patient.uuid, clinicalDashboardConfig.getDiseaseTemplateSections())
                    .then(function (diseaseTemplates) {
                        $scope.diseaseTemplates = diseaseTemplates;
                        $scope.dashboard = Bahmni.Common.DisplayControl.Dashboard.create(dashboard || {});
                        $scope.sectionGroups =  $scope.dashboard.getSections($scope.diseaseTemplates);
                        $scope.currentDashboardTemplateUrl = $state.current.views.content.templateUrl;
                    });
            };

            spinner.forPromise($scope.init(clinicalDashboardConfig.currentTab));
        }]);
