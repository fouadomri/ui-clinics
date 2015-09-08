'use strict';

angular.module('bahmni.reports')
    .controller('DashboardController', ['$scope', 'appService', 'reportService', 'FileUploader','messagingService', function ($scope, appService, reportService, FileUploader, messagingService) {
        $scope.uploader = new FileUploader({
            url: Bahmni.Common.Constants.uploadReportTemplateUrl,
            removeAfterUpload: true,
            autoUpload: true
        });

        $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
            fileItem.report.reportTemplateLocation = response;
        };

        appService.loadConfig('reports.json').then(function (response) {
            $scope.reportsRequiringDateRange = _.values(response).filter(function(report) {
               return !(report.config && report.config.dateRangeRequired === false);
            });
            $scope.reportsNotRequiringDateRange = _.values(response).filter(function(report) {
                return (report.config && report.config.dateRangeRequired === false);
            });
            $scope.reportsDefined = _.values(response).length > 0;
        });

        $scope.default = {reportsRequiringDateRange: {}, reportsNotRequiringDateRange: {}};

        $scope.reportsDefined = true;

        $scope.showPopUpIfCustomExcel = function(report){
            if(report.responseType == 'application/vnd.ms-excel-custom') {
                document.getElementById('fileUpload').click()
            }
        };

        $scope.setDefault = function (item, header) {
            var setToChange = header === 'reportsRequiringDateRange'? $scope.reportsRequiringDateRange: $scope.reportsNotRequiringDateRange;
            setToChange.forEach(function (report) {
                report[item] = $scope.default[header][item];
            });
        };

        $scope.runReport = function (report) {
            if(!report.reportTemplateLocation){
               messagingService.showMessage("error", "Macro template should be selected for generating report: "+report.name);
                return;
            }
            report.startDate = Bahmni.Common.Util.DateUtil.getDateWithoutTime(report.startDate);
            report.stopDate = Bahmni.Common.Util.DateUtil.getDateWithoutTime(report.stopDate);
            reportService.generateReport(report);
            report.reportTemplateLocation = undefined;
            report.responseType ="text/html";
            var element = angular.element("inputFileUpload"+report.name);
            console.log(element);
            element.val(null);

        };
    }]);
