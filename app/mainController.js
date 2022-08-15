const app = angular.module('mainApp', ['angularUtils.directives.dirPagination', 'ngRoute']);

app.config(function ($routeProvider) {
    
    $routeProvider

        .when('/home', {
            templateUrl: 'view/home.html',
            controller: 'homeController'
        })

        // .when('/hotels', {
        //     templateUrl: 'view/hotels.html',
        //     controller: 'hotelsController'
        // })

        // .when('/facebook', {
        //     templateUrl: 'view/facebook.html',
        //     controller: 'facebookController'
        // })

        .otherwise({
            redirectTo: '/home'
        });
});

app.controller('mainController', function () {
    
});