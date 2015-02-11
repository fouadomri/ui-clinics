'use strict';

Bahmni.Clinical.DashboardConfig = function (config) {

    var self = this;
    this.dashboards = _.map(config, Bahmni.Common.DisplayControl.Dashboard.create);
    this.openDashboards = [];

    this.getDefaultDashboard = function () {
        this.currentDashboard = _.find(this.dashboards, function (dashboard) {
            return dashboard.default;
        });
        return this.currentDashboard;
    };

    this.findOpenDashboard = function (dashboard) {
        return !_.findWhere(this.openDashboards, {'dashboardName': dashboard.dashboardName});
    };

    this.getUnOpenedDashboards = function () {
        return _.filter(this.dashboards, function (dashboard) {
            return self.findOpenDashboard(dashboard);
        })
    };

    this.getCurrentDashboard = function () {
        return this.currentDashboard;
    };

    this.switchDashboard = function (dashboard) {
        this.currentDashboard = dashboard;

        if (this.findOpenDashboard(dashboard)) {
            this.openDashboards.push(dashboard);
        }
    };

    this.closeDashboard = function (dashboard) {
        _.remove(this.openDashboards, {'dashboardName': dashboard.dashboardName});
    };

    this.getSectionByName = function (name) {
        return this.currentDashboard.getSectionByName(name);
    };

    this.isCurrentDashboard = function (dashboard) {
        return this.currentDashboard && this.currentDashboard.dashboardName === dashboard.dashboardName;
    };

    this.getDiseaseTemplateSections = function () {
        return this.currentDashboard.getDiseaseTemplateSections();
    };

    this.getDashboardSections = function (diseaseTemplates) {
        return this.currentDashboard.getDashboardSections(diseaseTemplates);
    };

    this.showTabs = function () {
        return this.dashboards.length > 1;
    };

    this.showPrint = function () {
        return !_.isEmpty(this.currentDashboard.printing);
    };

    this.getPrintConfigForCurrentDashboard = function () {
        return this.getCurrentDashboard().printing;
    }
};