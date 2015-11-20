angular.module('maintenance', ['ngRoute'])
	.controller('adminCtrl', AdminCtrl)
	.controller('mainCtrl', MainCtrl)
	.controller('locationsCtrl', LocationsCtrl)
	.controller('sitesCtrl', SitesCtrl)
	.controller('typesCtrl', TypesCtrl)
	.factory('currentSpot', currentSpot)
	.directive('ywActiveMenu', ywActiveMenu)
	.directive('ywMenuId', ywMenuId)
	.config(function ($routeProvider) {
		$routeProvider.when('/locations', {
			templateUrl: 'views/locations.html',
			controller: 'locationsCtrl'
		});
		$routeProvider.when('/sites', {
			templateUrl: 'views/sites.html',
			controller: 'sitesCtrl'
		});
		$routeProvider.when('/types', {
			templateUrl: 'views/types.html',
			controller: 'typesCtrl'
		});
		$routeProvider.otherwise({
			templateUrl: 'views/main.html',
			controller: 'mainCtrl'
		});
	});


function AdminCtrl($scope, currentSpot) {
	$scope.isActive = isActive;
	$scope.getTitle = getTitle;
	$scope.getActiveMenu = getActiveMenu;

	function isActive(menuId) {
		return currentSpot.getActive() == menuId;
	}

	function getTitle() {
		return currentSpot.getTitle();
	}

	function getActiveMenu() {
		return currentSpot.getActive();
	}
}

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
function ywActiveMenu(currentSpot) {
	return function (scope, element, attr) {
		var activeMenuId = attr['ywActiveMenu'];
		var activeTitle = attr['ywActiveTitle'];
		currentSpot.setCurrentSpot(activeMenuId, activeTitle);
	}
}
function ywMenuId(currentSpot) {
	var menuItems = [];

	function setActive(element, menuId) {
		if (currentSpot.getActive() == menuId) {
			element.addClass('active');
		} else {
			element.removeClass('active');
		}
	}

	return function (scope, element, attr) {
		var menuId = attr["ywMenuId"];
		menuItems.push({id: menuId, node: element});
		var watcherFnc = function (watchScope) {
			return watchScope.$eval('getActiveMenu()');
		}

		scope.$watch(watcherFnc, function (newValue, oldValue) {
			menuItems.forEach(function (item) {
				setActive(item.node, item.id);
			})
		})
		//setActive(element, menuId);
	}
}

function LocationsCtrl() {
}
function SitesCtrl() {
}
function MainCtrl() {
}
function TypesCtrl() {

}
