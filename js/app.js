// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($compileProvider, $stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(sms|tel|mailto|whatsapp):/);
  $ionicConfigProvider.platform.android.tabs.position('bottom');
  $stateProvider

  .state('signin', {
    url: '/signin',
    templateUrl: 'templates/signin.html',
    controller: 'SigninCtrl'
  })

  .state('checklogin', {
	cache: false,
    url: '/checklogin',
    templateUrl: 'templates/checklogin.html',
    controller: 'CheckLoginCtrl'
  })

  .state('forgot', {
    url: '/forgot',
    templateUrl: 'templates/forgot.html',
    controller: 'ForgotCtrl'
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'SignupCtrl'
  })

  .state('code', {
    url: '/code',
    templateUrl: 'templates/code.html',
    controller: 'CodeCtrl'
  })

  // setup an abstract state for the tabs directive
    .state('menu', {
    url: '/menu',
    abstract: true,
    templateUrl: 'templates/menu.html'
  })

  // Each tab has its own nav history stack:

  .state('menu.home', {
    url: '/home',
    views: {
      'home': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('allitem', {
	cache: false,
    url: '/home/:typeItem',
    templateUrl: 'templates/allitem.html',
    controller: 'AllItemCtrl'
  })

  .state('detailitem', {
	cache: false,
    url: '/home/:codeItem/:typeItem',
    templateUrl: 'templates/detailitem.html',
    controller: 'DetailItemCtrl'
  })

  .state('menu.myitem', {
	cache: false,
    url: '/myitem',
    views: {
      'myitem': {
        templateUrl: 'templates/myitem.html',
        controller: 'MyItemCtrl'
      }
    }
  })

  .state('additem', {
	cache: false,
    url: '/additem',
    templateUrl: 'templates/additem.html',
    controller: 'AddItemCtrl'
  })

  .state('mydetailitem', {
	cache: false,
    url: '/myitem/:codeItem',
    templateUrl: 'templates/mydetailitem.html',
    controller: 'MyDetailItemCtrl'
  })

  .state('menu.mytukeran', {
	cache: false,
    url: '/mytukeran',
    views: {
      'mytukeran': {
        templateUrl: 'templates/mytukeran.html',
        controller: 'MyTukeranCtrl'
      }
    }
  })

  .state('barteritem', {
	cache: false,
    url: '/mytukeran/:codeTukeran/:filter',
    templateUrl: 'templates/barteritem.html',
    controller: 'BarterItemCtrl'
  })

  .state('menu.account', {
	cache: false,
    url: '/account',
    views: {
      'account': {
        templateUrl: 'templates/account.html',
        controller: 'MyAccountCtrl'
      }
    }
  })

  // Thanks to Ben Noblet!
  $urlRouterProvider.otherwise(function ($injector, $location) {
    var $state = $injector.get("$state");
	$state.go("menu.home");
  });
});