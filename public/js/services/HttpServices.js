(function () {
    'use strict';

    angular.module('todomvc')
        .service('HttpService', HttpService);

    /* @ngInject */
    function HttpService($http, LocalStorageService, FlashService) {

        var httpService = {};
        httpService.getAllTask = function () {
            return $http.get(window.location.origin + "/api/task", {
                headers: {
                    auth_token: LocalStorageService.getAccessToken(),
                    'Content-type': 'application/json'
                }
            });
        };
        httpService.create = function (data) {
            return $http({
                method: "POST",
                url: window.location.origin + "/api/task",
                data: data,
                headers: {
                    auth_token: LocalStorageService.getAccessToken(),
                    'Content-type': 'application/json'
                }
            });
        };
        httpService.update= function (id,data) {
            return $http({
                method: "PUT",
                url: window.location.origin + "/api/task/"+id,
                data: data,
                headers: {
                    auth_token: LocalStorageService.getAccessToken(),
                    'Content-type': 'application/json'
                }
            });
        };
        httpService.updateToken= function (data) {
            $http({
                method: "PUT",
                url: window.location.origin + "/api/update_token",
                data: data,
                headers: {
                    auth_token: LocalStorageService.getAccessToken(),
                    'Content-type': 'application/json'
                }
            });
        };
        httpService.remove= function (id) {
            return $http({
                method: "delete",
                url: window.location.origin + "/api/task/"+id,
                headers: {
                    auth_token: LocalStorageService.getAccessToken(),
                    'Content-type': 'application/json'
                }
            });
        };
        httpService.forgotPassword= function (email) {
            return $http({
                method: "POST",
                data: {email},
                url: window.location.origin + "/api/forgot-password",
                headers: {
                    'Content-type': 'application/json'
                }
            });
        };
        return httpService;

    }
})();
