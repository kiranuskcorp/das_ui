/*(function() {*/
'use strict';
dasApplication.controller("appointmentController", appointmentController);

function appointmentController($scope, appointmentService, Excel, $state, $mdDialog,
    $mdToast, $timeout, $mdSidenav, $log, $rootScope) {
    var self = {
        init: init
    };

    function init() {
        $rootScope.currentController = 'Appointment';
        var current = $state.current.name;
        $rootScope.currentDataEnable = true;
        $scope.currentState = current.split(/[\s.]+/);
        $scope.currentRoute = $scope.currentState[$scope.currentState.length - 1];
        $scope.customFullscreen = false;
        $scope.updatePage = false;
        $scope.doctorSelected = false;
        $scope.pageType = "Create";
        $scope.currentDate = new Date();
        $scope.record = {};


        $scope.cancelRecord = function() {
            $mdSidenav('right').close().then(function() {
                $log.debug("close RIGHT is done");
            });
        }

        appointmentService.getAllAppointments().then(function(response) {
            $scope.appointments = response.data;
             $rootScope.currentTableLength = 'Records Count :'+response.data.length;
        });

        appointmentService.getAllTimes().then(function(response) {
            $scope.times = response.data;
        });
        appointmentService.getAllHospitals().then(function(response) {
            $scope.hospitals = response.data;
        });
        appointmentService.getAllStates().then(function(response) {
            $scope.states = response.data;
        });
        appointmentService.getAllCities().then(function(response) {
            $scope.cities = response.data;
        });
        
       /* appointmentService.getAllDiseases().then(function(response) {
            $scope.diseases = response.data;
        });*/



        $scope.saveRecord = function() {
            appointmentService.create($scope.record).then(function(response) {

            });
            $scope.cancelRecord();
            window.location.reload();
        }
        $scope.setRowData = function(appointment) {
            $scope.updatePage = true;
            $scope.pageType = "Update";
            $scope.getAllDoctorsByHospitalId(appointment.hospitalId);
            $scope.record = {
                "id": appointment.id,
                "patientName": appointment.patientName,
                "diseases": appointment.diseases,
                "appointmentDate": new Date(appointment.appointmentDate),
                "doctorId": appointment.doctorId,
                "hospitalId": appointment.hospitalId,
                "phoneNumber": appointment.phoneNumber,
                "registrationId": appointment.registrationId,
                "dob": new Date(appointment.dob),
                "time": appointment.time,
                "email": appointment.email,
                "area": appointment.area,
                "city": appointment.city,
                "state": appointment.state,
                "pincode": appointment.pincode,
                "description": appointment.description
            };
        };

        $scope.updateRecord = function() {
            appointmentService.update($scope.record).then(function(response) {

            });
            $scope.cancelRecord();
            window.location.reload();
        };

        $scope.deleteRow = function(ev, id) {


            var confirm = $mdDialog
                .confirm()
                .title('Are you sure want to Delete Record?')

                .ariaLabel('Lucky day').targetEvent(ev).ok(
                    'Ok').cancel('Cancel');

            $mdDialog
                .show(confirm)
                .then(
                    function() {
                        appointmentService.deleteRow(id).then(function(response) {

                        });
                        window.location.reload();
                    },
                    function() {
                        $scope.status = 'You decided to keep your Task.';
                    });
        };

        $scope.getAllDoctorsByHospitalId = function(hospital) {
            appointmentService.getAllDoctorsByHospital(hospital).then(function(response) {
            	$scope.doctors = response.data;
                console.log(response.data);
            });
        };
        $scope.getAllHospitalsByDoctorId = function(doctor) {
            /*appointmentService.getAllHospitalsByDoctor(doctor).then(function(response) {

                $scope.hospitals = response.data;
            });*/

            $scope.doctorSelected= true;
                 };

        $scope.setTime = function(event, timeSlot) {

        };

        $scope.emptyForm = function() {
            $scope.record = {
                "patientName": "",
                "diseases": "",
                "appointmentDate": "",
                "doctorId": "",
                "hospitalId": "",
                "phoneNumber": "",
                "registrationId": "",
                "dob": "",
                "time": "",
                "email": "",
                "area": "",
                "city": "",
                "state": "",
                "pincode": "",
                "description": ""

            };
        }
        /*Header icon functionality*/
        var deregisterListener = $rootScope.$on("CallAppointmentMethod", function() {
            $scope.updatePage = false;
            $scope.pageType = "Create";
            if ($rootScope.$$listeners["CallAppointmentMethod"].length > 1) {
                $rootScope.$$listeners["CallAppointmentMethod"].pop();

            }
            $scope.emptyForm();
            $scope.toggleRight();

        });

        var deregisterListener = $rootScope.$on("CallAppointmentSearchMethod", function(event, args) {
            if ($rootScope.$$listeners["CallAppointmentSearchMethod"].length > 1) {
                $rootScope.$$listeners["CallAppointmentSearchMethod"].pop();
            }
            $scope.filterByText = args.text;
        });


        /* Side nav starts */
        $scope.toggleLeft = buildDelayedToggler('left');
        $scope.toggleRight = buildToggler('right');
        $scope.isOpenRight = function() {
            return $mdSidenav('right').isOpen();
        };

        function debounce(func, wait, context) {
            var timer;

            return function debounced() {
                var context = $scope,
                    args = Array.prototype.slice
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