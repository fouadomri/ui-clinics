'use strict';

angular.module('bahmni.registration').factory('initialization',
    ['$rootScope', '$q', 'configurations', 'authenticator', 'appService', 'spinner', 'Preferences', '$bahmniCookieStore',
    function ($rootScope, $q, configurations, authenticator, appService, spinner, preferences, $bahmniCookieStore) {
        var getConfigs = function() {
            var configNames = ['encounterConfig', 'patientAttributesConfig', 'identifierSourceConfig', 'addressLevels', 'genderMap', 'relationshipTypeConfig','relationshipTypeMap'];
            return configurations.load(configNames).then(function () {
                var mandatoryPersonAttributes = appService.getAppDescriptor().getConfigValue("mandatoryPersonAttributes");
                var patientAttributeTypes = new Bahmni.Registration.PatientAttributeTypeMapper().mapFromOpenmrsPatientAttributeTypes(configurations.patientAttributesConfig(), mandatoryPersonAttributes);
                $rootScope.regEncounterConfiguration = angular.extend(new Bahmni.Registration.RegistrationEncounterConfig(), configurations.encounterConfig());
                $rootScope.encounterConfig = angular.extend(new EncounterConfig(), configurations.encounterConfig());
                $rootScope.patientConfiguration = new Bahmni.Registration.PatientConfig(patientAttributeTypes.personAttributeTypes, configurations.identifierSourceConfig(), appService.getAppDescriptor().getConfigValue("patientInformation"));

                $rootScope.addressLevels = configurations.addressLevels();
                $rootScope.fieldValidation = appService.getAppDescriptor().getConfigValue("fieldValidation");
                $rootScope.genderMap = configurations.genderMap();
                $rootScope.relationshipTypeMap = configurations.relationshipTypeMap();
                $rootScope.relationshipTypes = configurations.relationshipTypes();
            });
        };

        var initOffline = function () {

            $rootScope.offline = false;

            $rootScope.getAppPlatform = function () {
                return $bahmniCookieStore.get(Bahmni.Common.Constants.platform);
            };

            $rootScope.isOfflineApp = function () {
                return $rootScope.getAppPlatform() === Bahmni.Common.Constants.platformType.chrome;
            };

            Offline.options = {
                game: false,
                checkOnLoad: true
            };

            Offline.on('up', function () {
                console.log("Internet is up.");
                $rootScope.offline = false;
                $rootScope.$broadcast('offline', $rootScope.offline);

            });
            Offline.on('down', function () {
                console.log("Internet is down.");
                $rootScope.offline = true;
                $rootScope.$broadcast('offline', $rootScope.offline);

            });
            var checkOfflineStatus = function () {
                if (Offline.state === 'up') {
                    Offline.check();
                }
            };
            setInterval(checkOfflineStatus, 5000);
        };

        var loadValidators = function (baseUrl,contextPath) {
                Bahmni.Common.Util.DynamicResourceLoader.includeJs(baseUrl + contextPath + '/fieldValidation.js');
        };

        var initApp = function() {
            return appService.initApp('registration', {'app': true, 'extension' : true });
        };

        var getIdentifierPrefix = function() {
            preferences.identifierPrefix = appService.getAppDescriptor().getConfigValue("defaultIdentifierPrefix");
        };

        var initAppConfigs = function(){
            $rootScope.registration = $rootScope.registration ||{};
            getIdentifierPrefix();
        };

        var mapRelationsTypeWithSearch = function() {
            var relationshipTypeMap = $rootScope.relationshipTypeMap || {};
            if(!relationshipTypeMap.provider) {
                return "patient";
            }
            $rootScope.relationshipTypes.forEach(function(relationshipType) {
                relationshipType.searchType = (relationshipTypeMap.provider.indexOf(relationshipType.aIsToB) > -1) ? "provider":"patient";
            });
        };

        return spinner.forPromise(authenticator.authenticateUser().then(initApp).then(getConfigs).then(initAppConfigs).then(initOffline)
            .then(mapRelationsTypeWithSearch)
            .then(loadValidators(appService.configBaseUrl(), "registration")));
    }]
);