(function () {
    'use strict';

    angular
        .module('todomvc')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$rootScope', 'HttpService', 'UserService','LocalStorageService'];
    function AuthenticationService($http,  $rootScope, HttpService, UserService,LocalStorageService,$location) {
        var service = {};

        service.Login = Login;
        service.resetPassword = resetPassword;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
        service.checkLogin = checkLogin;
        service.getLoggedInUser = getLoggedInUser;
        service.logout = logout;

        return service;

        function checkLogin (){
            if (LocalStorageService.getLoggedInUser()) {
                return true;
            } else {
                return false;
            }
        }
        function Login(email, password, callback) {

            /* Dummy authentication for testing, uses $timeout to simulate api call
             ----------------------------------------------*/
                var response;

                UserService.GetByUsername(email,password)
                    .then(function (response) {
                        if (response.data.status) {

                            UserService.setUsers(response.data);
                            response = { success: true,user:response.data.user };
                        } else {
                            response = { success: false, message: 'email or password is incorrect' };
                        }
                        callback(response);
                    },function(e){
                        response = { success: false, message: 'email or password is incorrect' };
                        callback(response)
                    });

        }

        function SetCredentials(user) {
            if (user) {
                LocalStorageService.setLoggedInUser(user);

                $rootScope.globals = {
                    currentUser: user
                };
                // set default auth header for http requests
                $http.defaults.headers.common['Authorization'] = 'Basic ' + user.auth_token;

                // store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
                var cookieExp = new Date();
                cookieExp.setDate(cookieExp.getDate() + 7);
            }
        }

        function resetPassword(email,cb) {
            HttpService.forgotPassword(email).then(function(responce){
                console.log(responce)
                cb(responce.data)
            }, function(e){
                cb(e.data)
            });


        }

        function getLoggedInUser (){
         var user = LocalStorageService.getLoggedInUser();
         if (user) {
             return user;
         } else {
             return null;
         }
        }

        function logout() {
            ClearCredentials();
        }

        function ClearCredentials() {
            console.log("LOGOUT")
            LocalStorageService.removeLoggedInUser()
            $rootScope.globals = {};
            $http.defaults.headers.common.Authorization = 'Basic';
        }
    }


})();
