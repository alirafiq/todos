(function () {
    'use strict';

    angular
        .module('todomvc')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService'];
    function LoginController($location, AuthenticationService, FlashService) {
        if(AuthenticationService.checkLogin()) {
            $location.path('/');
        }

        var vm = this;

        vm.login = login;

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.email, vm.password, function (response) {
                if (response.success && response.user) {
                    console.log(response)
                    AuthenticationService.SetCredentials(response.user);
                    $location.path('/');
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
        };
    }

})();
