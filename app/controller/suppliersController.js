app.controller('suppliersController', function($scope, suppliersFactory) {

    $scope.suppliers = suppliersFactory.suppliers;


    // suppliersModal
    // define modal
    const suppliersModal = new bootstrap.Modal('#suppliersModal');

    // add modal
    $scope.openAddModal = () => {
        $scope.modalTitle = 'Add Supplier';
        $scope.modalData = {
            name: null,
            phone: null,
            address: null
        }
        suppliersModal.show()
    }

    // edit modal
    $scope.openEditModal = data => {
        $scope.modalTitle = 'Edit Supplier';
        $scope.modalData = {};
        angular.copy(data, $scope.modalData);
        suppliersModal.show();
    }

    // submit modal
    $scope.submit = () => {
        switch ($scope.modalTitle) {
            case 'Add Supplier':
                suppliersFactory.submitAddSupplier($scope.modalData).then(response => {
                    if (response) {
                        $scope.suppliers.push(response);
                        suppliersModal.hide();
                    }
                })
                break;

            case 'Edit Supplier':
                suppliersFactory.submitEditSupplier($scope.modalData);
                suppliersModal.hide();
                // suppliersFactory.search([$scope.searchArray, $scope.ppmValue]);
                suppliersFactory.fetchSuppliers();
                break;
        }
    }

    $scope.deleteSupplier = () => {
        suppliersFactory.deleteSupplier($scope.modalData.supplier_ID).then((response) => {
            if (response == 1) {
                suppliersModal.hide();
                suppliersFactory.fetchSuppliers();
            }
        })
    }

})