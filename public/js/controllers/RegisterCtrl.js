/**
 * Created by ali on 1/20/19.
 */
(function () {
    'use strict';

    angular
        .module('todomvc')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['UserService', '$location', '$rootScope', 'FlashService','AuthenticationService'];
    function RegisterController(UserService, $location, $rootScope, FlashService,AuthenticationService) {
        var vm = this;

        if(AuthenticationService.checkLogin()) {
            $location.path('/');
        }

        vm.register = register;

        function register() {
            vm.dataLoading = true;
            UserService.Create(vm.user)
                .then(function (response) {
                    console.log(response)
                    if (response.data.status) {
                        FlashService.Success('Registration successful', true);
                        $location.path('/login');
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                },function(e){
                    FlashService.Error(e.data.message);
                    vm.dataLoading = false;
                });
        }
    }

})();
