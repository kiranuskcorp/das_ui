'use strict';
    
    dasApplication.factory("userService", userService);
    function userService($http,__env,$window) {
           

		var service = {
		       getAllUsers: getAllUsers,
		       create:create,
		       update:update,
		       deleteRow:deleteRow
            
          },url = __env.baseUrl + __env.context
    	 return service;
    	 function getAllUsers(){
    			return $http.get(url + "/users/readAll");
    		}
    	
    	 function create(jsonData) {
				return $http({
					url : url + '/users/create',
					method : "POST",
					data : jsonData
				}).then(function(response) {
					// success
				}, function(response) { // optional
					// failed
				});
			}
    	 
    	 function update(jsonData) {
				return $http({
					url : url + '/users/update',
					method : "POST",
					data : jsonData
				}).then(function(response) {
					// success
				}, function(response) { // optional
					// failed
				});
			}
    	 
    	 function deleteRow(data) {
    			return $http({
    				url : url + '/users/delete?id='+data,
    				method : "POST"
    			}).then(function(response) {
    				// success
    			}, function(response) { // optional
    				// failed
    			});
    		}
            }
    