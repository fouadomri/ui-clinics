'use strict';

Bahmni.Common.DisplayControl.Dashboard.Section = function (section) {
    angular.extend(this, section);
    this.data = section.data || {};
    this.isObservation = section.isObservation || false;
    this.patientAttributes = section.patientAttributes || [];
    if (this.isObservation === true) {
        this.viewName = "common/displaycontrol/dashboard/sections/observationSection.html";
    } else if (this.name == "disposition") {
        this.viewName = "common/displaycontrol/dashboard/sections/observationSection.html";
    } else {
        this.viewName = "dashboard/views/dashboardSections/" + section.name + ".html";
    }
    console.log(section);
    console.log(this.viewName);
};

Bahmni.Common.DisplayControl.Dashboard.Section.create = function (section) {
    return new Bahmni.Common.DisplayControl.Dashboard.Section(section);
};
