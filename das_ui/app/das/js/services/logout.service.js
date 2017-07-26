'use strict';
    dasApplication.factory("logoutService", logoutService);
    function logoutService(__env,$window,$location) {
       var service = {
		        logout: logout
       };
    	  return service;
       function logout() {
         $window.localStorage.clear();
        $location.path('/login');
		   }
	    
    }

