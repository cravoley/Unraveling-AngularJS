angular.module('maintenance', [])
	.factory('locationsApi', locationsApi)
	.constant('apiUrl', 'http://unraveling-ng.azurewebsites.net/api/dive/location')
	.constant('apiUsername', 'd1dd208c-4bcf-4c05-95d8-50158177cc2d')
	.constant('apiSecret', '48aa3db659ae42c09851e5763bca0df585b4660e499448738a684722724baaf25fb9885d08a14a17bac81e5891a85910')
	.controller('locationsCtrl', LocationsCtrl);

function locationsApi($http, apiUrl, apiUsername, apiSecret) {
	var locations = [];

	function get(param) {
		return request("GET", param);
	}

	function post(data) {
		return request("poST", null, data);
	}

	function put(data) {
		return request("PUT", null, data);
	}

	function del(param) {
		return request("DELETE", param);
	}

	function request(verb, param, data) {
		var req = {
			method: verb,
			url: url(param),
			headers: {
				'Authorization': getAuthHeader()
			},
			data: data
		}
		return $http(req);
	}

	function url(param) {
		if (param == null || !angular.isDefined(param)) param = '';
		return apiUrl + param;
	}

	function getAuthHeader() {
		return "TenantSecret " + apiUsername + "," + apiSecret;
	}

	return {
		getLocations: function () {
			return get();
		},
		getLocationById: function (id) {
			return get(id);
		},
		addLocation: function (location) {
			return post(location);
		},
		removeLocation: function (id) {
			return del(id);
		},
		updateLocation: function (location) {
			return put(location);
		}
	}
}


function LocationsCtrl($scope, locationsApi) {
	var selectedId = -1;
	var addFlag = false;
	var editFlag = false;
	var removeFlag = false;

	var rings = [];
	$scope.model = {};
	$scope.errorMessage = '';
	$scope.isBusy = isBusy;
	$scope.isLoading = isLoading;
	$scope.startAdd = startAdd;
	$scope.startEdit = startEdit;
	$scope.startRemove = startRemove;
	$scope.cancel = reset
	$scope.isInReadMode = isInReadMode;
	$scope.isInAddMode = isInAddMode;
	$scope.isInEditMode = isInEditMode;
	$scope.isInRemoveMode = isInRemoveMode;
	$scope.add = add;
	$scope.save = save;
	$scope.remove = remove;
	$scope.hasError = hasError;


	// call refresh on load
	refresh();

	function isBusy(id) {
		// verifica se a variavel id esta definida
		if (angular.isDefined(id)) {
			return rings.indexOf(id) >= 0;
		} else {
			return rings.length > 0;
		}
	}

	function isLoading() {
		return isBusy(-2);
	}

	// inicia o processo de cadastrar novo
	function startAdd() {
		reset();
		addFlag = true;
		$scope.model.locationBox = '';
	}

	// edita localizacao
	function startEdit(id) {
		reset();
		selectedId = id;
		editFlag = true;
		var item;
		// busca "remoto"
		$scope.locations.forEach(function (current) {
			if (current.id == id) {
				$scope.model.locationBox = current.displayName;
				return;
			}
		})
	}

	function startRemove(id) {
		reset();
		selectedId = id;
		removeFlag = true;
	}

	function reset() {
		selectedId = -1;
		addFlag = false;
		editFlag = false;
		removeFlag = false;
		$scope.errorMessage = '';
	}

	function isInReadMode(id) {
		return selectedId < 0 || selectedId != id;
	}

	function isInAddMode() {
		return addFlag;
	}

	function isInEditMode(id) {
		return selectedId == id && editFlag;
	}

	function isInRemoveMode(id) {
		return selectedId == id && removeFlag;
	}

	function add() {
		useBackend(-1, function () {
			return locationsApi.addLocation(
				{
					id: 0,
					displayName: $scope.model.locationBox
				})
		})
	}

	function save() {
		useBackend(selectedId, function () {
			return locationsApi.updateLocation(
				{
					id: selectedId,
					displayName: $scope.model.locationBox
				})
		})
	}

	function remove(id) {
		useBackend(id, function () {
			return locationsApi.removeLocation(id);
		})
	}


	// adiciona o id na lista de request pendentes
	function busy(id) {
		if (isBusy(id)) {
			return;
		}
		rings.push(id);
	}

	// remove conteudo da lista de pendencias
	function complete(id) {
		var idx = rings.indexOf(id);
		if (idx < 0) {
			return;
		}
		rings.splice(idx, 1);
	}

	// recarrega lista
	function refresh() {
		busy(-2);
		locationsApi
			.getLocations()
			.success(function (data) {
				$scope.locations = data;
				$scope.errorMessage = '';
				complete(-2);
			})
			.error(function (errorInfo, status) {
				setError(errorInfo, status, -2);
			});
		reset();
	}

	function hasError() {
		return $scope.errorMessage != '';
	}


	function useBackend(id, operation) {
		busy(id);
		operation()
			.success(function (data) {
				refresh();
				complete(id);
			})
			.error(function (errorInfo, status) {
				setError(errorInfo, status, id);
			});
	}

	function setError(errorInfo, status, id) {
		reset();
		complete(id);
		if (status == 401) {
			$scope.errorMessage = "Auth. fail";
		} else if (angular.isDefined(errorInfo.reasonCode) && errorInfo.reasonCode == 'TenantLimitExceeded') {
			$scope.errorMessage = "You cannot add more location";
		} else {
			$scope.errorMessage = errorInfo.message;
		}

	}

}