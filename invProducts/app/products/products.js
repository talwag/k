(function () {
    'use strict';

    var myApp = angular.module('myApp.products', ['ngRoute', 'myApp.factories'])

    myApp.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/products', {
            templateUrl: 'products/products.html',
            controller: 'ProductsCtrl as vm'
        });
    }]);

    myApp.controller('ProductsCtrl', function (productsFactory, $http) {
        var ctrl = this;
        ctrl.products = [];
        var prmProducts = productsFactory.getProducts();
        prmProducts.then(function (products) {
            ctrl.products = products;
        });
    });
})();

