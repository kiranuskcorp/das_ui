/*(function() {*/
'use strict';
dasApplication.controller("hospitalController", hospitalController);

function hospitalController($scope, hospitalService, Excel, $state, $mdDialog,
		$mdToast, $timeout, $mdSidenav, $log,$rootScope) {
	var self = {
		init : init
	};
	function init() {
		$rootScope.currentController = 'Hospital';
		$scope.currentPage = 'Create';
		$rootScope.currentDataEnable = true;
		var current = $state.current.name;
		$scope.currentState = current.split(/[\s.]+/);
		$scope.currentRoute = $scope.currentState[$scope.currentState.length - 1];
		$scope.customFullscreen = false;
		$scope.updatePage = false;
		$scope.hospitalsData = [];
		$scope.collection = [];
		$scope.currentDate = new Date();
		$scope.selected = [];
		$scope.headerEnable = {};
		$scope.exportData = [];	
		$scope.record = {
			
		};

		
		$scope.cancelRecord = function(){
			$mdSidenav('right').close().then(function() {
				$log.debug("close RIGHT is done");
			});
		}	
		
		$scope.loading = true;

		hospitalService.getAllDepartments().then(function(response) {
            $scope.departments = response.data;
            console.log($scope.departments);
        });
        hospitalService.getAllFacilities().then(function(response) {
            $scope.facilities = response.data;
        });
        hospitalService.getAllStates().then(function(response) {
            $scope.states = response.data;
        });
        hospitalService.getAllTimes().then(function(response) {
            $scope.times = response.data;
        });
		hospitalService.getAllHospitals().then(function(response) {
			console.log(response.data);
			$scope.hospitalsData = response.data;
			$scope.hospitalsLength = response.data.length;
			$rootScope.currentTableLength = 'Total Records:'+response.data.length;
			// console.log($scope.tasksData);
			$scope.hospitalsOptions = [ 200 , 300];
			$scope.hospitalPage = {
				pageSelect : true
			};
			$scope.query = {
				order : 'name',
				limit : 100,
				page : 1
			};
			$scope.loading = false;
		}, function(error) {
				alert("failed");
					$scope.loading=false;
		});		
		var deregisterListener = $rootScope.$on("CallHospitalMethod", function(){
			if ($rootScope.$$listeners["CallHospitalMethod"].length > 1) {
				            $rootScope.$$listeners["CallHospitalMethod"].pop();

        		}
           $scope.toggleRight();
           $scope.emptyForm();
        });       
 		var deregisterListener = $rootScope.$on("CallHospitalSearchMethod", function(event, args) {
            if ($rootScope.$$listeners["CallHospitalSearchMethod"].length > 1) {
                $rootScope.$$listeners["CallHospitalSearchMethod"].pop();
            }            
            $scope.filterByText = args.text;
        });
	}
	init();

	$scope.getCitiesByState = function(state){
		hospitalService.getAllCities(state).then(function(response) {
            $scope.cities = response.data;
        });

	}



		$scope.saveRecord = function() {
			$scope.availableFacilitiesToSave = JSON.stringify($scope.record.availableFacilities);
			$scope.availableFacilitiesToSave = JSON.stringify($scope.record.availableFacilities);
			//$scope.departmentIdToSave = JSON.stringify($scope.record.departmentId);
			delete $scope.record.availableFacilities;
			//delete $scope.record.departmentId;
			$scope.record['availableFacilities'] = $scope.availableFacilitiesToSave;
			//$scope.record['departmentId'] = $scope.departmentIdToSave;
			console.log($scope.record);	
				hospitalService.create($scope.record).then(function(response) {
       			 });
       			 $scope.cancelRecord();	
			   window.location.reload();
		}
	
		$scope.setRowData = function(row) {
			$scope.currentPage = 'Update';
			$scope.rowData = row;
			$scope.updatePage = true;
			var string = $scope.rowData.availableFacilities;
			var array = string.split(',');
			$scope.rowData.availableFacilities=array;
			$scope.record['availableFacilities']=$scope.rowData.availableFacilities;
			console.log($scope.rowData.availableFacilities);


			$scope.record = {
			"name": row.name,
			"availableFacilities": row.availableFacilities,
			"departmentId": row.departmentId,
			"hospitalRegistrationNumber":row.hospitalRegistrationNumber,
			"hospitalEstablishmentDate":new Date(row.hospitalEstablishmentDate),
			"contact": row.contact,
			"area": row.area,
			"district": row.district,
			"state": row.state,
			"startTime":row.startTime,
			"endTime":row.endTime,
			"description": row.description,
			 "id": row.id
			};

		};
		$scope.updateRecord = function() {

			$scope.availableFacilitiesToSave = JSON.stringify($scope.record.availableFacilities);
			$scope.availableFacilitiesToSave = JSON.stringify($scope.record.availableFacilities);
			//$scope.departmentIdToSave = JSON.stringify($scope.record.departmentId);
			delete $scope.record.availableFacilities;
			//delete $scope.record.departmentId;
			$scope.record['availableFacilities'] = $scope.availableFacilitiesToSave;

			console.log($scope.record);
			hospitalService.update($scope.record).then(function(response) {
       			 });
       			 $scope.cancelRecord();	
			   window.location.reload();
			
		}
		$scope.emptyForm = function() {
			$scope.updatePage = false;
			$scope.record = {
			"name": "",
			"availableFacilities": "",
			"departmentId": "",
			"hospitalRegistrationNumber":"",
			"hospitalEstablishmentDate":"",
			"contact": "",
			"area": "",
			"district": "",
			"state": "",
			"startTime":"",
			"endTime":"",
			"description": ""
			};
			
			
		};

		$scope.rowSelect = function(row) {
			$scope.selected.push(row);
		};
		$scope.headerCheckbox = false;
		$scope.selectAll = function() {
			if(!$scope.headerCheckbox){
			for ( var i in $scope.hospitalsData) {
				$scope.hospitalsData[i]["checkboxValue"] = 'on';
				$scope.selected.push($scope.hospitalsData[i]);
			};
			$scope.headerCheckbox = ($scope.headerCheckbox == false)?true:false;
		}else if($scope.headerCheckbox){
			for ( var i in $scope.hospitalsData) {
				$scope.hospitalsData[i]["checkboxValue"] = 'off';
				$scope.selected = [];
			};
			$scope.headerCheckbox = ($scope.headerCheckbox == true)?false:true;
		};
		//console.log($scope.selected);
		};

		
		$scope.deleteRow = function(ev,row) {
			// Appending dialog to document.body to cover sidenav in docs app
			
				var confirm = $mdDialog
						.confirm()
						.title('Are you sure want to Delete Record?')
						
						.ariaLabel('Lucky day').targetEvent(ev).ok(
								'Ok').cancel('Cancel');

				$mdDialog.show(confirm).then(function() {
						hospitalService.deleteRow(row.id).then(function(response) {
			});
						   window.location.reload();
				}, function() {
					$scope.status = 'You decided to keep your Task.';
				});
			

		};

		$scope.exportData = function(tableId) {
			// $scope.tasksOptions = [ $scope.tasksData.length ];
			var exportHref = Excel.tableToExcel(tableId, 'sheet name');
			$timeout(function() {
				location.href = exportHref;
			}, 100); // trigger download
		}

		/* Tooltip Starrts */

		$scope.demo = {
			showTooltip : false,
			tipDirection : ''
		};

		$scope.demo.delayTooltip = undefined;
		$scope.$watch('demo.delayTooltip', function(val) {
			$scope.demo.delayTooltip = parseInt(val, 10) || 0;
		});

		$scope.$watch('demo.tipDirection', function(val) {
			if (val && val.length) {
				$scope.demo.showTooltip = true;
			}
		});
		/* Tooltip Ends */

		/* Side nav starts */
		$scope.toggleLeft = buildDelayedToggler('left');
		$scope.toggleRight = buildToggler('right');
		$scope.isOpenRight = function() {
			return $mdSidenav('right').isOpen();
		};

		function debounce(func, wait, context) {
			var timer;

			return function debounced() {
				var context = $scope, args = Array.prototype.slice
						.call(arguments);
				$timeout.cancel(timer);
				timer = $timeout(function() {
					timer = undefined;
					func.apply(context, args);
				}, wait || 10);
			};
		}

		function buildDelayedToggler(navID) {
			return debounce(function() {
				// Component lookup should always be available since we are not
				// using `ng-if`
				$mdSidenav(navID).toggle().then(function() {
					$log.debug("toggle " + navID + " is done");
				});
			}, 200);
		}

		function buildToggler(navID) {

			return function() {
				// Component lookup should always be available since we are not
				// using `ng-if`
				$mdSidenav(navID).toggle().then(function() {
					$log.debug("toggle " + navID + " is done");
				});
			}
		}
		/* Side nav ends */

	return self;
};

/*dasApplication.directive('createHospital', function($state) {
	return {
		restrict : 'E',
		replace : true,
		templateUrl : function() {
			var current = $state.current.name;
			return '../das/pages/' + current + '/' + current + '.record.html';
		}
	};
});*/

