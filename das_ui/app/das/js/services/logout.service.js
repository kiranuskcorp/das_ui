'use strict';
    dasApplication.factory("logoutService", logoutService);
    function logoutService(__env,$window) {
       var service = {
		        logout: logout
       };
    	  return service;
       function logout() {
           $window.location.replace(__env.baseUrl+__env.context+__env.logoutPath);
		   }
	    
    }

