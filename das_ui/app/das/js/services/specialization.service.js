'use strict';
    
    dasApplication.factory("specializationService", specializationService);
    function specializationService($http,__env,$window) {
           

		var service = {
		       getAllSpecialization: getAllSpecialization,
		       getAllDepartment : getAllDepartment,
		       create:create,
		       update:update,
		       deleteRow:deleteRow
            
          },url = __env.baseUrl + __env.context
    	 return service;
    	 function getAllSpecialization(){
    			return $http.get(url + "/specializations/readAll");
    		}
    	
    	 function getAllDepartment(){
    			return $http.get(url + "/departments/readAll");
    		}
    	

    	 function create(jsonData) {
				return $http({
					url : url + '/specializations/create',
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
					url : url + '/specializations/update',
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
    				url : url + '/specializations/delete?id='+data,
    				method : "POST"
    			}).then(function(response) {
    				// success
    			}, function(response) { // optional
    				// failed
    			});
    		}
            }
    