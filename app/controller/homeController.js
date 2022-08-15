app.controller('homeController', function ($scope, homeFactory, DateService) {


    // $scope.moment = moment(DateService.getDate());
    $scope.moment = date => {
        return moment(date).diff(DateService.getDate(), 'days');
    }

    // bind with model
    $scope.equipments = homeFactory.equipments;

    // search array
    $scope.searchArray = [{
        label: 'Supplier',
        column: 'supplier',
        value: null
    }, {
        label: 'Department',
        column: 'department',
        value: null
    }];

    $scope.ppmValue = {
        label: 'PPM',
        column: 'ppm_schedule',
        value: 'all'
    };

    // search function
    $scope.search = () => {
        $scope.loading = true;
        homeFactory.search([$scope.searchArray, $scope.ppmValue]).then(() => {
            $scope.loading = false;
        })
    }

    // empty fields
    $scope.empty = () => {
        // $scope.searchVal = '';
        // $scope.isValid = true;
        homeFactory.equipments = [];
        $scope.equipments = homeFactory.equipments;
        for (let i = 0; i < $scope.searchArray.length; i++) {
            $scope.searchArray[i]['value'] = '';
        }
        $scope.ppmValue.value = 'all'
    }
})