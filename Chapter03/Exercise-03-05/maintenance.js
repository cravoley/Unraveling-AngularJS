angular.module('maintenance', ['ngRoute'])
	.controller('adminCtrl', AdminCtrl)
	.controller('mainCtrl', MainCtrl)
	.controller('locationsCtrl', LocationsCtrl)
	.controller('sitesCtrl', SitesCtrl)
	.directive('ywActiveMenu', ywActiveMenu)
	.factory('currentSpot', currentSpot)
	.config(function ($routeProvider) {
		$routeProvider.when('/locations', {
			templateUrl: 'views/locations.html',
			controller: LocationsCtrl
		})
		$routeProvider.when('/sites', {
			templateUrl: 'views/sites.html',
			controller: SitesCtrl
		})
		$routeProvider.otherwise({
			templateUrl: 'views/main.html',
			controller: MainCtrl
		})
	});


function currentSpot() {
	var activeMenuId = '';
	var titleText = '';

	return {
		setCurrentSpot: function (menuId, title) {
			activeMenuId = menuId;
			titleText = title;
		},
		getActive: function () {
			return activeMenuId;
		},
		getTitle: function () {
			return titleText;
		}

	}
}

function LocationsCtrl(currentSpot) {
	//currentSpot.setCurrentSpot('Locations','Manage the list of diving locations')
}
function SitesCtrl(currentSpot) {
	//currentSpot.setCurrentSpot('Sites','Manage the list of diving sites')
}
function MainCtrl(currentSpot) {
	//currentSpot.setCurrentSpot('','')
}
function ywActiveMenu(currentSpot) {
	return function (scope, element, attr) {
		console.log(element, attr);
		var activeMenuId = attr['ywActiveMenu'];
		var activeTitle = attr['ywActiveTitle'];
		currentSpot.setCurrentSpot(activeMenuId, activeTitle);
	}
}

function AdminCtrl($scope, currentSpot) {
	$scope.isActive = isActive;
	$scope.getTitle = getTitle;

	function isActive(menuId) {
		return currentSpot.getActive() == menuId;
	}

	function getTitle() {
		return currentSpot.getTitle();
	}
}

