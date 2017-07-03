'use strict';
    
    dasApplication.factory("departmentService", departmentService);
    function departmentService($http,__env,$window) {
           

		var service = {
		       getAllDepartments: getAllDepartments,
		       create:create,
		       update:update,
		       deleteRow:deleteRow
            
          },url = __env.baseUrl + __env.context
    	 return service;
    	 function getAllDepartments(){
    			return $http.get(url + "/departments/readAll");
    		}
    	
    	 function create(jsonData) {
				return $http({
					url : url + '/departments/create',
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
					url : url + '/departments/update',
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
    				url : url + '/departments/delete?id='+data,
    				method : "POST"
    			}).then(function(response) {
    				// success
    			}, function(response) { // optional
    				// failed
    			});
    		}
            }
    