/**
 * Top level module of the DMT Application.
 * 
 * @module DmtApplication
 * @requires ngMaterial
 * @requires ui.router
 */
/*(function() {*/
    'use strict';
    var env = {};
    // Import variables if present from env.js
    if (window) {

       env = window.__env;
       env.api = "/api";
    }

    var dasApplication = angular.module('DasApplication', ['ngMaterial','ngAnimate', 'ui.router','ngIdle','md.data.table','ngResource','ngSanitize', 'ngCsv'])
        .constant('__env', env)
        .config(function(IdleProvider, KeepaliveProvider) {
              // configure Idle settings
              IdleProvider.autoResume(false);
              IdleProvider.keepalive(false);
          })        
        .config(function($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('blue-grey')
                .accentPalette('green')
                .warnPalette('red')
                .backgroundPalette('grey', {
                    'default': 'A100'
                });
        })
        .run(function(Idle){
        // start watching when the app runs. also starts the Keepalive service by default.
        Idle.watch();
        })
        .config(function($mdIconProvider) {
  $mdIconProvider.fontSet('md', 'material-icons');
})
        .config(['$locationProvider', '$stateProvider', '$urlRouterProvider',
            function($locationProvider, $stateProvider, $urlRouterProvider) {
                //$locationProvider.html5Mode(true);
                 $stateProvider
                    .state('app', {
                        url: '',
                        abstract: true,
                        views: {
                            'header': {
                                templateUrl: 'pages/header.html',
                                controller: "leftNavController",
                                controllerAs: 'self'

                            },
                            'navbar': {
                                templateUrl: 'pages/navigation.html',
                                controller: "leftNavController",
                                controllerAs: 'self'

                            }
                        }
                    });
                         $stateProvider
                    .state('app.hospital', {
                        name: "hospital",
                        url: "/hospital",
                        views: {

                            "content@": {
                                controller: "hospitalController",
                                controllerAs: 'self',
                                templateUrl: "pages/app.hospital/app.hospital.html"
                            }
                        }
                    });

                      $stateProvider
                    .state('app.role', {
                        name: "role",
                        url: "/role",
                        views: {

                            "content@": {
                                controller: "roleController",
                                controllerAs: 'self',
                                templateUrl: "pages/app.role/app.role.html"
                            }
                        }
                    });
                      $stateProvider
                    .state('app.diseases', {
                        name: "diseases",
                        url: "/diseases",
                        views: {

                            "content@": {
                                controller: "diseasesController",
                                controllerAs: 'self',
                                templateUrl: "pages/app.diseases/app.diseases.html"
                            }
                        }
                    });


                         $stateProvider
                    .state('app.doctor', {
                        name: "doctor",
                        url: "/doctor",
                        views: {

                            "content@": {
                                controller: "doctorController",
                                controllerAs: 'self',
                                templateUrl: "pages/app.doctor/app.doctor.html"
                            }
                        }
                    });
                      $stateProvider
                    .state('app.appointment', {
                        name: "appointment",
                        url: "/appointment",
                        views: {

                            "content@": {
                                controller: "appointmentController",
                                controllerAs: 'self',
                                templateUrl: "pages/app.appointment/app.appointment.html"
                            }
                        }
                    });

                     $stateProvider
                                        .state('app.user', {
                                            name: "user",
                                            url: "/user",
                                            views: {

                                                "content@": {
                                                    controller: "userController",
                                                    controllerAs: 'self',
                                                    templateUrl: "pages/app.user/app.user.html"
                                                }
                                            }
                                        });
                                        

                       $stateProvider
                    .state('app.department', {
                        name: "department",
                        url: "/department",
                        views: {

                            "content@": {
                                controller: "departmentController",
                                controllerAs: 'self',
                                templateUrl: "pages/app.department/app.department.html"
                            }
                        }
                    });
                      $stateProvider
                    .state('app.reporting', {
                        name: "reporting",
                        url: "/reporting",
                        views: {

                            "content@": {
                                controller: "reportingController",
                                controllerAs: 'self',
                                templateUrl: "pages/app.reporting/app.reporting.html"
                            }
                        }
                    });
                    $stateProvider
                    .state('app.specialization', {
                        name: "specialization",
                        url: "/specialization",
                        views: {

                            "content@": {
                                controller: "specializationController",
                                controllerAs: 'self',
                                templateUrl: "pages/app.specialization/app.specialization.html"
                            }
                        }
                    });
                   
<<<<<<< HEAD
                $urlRouterProvider.otherwise("/hospital");
=======

                $stateProvider
                    .state('app.login', {
                        name: "login",
                        url: "/login",
                        views: {

                            "content@": {
                                controller: "loginController",
                                controllerAs: 'self',
                                templateUrl: "pages/app.login/app.login.html"
                            }
                        }
                    });
                   

                $urlRouterProvider.otherwise("/login");
>>>>>>> e6955b560c2e18d0546b988dd9be6de9b6a5d2ab

            }
        ]);

dasApplication.filter('capitalize', function() {
    return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase()
                + input.substr(1).toLowerCase() : '';
    }
});

dasApplication.directive('onlyDigits', function () {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function (scope, element, attr, ctrl) {
        function inputValue(val) {
          if (val) {
            var digits = val.replace(/[^0-9.+-]/g, '');

            if (digits.split('.').length > 2) {
              digits = digits.substring(0, digits.length - 1);
            }

            if (digits !== val) {
              ctrl.$setViewValue(digits);
              ctrl.$render();
            }
            return parseFloat(digits);
          }
          return undefined;
        }            
        ctrl.$parsers.push(inputValue);
      }
    };
 });

dasApplication.directive('replace', function() {
  return {
    require: 'ngModel',
    scope: {
      regex: '@replace',
      with: '@with'
    }, 
    link: function(scope, element, attrs, model) {
      model.$parsers.push(function(val) {
        if (!val) { return; }
        var regex = new RegExp(scope.regex);
        var replaced = val.replace(regex, scope.with); 
        if (replaced !== val) {
          model.$setViewValue(replaced);
          model.$render();
        }         
        return replaced;         
      });
    }
  };
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

        dasApplication.factory('storeObject', function() {
    var savedData = {};
    function set(data) {
        savedData = data;
    }
    function get() {
        return savedData;
    }

    return {
        set : set,
        get : get
    }

});



