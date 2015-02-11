'use strict';

Bahmni.Common.DisplayControl.Dashboard = function (config) {

    this.sections = _.map(config.sections, Bahmni.Common.DisplayControl.Dashboard.Section.create);

    console.log(this.sections);

    this.getSectionByName = function (name) {
        return _.find(this.sections, function (section) {
                return section.name === name;
            }) || {};
    };

    this.getDiseaseTemplateSections = function () {
        return _.rest(this.sections, function (section) {
            return section.name !== "diseaseTemplate";
        });
    };

    this.getDashboardSections = function (diseaseTemplates) {
        var sectionsToBeDisplayed = _.filter(this.sections, function (section) {
            return section.name !== "diseaseTemplate" || _.find(diseaseTemplates, function (diseaseTemplate) {
                    return diseaseTemplate.name === section.templateName && diseaseTemplate.obsTemplates.length > 0;
                });
        });
        return _.map(sectionsToBeDisplayed, Bahmni.Common.DisplayControl.Dashboard.Section.create);
    };
};

Bahmni.Common.DisplayControl.Dashboard.create = function (config) {
    return new Bahmni.Common.DisplayControl.Dashboard(config);
};