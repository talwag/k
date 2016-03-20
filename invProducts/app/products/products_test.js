'use strict';

describe('myApp.products module', function () {

    var $httpBackend, $rootScope, createController, authRequestHandler;

    beforeEach(module('myApp.products'));
    beforeEach(inject(function ($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        $httpBackend.when('GET', 'json/products.json')
            .respond([
                {
                    "name": "product0",
                    "sku": 1,
                    "price": 4,
                    "cat": "cat0"
                },
                {
                    "name": "product1",
                    "sku": 2,
                    "price": 5,
                    "cat": "cat1"
                }]);

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');
        // The $controller service is used to create instances of controllers
        var $controller = $injector.get('$controller');

        createController = function () {
            return $controller('ProductsCtrl', {'$scope': $rootScope});
        };
    }));


    describe('products controller', function () {

        it('should have ctrl defined', inject(function ($controller) {
            //spec body
            var ctrl = createController();
            expect(ctrl).toBeDefined();
        }));
        it('should put products on ctrl', inject(function ($controller) {
            //spec body
            var ctrl = createController();
            $httpBackend.flush();

            expect(ctrl.products.length).toBe(2);

        }));

    });
});