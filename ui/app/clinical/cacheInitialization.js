'use strict';

angular.module('bahmni.clinical')
    .factory('cacheInitialization', ['$rootScope', '$cacheFactory', function ($rootScope, $cacheFactory) {
        return function(name){
            console.log("Hey i have removed all", name);
            var bahmniCacheFactory = $cacheFactory.get(name);
            bahmniCacheFactory.removeAll();
        }
    }]
);