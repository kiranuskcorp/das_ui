/*(function() {*/
'use strict';
dasApplication.controller("specializationController", specializationController);

function specializationController($scope, specializationService, $mdDialog,$rootScope, $mdToast,
        $timeout, $state, $mdSidenav, $log) {

    var self = {
        init : init
    };
    function init() {
        // console.log($state.current.name);
         $rootScope.currentController = 'Specialization';
        var current = $state.current.name;
        $rootScope.currentDataEnable = true;
        $scope.currentState = current.split(/[\s.]+/);
        $scope.currentRoute = $scope.currentState[$scope.currentState.length - 1];
        $scope.customFullscreen = false;
        $scope.updatePage = false;
        $scope.specializationData = [];
        $scope.collection = [];
        $scope.selected = [];
        $scope.headerEnable = {};
        $scope.exportData = [];
       

        $scope.record = {
            
                        "specializationName": "",
                        "departmentId":"",
                         "description": ""
        };
            $scope.loading=true;

            specializationService.getAllSpecialization().then(function(response) {
            $scope.specializationData = response.data;
            $scope.specializationLength = response.data.length;
            $rootScope.currentTableLength = 'Records Count :'+response.data.length;
        //  console.log($scope.employeesData);
            $scope.specializationOptions = [ 200,300 ];
            $scope.specializationPage = {
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

        specializationService.getAllDepartment().then(function(response) {
            
            $scope.departments = response.data;
            console.log($scope.departments);
        });
        
         
        var deregisterListener = $rootScope.$on("CallSpecializationMethod", function(){
            if ($rootScope.$$listeners["CallSpecializationMethod"].length > 1) {
                            $rootScope.$$listeners["CallSpecializationMethod"].pop();

                }
           $scope.toggleRight();
             $scope.emptyForm();
             $scope.currentPage = "Create";
           
        });
        var deregisterListener = $rootScope.$on("CallSpecializationSearchMethod", function(event, args) {
            if ($rootScope.$$listeners["CallSpecializationSearchMethod"].length > 1) {
                $rootScope.$$listeners["CallSpecializationSearchMethod"].pop();
            }            
            $scope.filterByText = args.text;
        });
           
        $scope.saveRecord = function() {
            specializationService.create($scope.record).then(function(response) {
             console.log(response);
            });
            $scope.cancelRecord();
              window.location.reload();

        }



            $scope.setRowData = function(row) {
                  $scope.currentPage = "Update";
                $scope.updatePage = true;
                $scope.record = {
                            "specializationName": row.specializationName,
                            "departmentId":row.departmentId,
                             "description": row.description,
                             "id":row.id
                };
            };
            $scope.updateData = function() {
               specializationService.update($scope.record).then(function(response) {
                });
                $scope.cancelRecord();
            window.location.reload();
            $scope.currentPage = 'Create';
            }
             $scope.emptyForm = function() {
                    $scope.updatePage = false;
                    $scope.record = {
                                
                        "specializationName": "",
                        "departmentId":"",
                         "description": ""
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
            for ( var i in $scope.specializationData) {
                $scope.specializationData[i]["checkboxValue"] = 'on';
                $scope.selected.push($scope.specializationData[i]);
            };
            $scope.headerCheckbox = ($scope.headerCheckbox == false)?true:false;
        }else if($scope.headerCheckbox){
            for ( var i in $scope.specializationData) {
                $scope.specializationData[i]["checkboxValue"] = 'off';
                $scope.selected = [];
            };
            $scope.headerCheckbox = ($scope.headerCheckbox == true)?false:true;
        };
        //console.log($scope.selected);
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
                                    specializationService.deleteRow(row.id).then(function(response) {
                
            });
                                   window.location.reload();
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

dasApplication.directive('createSpecialization', function($state) {
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
