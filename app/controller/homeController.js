app.controller('homeController', function ($scope, homeFactory, DateService, suppliersFactory) {


    // bind with model
    $scope.equipments = homeFactory.equipments;
    $scope.recentEquipments = homeFactory.recentEquipments;

    $scope.suppliers = suppliersFactory.suppliers;

    // Tabs selection
    $scope.tabSelected = homeFactory.tabSelected;
    $scope.selectTab = tab => {
        if (tab != homeFactory.tabSelected) {
            homeFactory.selectTab(tab);
            $scope.tabSelected = homeFactory.tabSelected;
            $scope.items = null;
            $scope.activeRow = null;
        }
    };

    // Moment init
    $scope.moment = date => {
        return moment(date).diff(DateService.getDate(), 'days');
    }
    // define datepicker value
    // $scope.datePickerValue = scannerFactory.datePickerValue;
    function datepicker() {
        $('#installationDate').datepicker({
            dateFormat: 'yy-mm-dd',
            onSelect: function () {
                var d = $('#installationDate').datepicker({
                    dateFormat: 'yy-mm-dd'
                }).val();
                // scannerFactory.datePickerValue = d;
                $scope.$digest($scope.modalData.installation_date = d);
            }
        }).datepicker("setDate", null);
        $('#schedule').datepicker({
            dateFormat: 'yy-mm-dd',
            onSelect: function () {
                var d = $('#schedule').datepicker({
                    dateFormat: 'yy-mm-dd'
                }).val();
                // scannerFactory.datePickerValue = d;
                $scope.$digest($scope.modalData.ppm_schedule = d);
            }
        }).datepicker("setDate", null);
        $('#lastPPM').datepicker({
            dateFormat: 'yy-mm-dd',
            onSelect: function () {
                var d = $('#lastPPM').datepicker({
                    dateFormat: 'yy-mm-dd'
                }).val();
                // scannerFactory.datePickerValue = d;
                $scope.$digest($scope.modalData.ppm_done = d);
            }
        }).datepicker("setDate", null);
    };
    datepicker();


    // search array
    $scope.searchArray = [{
        label: 'Description',
        column: 'description',
        value: null
    }, {
        label: 'Serial No.',
        column: 'serial_no',
        value: null
    }, {
        label: 'Department',
        column: 'department',
        value: null
    }, {
        label: 'Supplier',
        column: 'supplier',
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


    // define modal
    const equipmentsModal = new bootstrap.Modal('#equipmentsModal');

    // add eq modal
    $scope.openAddEquipmentModal = () => {
        $scope.modalTitle = 'Add Equipment';
        $scope.modalData = {
            description: null,
            asset_no: null,
            department: null,
            est_report: false,
            installation_date: null,
            ppm_schedule: null,
            ppm_done: null,
            supplier_ID_FK: null,
            model: null,
            serial_no: null,
            maker: null,
            notes: null,
            date_added: DateService.getDate(),
            record_status: 1
        }
        equipmentsModal.show()
    }

    // edit eq modal
    $scope.openEditEquipmentModal = data => {
        $scope.modalTitle = 'Edit Equipment';
        $scope.modalData = {};
        angular.copy(data, $scope.modalData);
        console.log($scope.modalData);
        equipmentsModal.show();
    }

    // submit modal
    $scope.submit = () => {
        switch ($scope.modalTitle) {
            case 'Add Equipment':
                homeFactory.submitAddEquipment($scope.modalData).then(response => {
                    if (response) {
                        $scope.recentEquipments.push(response);
                        equipmentsModal.hide();
                    }
                })
                break;

            case 'Edit Equipment':
                homeFactory.submitEditEquipment($scope.modalData);
                equipmentsModal.hide();
                homeFactory.search([$scope.searchArray, $scope.ppmValue]);
                homeFactory.fetchRecent();
                break;
        }
    }

    $scope.deleteEquipment = () => {
        homeFactory.deleteEquipment($scope.modalData.record_ID).then((response) => {
            if (response == 1) {
                equipmentsModal.hide();
                homeFactory.search([$scope.searchArray, $scope.ppmValue]);
            }
        })
    }

});