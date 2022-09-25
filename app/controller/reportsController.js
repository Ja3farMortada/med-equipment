app.controller('reportsController', function($scope, reportsFactory, DateService) {

    $scope.selectedYear = DateService.getYear();
    $scope.topServiced = reportsFactory.topServiced;

    reportsFactory.getServiceReport($scope.selectedYear);
    reportsFactory.getTopServicedEquipments($scope.selectedYear);

    $scope.years = [];
    for (let i = 2022; i <= DateService.getYear() + 1; i++) {
        $scope.years.push(i);
    }


    $scope.getReports = () => {
        reportsFactory.getServiceReport($scope.selectedYear);
        reportsFactory.getTopServicedEquipments($scope.selectedYear);
    }
})