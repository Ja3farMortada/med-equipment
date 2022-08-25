const app = angular.module('mainApp', ['angularUtils.directives.dirPagination', 'ngRoute']);

app.config(function ($routeProvider) {
    
    $routeProvider

        .when('/home', {
            templateUrl: 'view/home.html',
            controller: 'homeController'
        })

        .when('/suppliers', {
            templateUrl: 'view/suppliers.html',
            controller: 'suppliersController'
        })

        .otherwise({
            redirectTo: '/home'
        });
});

// Main Factory Model
app.factory('mainFactory', function () {
    let model = {};


    model.getPackages = async () => {
        let response = await window.electron.ipcRenderer.invoke('read-package');
        if (response) {
            return response;
        }
    }

    return model;
})

// Main Controller
app.controller('mainController', function ($scope, mainFactory) {

    // Read Package.json
    (function() {
        mainFactory.getPackages().then(function(response) {
            $scope.package = response;
        })
    })();


    // define updater modal
    let checkForUpdateModal = new bootstrap.Modal(document.getElementById('updateModal'));

    $scope.checked = false;
    $scope.showSpinner = false;
    $scope.download = false;
    $scope.downloaded = false;
    $scope.downloading = false;

    $scope.openUpdateModal = function () {
        $scope.text = null;
        checkForUpdateModal.show()
    };
    $scope.checkForUpdates = function () {
        $scope.checked = true;
        $scope.text = null;
        window.electron.ipcRenderer.send('update');
    };
    $scope.downloadUpdate = function () {
        $scope.download = false;
        $scope.showSpinner = true;
        window.electron.ipcRenderer.send('download');
    }

    // render messages from server
    window.electron.receive('checking-for-update', function (data) {
        $scope.$digest($scope.showSpinner = true);
        $scope.$digest($scope.text = data);
    });
    window.electron.receive('update-available', function (data) {
        $scope.$digest($scope.showSpinner = false);
        $scope.$digest($scope.download = true);
        $scope.$digest($scope.text = `version ${data.version} is available.`);
    });
    window.electron.receive('up-to-date', function (data) {
        $scope.$digest($scope.showSpinner = false);
        $scope.$digest($scope.checked = false);
        $scope.$digest($scope.text = `your current version is up-to-date.`);
        console.log(data);
    });
    window.electron.receive('error', function (data) {
        $scope.$digest($scope.showSpinner = false);
        $scope.$digest($scope.checked = false);
        $scope.$digest($scope.download = false);
        $scope.$digest($scope.text = `an error has occured!.`);
        console.log(data);
    });
    window.electron.receive('downloading', function (data) {
        console.log(data);
        $scope.$digest($scope.showSpinner = false);
        $scope.$digest($scope.download = false);
        $scope.$digest($scope.downloading = true);
        $scope.$digest($scope.data = data);
        $scope.$digest($scope.text = `Downloading: ${data.percent.toFixed(2)}%`)
        $('#progressBar').css("width", data.percent + "%");
    });
    window.electron.receive('downloaded', function (data) {
        $scope.$digest($scope.downloading = false);
        $scope.$digest($scope.downloaded = true);
        $scope.$digest($scope.download = false);
        $scope.$digest($scope.text = `Ready to install version ${data.version} of size ${((data.files[0]['size'])/1000000).toFixed(2)} MB.`)
    });

    $scope.applyUpdate = function () {
        window.electron.ipcRenderer.send('applyUpdate');
    };
});