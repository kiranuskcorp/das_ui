/*(function() {*/
    'use strict';
    dasApplication
        .controller("EventsController", EventsController);

    function EventsController($scope) {
       $scope.toggle = function(){
        $scope.isVisible = ! $scope.isVisible;
    };
    $scope.isVisible= false;

}
