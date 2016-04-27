//'use strict';

/*
angular.module('testApp')
.controller('mainCtrl', function())
*/

var mainCtrl = function($scope, $http) {

/*
  $scope.users = [
    {"name":"suzuki", "score":12},
    {"name":"shule", "score":23},
    {"name":"jun", "score":3},
    {"name":"jun2", "score":223},
    {"name":"jun3", "score":43},
  ];
*/

  $http.get('/api/channels', {})
    .success(function(data, status, headers, config){
      console.log(status);
      $scope.users = data;
    })
    .error(function(data, status, headers, config){
      console.log(status);
    });

  // $http.get('/api/users', {})
  //   .success(function(data, status, headers, config){
  //     console.log(status);
  //     $scope.users = data;
  //   })
  //   .error(function(data, status, headers, config){
  //     console.log(status);
  //   });

  // $scope.today = new Date();


/*
  this.$http.get('/api/things').then(response => {
    this.awesomeThings = response.data;
    this.socket.syncUpdates('thing', this.awesomeThings);
  });
*/
}
