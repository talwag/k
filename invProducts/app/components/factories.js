(function () {
    'use strict';
    var myApp = angular.module('myApp.factories', []);
    myApp.factory('productsFactory', function ($q, $http) {
        var products = null;
        return {
            getProducts: function () {
                if (products) {
                    return $q(function (resolve, reject) {
                        setTimeout(function () {
                            resolve(products);
                        }, 0);
                    });
                } else {
                    return $http.get("json/products.json")
                        .then(function (res) {
                            products = res.data
                            return products;
                        });
                }
            }
        }
    })
})();
