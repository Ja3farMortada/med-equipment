app.factory('homeFactory', function ($http, NotificationService) {

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
        $http.get(`${url}/getRecentEquipments`).then(results => {
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
        return $http.post(`${url}/search`, data).then(response => {
            angular.copy(response.data, model.equipments);
        }, error => {
            NotificationService.showError(error);
        });
    }

    model.submitAddEquipment = data => {
        return $http.post(`${url}/addEquipment`, data).then(response => {
            NotificationService.showSuccess();
            return response.data;
        }, error => {
            NotificationService.showError(error);
        })
    }

    model.submitEditEquipment = data => {
        $http.post(`${url}/editEquipment`, data).then(() => {
            NotificationService.showSuccess();
        }, error => {
            NotificationService.showError(error);
        })
    }

    // delete
    model.deleteEquipment = ID => {
        return NotificationService.showWarning().then(ok => {
            if (ok.isConfirmed) {
                return $http.post(`${url}/deleteEquipment`, {
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
        console.log(ID);
        return $http.get(`${url}/getService`, {
            params: {
                ID: ID
            }
        }).then(response => {
            return response.data;
        }, error => {
            NotificationService.showError(error);
        })
    }

    return model;
});