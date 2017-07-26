/*(function () {*/
    'use strict';
    
    dasApplication.controller("logoutController", logoutController);
    function logoutController($scope,logoutService,localstorage,$state) {
    	var vm = this;
    	vm.logout = logout;
    	var logout = function(){
            localstorage.setObject("loggedInUser",{});
    		//logoutService.logout();
                if(localstorage.getObject("loggedInUser").username == undefined){
                    $state.go("app.login");
                }
    	};
    	logout();
        
    }
/*}());*/
