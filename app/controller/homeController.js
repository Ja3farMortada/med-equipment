app.controller('homeController', function ($scope, homeFactory, DateService, suppliersFactory, NotificationService) {


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
        column: 's.name',
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
            est_report: 0,
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

    // define modal
    const infoModal = new bootstrap.Modal('#infoModal');
    // Open more info modal
    $scope.moreInfoModal = data => {
        $scope.moreInfoData = data;
        $scope.extensionData = [];
        $scope.newExtensionData = {
            equipment_ID_FK: data.record_ID,
            ext_name: null,
            ext_serial_no: null,
            ext_notes: null
        }
        homeFactory.getExtensions(data.record_ID).then(response => {
            angular.copy(response, $scope.extensionData);
            console.log($scope.extensionData);
            infoModal.show();
        })
    }
    // add extension
    $scope.addExtension = () => {
        homeFactory.addExtension($scope.newExtensionData).then(response => {
            if(response == 'added') {
                infoModal.hide()
            }
        })
    }
    // delete extension
    $scope.deleteExtension = (index, ID) => {
        NotificationService.showWarning().then(res => {
            if (res.isConfirmed) {
                homeFactory.deleteExtension(ID).then(res => {
                    if (res == 'deleted') {
                        $scope.extensionData.splice(index, 1);
                    }
                })
            }
        })
    }

    // define modal
    const serviceModal = new bootstrap.Modal('#serviceModal');
    $scope.openServiceModal = data => {
        $scope.serviceModalData = [];
        $scope.newServiceData = {
            equipment_ID_FK: data.record_ID,
            service_type: 'ppm',
            service_description: null,
            service_date: DateService.getDate(),
            service_time: DateService.getTime(),
            service_notes: null
        }
        homeFactory.getService(data.record_ID).then(response => {
            angular.copy(response, $scope.serviceModalData);
            serviceModal.show();
        })
    }
    // submit new service
    $scope.submitNewService = () => {
        homeFactory.submitNewService($scope.newServiceData).then(response => {
            if (response == 'added') {
                serviceModal.hide();
            }
        })
    }
    // delete service
    $scope.deleteService = (index, ID) => {
        NotificationService.showWarning().then(res => {
            if (res.isConfirmed) {
                homeFactory.deleteService(ID).then(response => {
                    if (response) {
                        $scope.serviceModalData.splice(index, 1);
                    }
                })
            }
        })
    }

    // export excel
    $scope.exportExcel = () => {
        homeFactory.exportExcel($scope.equipments);
    }

});