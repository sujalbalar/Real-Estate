var anglApp = angular.module('SHApp',[]);

anglApp.directive('customOnChange', function () {
    return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeHandler);
    }
  };
});

anglApp.controller('appCtrl', function ($scope, $http) {
    $scope.isOFVisible = false;
    
    $scope.init = function() {
        $http.get('/fetchData').
        then( response => {
            console.log(response.data);
            $scope.states = response.data.data;
        },
        err => {
            console.error(err);
        });
    }

    $scope.fetchCities = function() {
        $http({
           method : 'GET',
           url : '/fetCities',
           params : {selectedState : $scope.selectedState}
        }).
        then( response => {
            console.log(response.data);
            $scope.cities = response.data.data;
        },
        err => {
            console.error(err);
        });
    }

    $scope.showOtherField = function(value) {
        $scope.isOFVisible = value == 'Y';
    }

    $scope.previewImg = function (e) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $scope.PreviewImage = e.target.result;
            $scope.$apply();
        };

        reader.readAsDataURL(e.target.files[0]);
    };
});