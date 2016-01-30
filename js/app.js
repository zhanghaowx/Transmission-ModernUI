'use strict';

// Add format function to String
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] !== 'undefined' ? args[number] : match;
        });
    };
}

define([
    'angular',
    'angularUiRouter',
    'oclazyload',
], function (angular) {
    /**
     * Declare app level module which depends on views, and components
     * - Steps to add a new page:
     * 1. add page's js file to above dependency list
     * 2. add page's module name to below dependency list
     * 3. In page's js file, configure $stateProvider
     */
    var app = angular.module('ModernUI', [
            'ui.router',
            'oc.lazyLoad',
        ]);

    /* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
    app.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            cssFilesInsertBefore: 'ng_load_plugins_before' // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
        });
    }]);

    /* Setup Rounting For Core Pages */
    app.config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/dashboard');
        $stateProvider
            .state('404', {
                title: 'Page not found'
            })
            .state('home', {
                abstract: true,
                views: {
                    'header': {
                        templateUrl: 'view/include/header.html'
                    },
                    'sidebar': {
                        templateUrl: 'view/include/sidebar.html',
                        controller: function ($scope) {
                            $scope.$on('$viewContentLoaded', function (event) {
                                Metronic.init(); // init metronic core componets
                                QuickSidebar.init(); // init quick sidebar
                            });
                        }
                    },
                    'footer': {
                        templateUrl: 'view/include/footer.html'
                    },
                    'content': {
                        // defers to the child state view
                        template: '<div ui-view></div>'
                    }
                }
            });
    });

    app.run(['$rootScope', '$state', '$stateParams',
        function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ]);

    console.log("App is running ...");

    return app;
});
