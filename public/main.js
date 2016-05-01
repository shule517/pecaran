var mainCtrl = function($scope, $http) {

  $http.get('/api/channels', {})
    .success(function(data, status, headers, config){
      console.log(status);
      $scope.channels = data;
    })
    .error(function(data, status, headers, config){
      console.log(status);
    });

}
