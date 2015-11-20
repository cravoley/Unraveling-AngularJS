angular.module('diveLog', [])
	.controller('diveLogCtrl', DiveLogCtrl)
	.factory('diveLogApi', diveLogApi)
	.constant("apiUrl", 'http://unraveling-ng.azurewebsites.net');

function DiveLogCtrl($scope, diveLogApi) {
	$scope.dives = [];
	$scope.refreshDives = refreshDives;
	$scope.isLoading = isLoading;
	$scope.errorMessage = '';

	var loading = false;

	function refreshDives() {
		loading = true;
		$scope.dives = [];
		$scope.errorMessage = '';
		diveLogApi.getDives()
			.success(function (data) {
				console.log(data);
				$scope.dives = data;
				$scope.errorMessage = '';
				loading = false;
			})
			.error(function () {
				$scope.dives = [];
				$scope.errorMessage = "Unable to get dives from webservices";
				loading = false;
			});

	}

	function isLoading() {
		return loading;
	}
}


function diveLogApi($http, apiUrl) {
	return {
		getDives: function () {
			var url = apiUrl + "/api/backendtest/dives"
			return $http.get(url);
		}
	}
}
