angular.module('diveLog', [])
	.controller('diveLogCtrl', DiveLogCtrl)
	.factory('diveLogApi', diveLogApi);

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
			.then(function (data) {
				$scope.dives = data;
				$scope.errorMessage = '';
				loading = false;
			},
			function (reason) {
				$scope.dives = [];
				$scope.errorMessage = reason;
				loading = false;
			});

	}

	function isLoading() {
		return loading;
	}
}


function diveLogApi($q) {
	var dives = [
		{
			site: 'Abu Gotta Ramada',
			location: 'Hurghada, Egypt',
			depth: 72,
			time: 54
		},
		{
			site: 'Ponte Mahoon',
			location: 'Maehbourg, Mauritius',
			depth: 54,
			time: 38
		},
		{
			site: 'Molnar Cave',
			location: 'Budapest, Hungary',
			depth: 98,
			time: 62
		}];
	var counter = 0;
	return {
		getDives: function () {
			var deffer = $q.defer();
			counter++;
			setTimeout(function () {
				if (counter % 3 == 0) {
					deffer.reject('Error: Call counter is ' + counter);
				} else {
					deffer.resolve(dives);
				}
			}, 1000);
			return deffer.promise;
		}
	}
}
