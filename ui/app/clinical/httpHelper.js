'use strict';

angular.module('bahmni.common.conceptSet')
    .factory('httpHelper', ['$rootScope', '$http', function ($rootScope, $http) {
        var get = function (url, config) {
            var promise = null;
            var key = extractUrl(url, config);
            console.log("$rootScope.bahmniCacheFactory before:", $rootScope.bahmniCacheFactory);
            var cachedResponse = !_.isEmpty($rootScope.bahmniCacheFactory) ? $rootScope.bahmniCacheFactory.get(key) : $rootScope.bahmniCacheFactory;
            if(cachedResponse){
                return cachedResponse;
            }
            promise = $http.get(url, config);
            $rootScope.bahmniCacheFactory.put(key, promise);
            console.log("$rootScope.bahmniCacheFactory after:", $rootScope.bahmniCacheFactory.get(key));
            return promise;
        };

        var post = function (url, data, config) {
            console.log("inside httpHelper post: ", url);
            //return null;
            return $http.post(url, data, config);
        };

        var extractUrl = function(url, config) {
            var urlString = "";
            if(!_.isEmpty(config.params)){
                _.each(config.params, function(value, key) {
                    urlString += key + "=" + value + "&"
                });
            }
            urlString = urlString.substring(0, urlString.length - 1);
            return url + "?" + urlString
        };

        return {
            get: get,
            post: post
        };
    }
]);