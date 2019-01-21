(function () {
    'use strict';

    angular
        .module('todomvc')
        .factory('UserService', UserService);

    UserService.$inject = ['$timeout', '$filter', '$q','$http','LocalStorageService'];
    function UserService($timeout, $filter, $q,$http,LocalStorageService) {

        var service = {};
        var login = {}
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.setUsers = setUsers;


        return service;

        function GetAll() {
            var deferred = $q.defer();
            deferred.resolve(getUsers());
            return deferred.promise;
        }

        function GetById(email) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getUsers(), { email: email});
            var user = filtered.length ? filtered[0] : null;
            deferred.resolve(user);
            return deferred.promise;
        }

        function GetByUsername(email , password) {
            if (LocalStorageService.getUser() && LocalStorageService.getUser().email==email){
                var deferred = $q.defer();
                deferred.resolve(JSON.parse($localStorage.users.daa));
                return deferred.promise;
            } else {
                return $http({
                    url: "/api/login",
                    method: "POST",
                    data: {email: email, password: password}
                })
            }
        }

        function Create(user) {

            return $http({
                url:"/api/signup",
                method:"POST",
                data:user
            });
        }

        function Update(user) {
            var deferred = $q.defer();

            var users = getUsers();
            for (var i = 0; i < users.length; i++) {
                if (users[i].id === user.id) {
                    users[i] = user;
                    break;
                }
            }
            setUsers(users);
            deferred.resolve();

            return deferred.promise;
        }

        function Delete(id) {
            var deferred = $q.defer();

            var users = getUsers();
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                if (user.id === id) {
                    users.splice(i, 1);
                    break;
                }
            }
            setUsers(users);
            deferred.resolve();

            return deferred.promise;
        }

        // private functions
        function setUsers(user) {
            console.log(user.user)
            LocalStorageService.setLoggedInUser(user.user);
        }
    }
})();
