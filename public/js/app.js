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
    $scope.properties = '';

    var homePics = ['./assets/img2.jpg','./assets/img6.jpg','./assets/img3.jpg','./assets/img4.jpg'];
    let  cnt = 0;
    const length = homePics.length;
    $scope.imgURL = homePics[cnt];

    $scope.explrLeft = function() {
        if(cnt < 0)
            cnt = length - 1; 
        $scope.imgURL = homePics[cnt];
        cnt--;
    }

    $scope.explrRight = function() {
        if(cnt > length - 1)
            cnt = 0;
        $scope.imgURL = homePics[cnt];
        cnt++;
    }

    $scope.checkStatus = function() {
        $http.get('/checkStatus').
        then( response => {
            $scope.lgnStt = response.data.status === true;
            console.log($scope.lgnStt);
        },
        err => {
            console.log(err);
        })
    }
    
    $scope.init = function() {
        $http.get('/fetchStates').
        then( response => {
            $scope.states = response.data.data;
        },
        err => {
            console.error(err);
        });
        $scope.checkStatus();
    }

    $scope.logout = function() {
        $http.get('/logout').
        then(response => {
            console.log(response.data);
            if(!response.data.status)
                $scope.lgnStt = false;
        }, 
        err => {
            console.error(err);
        })
    }

    $scope.fetchCities = function() {
        $http({
           method : 'GET',
           url : '/fetCities',
           params : {selectedState : $scope.selectedState}
        }).
        then( response => {
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

    $scope.initPropData = function() {
        $http.get('/getProps').
        then(response => {
            $scope.properties = response.data.data;
            console.log($scope.properties);
        },
        err => {
            console.error(err);
        });
    }

    $scope.search = function() {
        $scope.hideLYT = false;
        $http({
            url : '/searchProps',
            method : 'GET',
            params : {state : $scope.selectedState, city : $scope.selectedCity, size : $scope.size, type : $scope.type}
        }).
        then(response => {
            const data = response.data.data;
            if(Array.isArray(data))
                $scope.properties = data;
            else{
                $scope.hideLYT = true;
            }
        },
        err => {
            console.error(err);
        });
    }
});

anglApp.controller('showProp',function($scope, $window, serviceShareData){
    
    $scope.show = function (Prop){
        console.log(Prop);
        if(Prop != 'undefined'){
            serviceShareData.addData(Prop);
            $window.location.href = 'prop.html';
        }
    }
});

anglApp.controller('appPropViewCtrl',function($scope, $http, serviceShareData){
    $scope.property = serviceShareData.getData();
    console.log($scope.property);

    $scope.checkStatus = function() {
        $http({
            method : 'GET',
            url :'/checkStatus'
        }).
        then( response => {
            $scope.lgnStt = response.data.status === true;
            console.log($scope.lgnStt);
        },
        err => {
            console.error(err);
        })
    }
});

anglApp.service('serviceShareData', function($window){
    var KEY = 'selectedProp';

    var addData = function(data) {
        $window.sessionStorage.clear();
        var mydata = $window.sessionStorage.getItem(KEY);

        if(!mydata){
            mydata = {};
        }
        mydata = data;
        $window.sessionStorage.setItem(KEY, JSON.stringify(mydata));
    };

    var getData = function() {
        var mydata = $window.sessionStorage.getItem(KEY);
        if(mydata){
            mydata = JSON.parse(mydata);
        }
        return mydata || {};
    };

    return {
        addData : addData,
        getData : getData
    };
});