/*(function() {*/
'use strict';
dasApplication.controller("roleController", roleController);

function roleController($scope, roleService, $mdDialog,$rootScope, $mdToast,
        $timeout, $state, $mdSidenav, $log) {

    var self = {
        init : init
    };
    function init() {
        // console.log($state.current.name);
         $rootScope.currentController = 'Role';
        var current = $state.current.name;
        $rootScope.currentDataEnable = true;
        $scope.currentState = current.split(/[\s.]+/);
        $scope.currentRoute = $scope.currentState[$scope.currentState.length - 1];
        $scope.customFullscreen = false;
        $scope.updatePage = false;
         $scope.currentPage = 'Create';
        $scope.roleData = [];
        $scope.collection = [];
        $scope.selected = [];
        $scope.headerEnable = {};
        $scope.exportData = [];
       

        $scope.record = {
                                            
                        "roleName": "",
                        "createdDate":"",
                        "description":""
                                };
            $scope.loading=true;
        function getAllRoles(){
             roleService.getAllRoles().then(function(response) {
            $scope.roleData = response.data;
            $scope.roleLength = response.data.length;
            $rootScope.currentTableLength = 'Total Roles :'+response.data.length;
            $scope.roleOptions = [ 200,300 ];
            $scope.rolePage = {
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
           getAllRoles();
        var deregisterListener = $rootScope.$on("CallRoleMethod", function(){
            if ($rootScope.$$listeners["CallRoleMethod"].length > 1) {
                            $rootScope.$$listeners["CallRoleMethod"].pop();

                }
           $scope.toggleRight();
             $scope.emptyForm();
             $scope.currentPage = "Create";
           
        });
        var deregisterListener = $rootScope.$on("CallRoleSearchMethod", function(event, args) {
            if ($rootScope.$$listeners["CallRoleSearchMethod"].length > 1) {
                $rootScope.$$listeners["CallRoleSearchMethod"].pop();
            }            
            $rootScope.filterByText = args.text;
        });
           
        $scope.saveRecord = function() {
            roleService.create($scope.record).then(function(response) {
            $scope.cancelRecord();
            getAllRoles();
             });
        }



            $scope.setRowData = function(row) {
                  $scope.currentPage = "Update";
                $scope.updatePage = true;
                $scope.record = {

                        "roleName": row.roleName,
                        "description":row.description,
                             "id":row.id
                };
            };
            $scope.updateData = function() {
               roleService.update($scope.record).then(function(response) {
             
                $scope.cancelRecord();
            $scope.currentPage = 'Create';
            getAllRoles();
               });
                }
             $scope.emptyForm = function() {
                    $scope.updatePage = false;
                    $scope.record = {
                                
                        "roleName": "",
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
            for ( var i in $scope.roleData) {
                $scope.roleData[i]["checkboxValue"] = 'on';
                $scope.selected.push($scope.roleData[i]);
            };
            $scope.headerCheckbox = ($scope.headerCheckbox == false)?true:false;
        }else if($scope.headerCheckbox){
            for ( var i in $scope.roleData) {
                $scope.roleData[i]["checkboxValue"] = 'off';
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
                                    roleService.deleteRow(row.id).then(function(response) {
                                        getAllRoles();
                
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

dasApplication.directive('createRole', function($state) {
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
