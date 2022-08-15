app.factory('homeFactory', function ($http, NotificationService) {

    let url = NotificationService.getUrl();

    const model = {};
    model.equipments = [];

    const getEquipments = () => {
        $http.get(`${url}/getEquipments`).then(results => {
            angular.copy(results.data, model.equipments);
        }, error => {
            NotificationService.showError(error);
        });
    }
    // getEquipments();

    model.search = data => {
        return $http.post(`${url}/search`, data).then(response => {
            angular.copy(response.data, model.equipments);
        }, error => {
            NotificationService.showError(error);
        });
    }

    return model;
});