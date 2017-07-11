'use strict';
    
    dasApplication.factory("diseasesService", diseasesService);
    function diseasesService($http,__env,$window) {
           

		var service = {
		       getAllDiseases: getAllDiseases,
		       getAllDepartment: getAllDepartment,
		       getAllSpecializations: getAllSpecializations,
		       /*getAllSpecializationByDepartment: getAllSpecializationByDepartment,*/
		       create:create,
		       update:update,
		       deleteRow:deleteRow
            
          },url = __env.baseUrl + __env.context
    	 return service;
    	 function getAllDiseases(){
    			return $http.get(url + "/diseases/readAll");
    		}
    	
    	 function getAllDepartment(){
    			return $http.get(url + "/departments/readAll");
    		}

		/*function getAllSpecializationByDepartment(departmentId) {
				return $http.get(url + "/specializations/readAllById?id="+departmentId);
			}*/

    		 function getAllSpecializations(){
    			return $http.get(url + "/specializations/readAll");
    		}
    	 function create(jsonData) {
				return $http({
					url : url + '/diseases/create',
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
					url : url + '/diseases/update',
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
    				url : url + '/diseases/delete?id='+data,
    				method : "POST"
    			}).then(function(response) {
    				// success
    			}, function(response) { // optional
    				// failed
    			});
    		}
            }
    