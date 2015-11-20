angular.module('maintenance', ['ngRoute'])
	.controller('adminCtrl', AdminCtrl)
	.config(function ($routeProvider) {
		$routeProvider.when('/locations', {
			templateUrl:'views/locations.html'
		})
		$routeProvider.when('/sites', {
			templateUrl:'views/sites.html'
		})
		$routeProvider.otherwise({
			templateUrl:'views/main.html'
		})
	});


function AdminCtrl($scope) {
	$scope.activeMenu = '';
	$scope.isActive = isActive;
	$scope.showMain = showMain;
	$scope.showLocations = showLocations;
	$scope.showDiveSites = showDiveSites;

	$scope.showMain();

	function setView(view, menuId) {
		$scope.view = view;
		$scope.activeMenu = menuId;
	}

	function isActive(menuId) {
		return $scope.activeMenu == menuId;
	}

	function showMain() {
		setView('main', '');
	}

	function showLocations() {
		setView('locations', 'Locations');
	}

	function showDiveSites() {
		setView('diveSites', 'Sites');
	}
}

