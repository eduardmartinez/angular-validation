'use strict';

var myApp = angular.module('myApp', ['ngRoute', 'ghiscoding.validation', 'pascalprecht.translate']);

myApp.config(['$compileProvider', '$locationProvider', '$routeProvider', function ($compileProvider, $locationProvider, $routeProvider) {
    $compileProvider.debugInfoEnabled(false);
    $routeProvider
      .when('/validate-directive', {
        templateUrl: 'templates/testingFormDirective.html',
        controller: 'Ctrl'
      })
      .when('/validate-service', {
        templateUrl: 'templates/testingFormService.html',
        controller: 'CtrlValidationService'
      })
      .otherwise({
        redirectTo: 'validate-directive',
      });    
  }])
	.config(['$translateProvider', function ($translateProvider) {
	  $translateProvider.useStaticFilesLoader({
	    prefix: 'locales/validation/',
	    suffix: '.json'
		});
  
  	// load English ('en') table on startup
		$translateProvider.preferredLanguage('en');
	}]);

// -- Main Controller for Angular-Validation Directive
// ---------------------------------------------------
myApp.controller('Ctrl', ['$location', '$route', '$scope', '$timeout', '$translate', function ($location, $route, $scope, $timeout, $translate) {
  // change the translation language & reload the page for a better handling of the validation translation
  // the timeout+reload ensures validation translations had time to re-render
  $scope.switchLanguage = function (key) {    
    $translate.use(key);
    $timeout(function() {
      $route.reload();
    }, 50);
    
  };
  $scope.goto = function ( path ) {
    $location.path( path );
  };
  $scope.showValidationSummary = function () {
    $scope.displayValidationSummary = true;
  }  
}]);


// -- Controller to use Angular-Validation Service
// -----------------------------------------------

// exact same testing form used except that all validators are programmatically added inside controller via Angular-Validation Service
myApp.controller('CtrlValidationService', ['$scope', '$translate', 'validationService', function ($scope, $translate, validationService) {
  // start by creating the service
  var myValidation = new validationService();

  // you can create indepent call to the validation service  
  myValidation.addValidator({
    elmName: 'input2',
    debounce: 3000,
    scope: $scope,
    rules: 'numeric_signed|required'
  });

  // you can also chain validation service and add multiple validators at once
  // we optionally start by defining some global options. Note: each validator can overwrite individually these properties (ex.: validatorX can have a `debounce` different than the global set)
  // there is 2 ways to write a call... #1 with elementName & rules defined as 2 strings arguments ... #2 with 1 object as argument (with defined property names)
  //    #1 .addValidtor('myElementName', 'myRules') ... #2 .addValidator({ elmName: 'inputX', rules: 'myRules'})
  // the available object properties are the exact same set as the directive except that they are camelCase
  myValidation
    .setGlobalOptions({ debounce: 1500, scope: $scope }) 
    .addValidator('input3', 'float_signed|between_num:-0.6,99.5|required')
    .addValidator('input4', 'exact_len:4|regex:YYWW:=^(0[9]|1[0-9]|2[0-9]|3[0-9])(5[0-2]|[0-4][0-9])$:regex|required|integer')
    .addValidator('input5', 'email|required|min_len:6')
    .addValidator('input6', 'url|required')
    .addValidator('input7', 'ipv4|required')
    .addValidator('input8', 'credit_card|required')
    .addValidator('input9', 'between_len:2,6|required')
    .addValidator('input10', 'date_iso|required')
    .addValidator('input11', 'date_us_long|required')
    .addValidator('input12', 'time')
    .addValidator('select1', 'required')
    .addValidator({elmName: 'input13', rules: 'min_len:5|max_len:10|alpha_dash_spaces|required', validationErrorTo: ".validation-input13"})
    .addValidator('input14', 'alpha|required')
    .addValidator('input15', 'alpha|min_len:3|required')
    .addValidator('input16', 'match:input15,Password|required')
    .addValidator({elmName: 'input17', rules: 'alpha_spaces|exact_len:3|required', debounce: 5000})
    .addValidator('input18', 'date_iso_min:1999-12-31|required')
    .addValidator('input19', 'date_us_short_between:11/28/99,12/31/15|required')
    .addValidator('area1', 'alpha_dash_spaces|min_len:15|required');

  
  $scope.removeInputValidator = function ( elmName ) {
    // remove a single element (string) OR you can also remove multiple elements through an array type .removeValidator(['input2','input3'])
    myValidation.removeValidator(elmName); 

    $scope.enableRemoveInputValidatorButton = false;
  };
}]);