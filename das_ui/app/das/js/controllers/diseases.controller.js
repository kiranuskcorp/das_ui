/*(function() {*/
'use strict';
dasApplication.controller("diseasesController", diseasesController);

function diseasesController($scope, diseasesService, $mdDialog,$rootScope, $mdToast,
        $timeout, $state, $mdSidenav, $log) {

    var self = {
        init : init
    };
    function init() {
        // console.log($state.current.name);
         $rootScope.currentController = 'Diseases';
        var current = $state.current.name;
        $rootScope.currentDataEnable = true;
        $scope.currentState = current.split(/[\s.]+/);
        $scope.currentRoute = $scope.currentState[$scope.currentState.length - 1];
        $scope.customFullscreen = false;
        $scope.updatePage = false;
         $scope.currentPage = 'Create';
        $scope.diseasesData = [];
        $scope.collection = [];
        $scope.selected = [];
        $scope.headerEnable = {};
        $scope.exportData = [];
       

        $scope.record = {
                                            
                        "name": "",
                        "departmentId":"",
                        "createdDate":"",
                        "description":""
                                };
        $scope.loading=true;

        function getAllDiseases(){
            diseasesService.getAllDiseases().then(function(response) {
            $scope.diseasesData = response.data;
            $scope.diseasesLength = response.data.length;
            $rootScope.currentTableLength = 'Total Diseases :'+response.data.length;
            $scope.diseasesOptions = [ 200,300 ];
            $scope.diseasesPage = {
                pageSelect : true
            };
            $scope.query = {
                order : 'name',
                limit : 100,
                page : 1
            };
            $scope.loading=false;
            }, function(error) {
            alert("failed");
                    $scope.loading=false;
            });
        }
        getAllDiseases();

           

        var deregisterListener = $rootScope.$on("CallDiseasesMethod", function(){
            if ($rootScope.$$listeners["CallDiseasesMethod"].length > 1) {
                            $rootScope.$$listeners["CallDiseasesMethod"].pop();

                }
           $scope.toggleRight();
             $scope.emptyForm();
             $scope.currentPage = "Create";
           
        });
        var deregisterListener = $rootScope.$on("CallDiseasesSearchMethod", function(event, args) {
            if ($rootScope.$$listeners["CallDiseasesSearchMethod"].length > 1) {
                $rootScope.$$listeners["CallDiseasesSearchMethod"].pop();
            }            
            $rootScope.filterByText = args.text;
        });
           
        $scope.saveRecord = function() {
            diseasesService.create($scope.record).then(function(response) {
              $scope.cancelRecord();
              getAllDiseases();
              });
        }


            diseasesService.getAllDepartment().then(function(response) {
            
            $scope.departments = response.data;
            console.log($scope.departments);
             });

            diseasesService.getAllSpecializations().then(function(response) {
            
            $scope.specializations = response.data;
            console.log($scope.specializations);
             });

           /* $scope.getAllSpecializationByDepartmentId = function(departmentId) {
            diseasesService.getAllSpecializationByDepartment(departmentId).then(function(response) {
                $scope.specializations = response.data;
                console.log($scope.specializations);
                    });
              };*/
/*
                $scope.getAllDoctorsByHospitalId = function(hospital) {
            appointmentService.getAllDoctorsByHospital(hospital).then(function(response) {
                $scope.doctors = response.data;
                console.log(response.data);
            });
        };*/


            $scope.setRowData = function(row) {
                  $scope.currentPage = "Update";
                $scope.updatePage = true;
                $scope.record = {

                                "name": row.name,
                                 "departmentId":row.departmentId,
                                "description":row.description,
                                 "id":row.id
                };
            };
            $scope.updateData = function() {
                diseasesService.update($scope.record).then(function(response) {
                   $scope.cancelRecord();
                   $scope.currentPage = 'Create';
                   getAllDiseases();
                });
            }
             $scope.emptyForm = function() {
                    $scope.updatePage = false;
                    $scope.record = {
                                
                        "name": "",
                        "departmentId":"",
                        "createdDate":"",
                        "description":""
                };

                };
               $scope.cancelRecord = function() {
                    $mdSidenav('right').close().then(function() {
                            $log.debug("close RIGHT is done");
                        });
                        
                    };
                    $scope.rowSelect = function(row) {
                    $scope.selected.push(row.id);
                };

            $scope.headerCheckbox = false;
                  $scope.selectAll = function() {
            if(!$scope.headerCheckbox){
            for ( var i in $scope.diseasesData) {
                $scope.diseasesData[i]["checkboxValue"] = 'on';
                $scope.selected.push($scope.diseasesData[i]);
            };
            $scope.headerCheckbox = ($scope.headerCheckbox == false)?true:false;
        }else if($scope.headerCheckbox){
            for ( var i in $scope.diseasesData) {
                $scope.diseasesData[i]["checkboxValue"] = 'off';
                $scope.selected = [];
            };
            $scope.headerCheckbox = ($scope.headerCheckbox == true)?false:true;
        };
    };

            

            $scope.deleteRow = function(ev,row) {
            
                var confirm = $mdDialog
                        .confirm()
                        .title('Are you sure want to Delete Record?')
                        
                        .ariaLabel('Lucky day').targetEvent(ev).ok(
                                'Ok').cancel('Cancel');

                $mdDialog
                        .show(confirm)
                        .then(
                                function() {
                                   diseasesService.deleteRow(row.id).then(function(response) {
                                    getAllDiseases();
            });
                                   
                                },
                                function() {
                                    $scope.status = 'You decided to keep your Task.';
                                });
            
    
        };

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
    }
    init();
   
               return self;
};

dasApplication.directive('createDiseases', function($state) {
    return {
        restrict : 'E',
        replace : true,
        templateUrl : function() {
            var current = $state.current.name;
            return '../das/pages/' + current + '/' + current + '.record.html';
        }
    };
});
dasApplication.filter('capitalize', function() {
    return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase()
                + input.substr(1).toLowerCase() : '';
    }
});

dasApplication
        .factory(
                'Excel',
                function($window) {
                    var uri = 'data:application/vnd.ms-excel;base64,', template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>', base64 = function(
                            s) {
                        return $window.btoa(unescape(encodeURIComponent(s)));
                    }, format = function(s, c) {
                        return s.replace(/{(\w+)}/g, function(m, p) {
                            return c[p];
                        })
                    };
                    return {
                        tableToExcel : function(tableId, worksheetName) {
                            var table = $(tableId), ctx = {
                                worksheet : worksheetName,
                                table : table.html()
                            }, href = uri + base64(format(template, ctx));
                            return href;
                        }
                    };
                });
