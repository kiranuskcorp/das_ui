'use strict';
    dasApplication.factory("logoutService", logoutService);
    function logoutService($http, $window, __env) {
           var service = {
              validate : validate
          }, url = __env.baseUrl + __env.context
          return service;


    function validate(data) {
    return $http({
      url : url + '/logout',
      method : "POST",
      data : data
    }).then(function(response) {
      console.log(response);
      // success
    }, function(response) { // optional
      // failed
    });
  }
		   
	    
    }

