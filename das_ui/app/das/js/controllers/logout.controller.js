/*(function () {*/
    'use strict';
    
    dasApplication.controller("logoutController", logoutController);
    function logoutController($scope,logoutService) {
    	var vm = this;
    	vm.logout = logout;
    	var logout = function(){
    		logoutService.logout();
    	};
    	logout();
        
    }
/*}());*/
