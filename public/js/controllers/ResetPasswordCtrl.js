(function () {
    'use strict';

    angular
        .module('todomvc')
        .controller('ResetPasswordController', ResetPasswordController);

    ResetPasswordController.$inject = ['$location', 'AuthenticationService', 'FlashService'];
    function ResetPasswordController($location, AuthenticationService, FlashService) {
        if(AuthenticationService.checkLogin()) {
            $location.path('/');
        }

        var vm = this;

        vm.resetPassword = resetPassword;

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        function resetPassword() {
            vm.dataLoading = true;
            AuthenticationService.resetPassword(vm.email, function (response) {
                console.log(response)
                if (response && response.status ) {
                    FlashService.Success("Reset Password email has been sent!");
                    $location.path('/login');
                } else {
                    console.log(response)
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
        };
    }

})();
