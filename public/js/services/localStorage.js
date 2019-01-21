(
    function() {
        'use strict';

        var app = angular.module('todomvc')
            .service('LocalStorageService', LocalStorageService);

        /* @ngInject */
        function LocalStorageService() {

            var localStorageService = {};

            localStorageService.setLoggedInUser = function(user) {
                localStorage.setItem("loggedin_user", JSON.stringify(user));
            }

            localStorageService.getAccessToken = function() {
                var user = localStorage.getItem('loggedin_user');

                if(user) {
                    return JSON.parse(localStorage.getItem('loggedin_user')).auth_token;
                } else {
                    return undefined;
                }
            }

            function getUser() {
                var user = localStorage.getItem('loggedin_user');

                if(user) {
                    return JSON.parse(localStorage.getItem('loggedin_user'));
                } else {
                    return undefined;
                }
            }

            localStorageService.getUser = function() {
                return getUser();
            }
            localStorageService.getLoggedInUser = function() {
                var user = localStorage.getItem("loggedin_user");
                if(user) {
                    return JSON.parse(user);
                } else {
                    return undefined;
                }
            }

            localStorageService.removeLoggedInUser = function() {
                localStorage.removeItem('loggedin_user');
            }

            return localStorageService;
        }
    }
)();
