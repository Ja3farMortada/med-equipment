app.factory('suppliersFactory', function($http, NotificationService) {

    let url = NotificationService.getUrl();

    const model = {}
    model.suppliers = [];

    const getSuppliers = () => {
        $http.get(`${url}/getSuppliers`).then(results => {
            angular.copy(results.data, model.suppliers);
        }, error => {
            NotificationService.showError(error);
        });
    }
    getSuppliers();

    model.fetchSuppliers = () => {
        getSuppliers();
    }

    // add supplier
    model.submitAddSupplier = data => {
        return $http.post(`${url}/addSupplier`, data).then(response => {
            NotificationService.showSuccess();
            return response.data;
        }, error => {
            NotificationService.showError(error);
        })
    }

    // edit supplier
    model.submitEditSupplier = data => {
        $http.post(`${url}/editSupplier`, data).then(() => {
            NotificationService.showSuccess();
        }, error => {
            NotificationService.showError(error);
        })
    }

    // delete supplier
    // delete
    model.deleteSupplier = ID => {
        return NotificationService.showWarning().then(ok => {
            if (ok.isConfirmed) {
                return $http.post(`${url}/deleteSupplier`, {ID:ID}).then(() => {
                    NotificationService.showSuccess();
                    return 1;
                }, error => {
                    NotificationService.showError(error);
                    return 0;
                })
            }
        })
    }

    return model;
});