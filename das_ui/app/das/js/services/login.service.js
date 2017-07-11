'use strict';
    
    dasApplication.factory("loginService", loginService);
    function loginService($http,__env,$window, $state) {
           

        var service = {               
               validate:validate            
          },url = __env.baseUrl + __env.context
         return service;
               

         function validate(user) {
                return $http({
                    url : url + '/logins/readByValues',
                    method : "POST",
                    data : user
                }).then(function(response) {
                   if(response.status == 200 && response.statusText == "OK"){
                    $state.go("app.specialization")
                   }else {   
                        ($state.go("app.login"))

                  }
                }, function(response) { 

                alert("Invalid username or password");
                // optional
                });
            }
         
            }
    