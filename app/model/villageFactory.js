app.factory('VillageFactory', function ($http, NotificationService) {

    let url = NotificationService.getUrl();

    const model = {};
    model.tabSelected = 0;
    model.equipments = [];
    model.recentEquipments = [];

    //tab selection
    model.selectTab = function (tab) {
        if (this.tabSelected != tab) {
            switch (tab) {
                case 0:
                    this.tabSelected = 0;
                    break;

                case 1:
                    this.tabSelected = 1;
                    break;
            };
        }
    };

    // get recent
    const getRecentEquipments = () => {
        $http.get(`${url}/getRecentEquipmentsVillage`).then(results => {
            angular.copy(results.data, model.recentEquipments);
        }, error => {
            NotificationService.showError(error);
        });
    }
    getRecentEquipments();

    // fetch recent
    model.fetchRecent = () => {
        getRecentEquipments();
    }

    model.search = data => {
        return $http.post(`${url}/searchVillage`, data).then(response => {
            angular.copy(response.data, model.equipments);
        }, error => {
            NotificationService.showError(error);
        });
    }

    model.submitAddEquipment = data => {
        return $http.post(`${url}/addEquipmentVillage`, data).then(response => {
            NotificationService.showSuccess();
            return response.data;
        }, error => {
            NotificationService.showError(error);
        })
    }

    model.submitEditEquipment = data => {
        $http.post(`${url}/editEquipmentVillage`, data).then(() => {
            NotificationService.showSuccess();
        }, error => {
            NotificationService.showError(error);
        })
    }

    // delete
    model.deleteEquipment = ID => {
        return NotificationService.showWarning().then(ok => {
            if (ok.isConfirmed) {
                return $http.post(`${url}/deleteEquipmentVillage`, {
                    ID: ID
                }).then(() => {
                    NotificationService.showSuccess();
                    return 1;
                }, error => {
                    NotificationService.showError(error);
                    return 0;
                })
            }
        })
    }

    model.getService = ID => {
        return $http.get(`${url}/getServiceVillage`, {
            params: {
                ID: ID
            }
        }).then(response => {
            return response.data;
        }, error => {
            NotificationService.showError(error);
        })
    }

    // submit new service
    model.submitNewService = data => {
        return $http.post(`${url}/addNewServiceVillage`, {
            data: data
        }).then(() => {
            NotificationService.showSuccess();
            return 'added';
        }, error => {
            NotificationService.showError(error);
        })
    }

    // delete service
    model.deleteService = ID => {
        return $http.post(`${url}/deleteServiceVillage`, {
            ID: ID
        }).then(() => {
            NotificationService.showSuccess();
            return 'deleted';
        }, error => {
            NotificationService.showError(error);
        })
    }


    // get extension info
    model.getExtensions = ID => {
        return $http.get(`${url}/getExtensionsVillage`, {
            params: {
                ID: ID
            }
        }).then(response => {
            return response.data;
        }, error => {
            NotificationService.showError(error);
        })
    }

    // add extension
    model.addExtension = data => {
        return $http.post(`${url}/addExtensionVillage`, {
            data: data
        }).then(() => {
            NotificationService.showSuccess();
            return 'added';
        }, error => {
            NotificationService.showError(error);
        })
    }

    // delete extension
    model.deleteExtension = ID => {
        return $http.post(`${url}/deleteExtensionVillage`, {
            ID: ID
        }).then(() => {
            NotificationService.showSuccess();
            return 'deleted';
        }, error => {
            NotificationService.showError(error);
        })
    }

    // export excel
    model.exportExcel = async data => {
        let response = await window.electron.send('export-excel', data);
        if (response == 'success') {
            NotificationService.showSuccess();
        } else if (response == 'error') {
            NotificationService.showError('error')
        }
    }

    return model;
});