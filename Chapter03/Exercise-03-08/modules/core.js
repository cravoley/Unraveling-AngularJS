angular.module('core', [])
	.factory('currentSpot', currentSpot)
	.directive('ywActiveMenu', ywActiveMenu)
	.directive('ywMenuId', ywMenuId);


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