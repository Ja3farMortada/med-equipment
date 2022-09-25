app.factory('reportsFactory', function ($http, NotificationService) {

    let url = NotificationService.getUrl();

    var model = {};

    model.serviceReport = [];
    model.topServiced = [];

    model.getServiceReport = year => {
        $http.get(`${url}/getServiceReport`, {
            params: {
                year: year
            }
        }).then(function (response) {
            angular.copy(response.data, model.serviceReport);
            model.serviceReportChart();
        }, function (error) {
            NotificationService.showError(error);
        });
    }

    // get top services equipments
    model.getTopServicedEquipments = year => {
        $http.get(`${url}/getTopServicedEquipments`, {
            params: {
                year: year
            }
        }).then(function (response) {
            angular.copy(response.data, model.topServiced);
            model.topServicedChart();
            console.log(response.data);
        }, function (error) {
            NotificationService.showError(error);
        });
    }


    // draw year chart
    model.serviceReportChart = function () {
        if (typeof serviceReportChart !== 'undefined') {
            serviceReportChart.destroy();
        };
        if (model.serviceReport.length != 0) {
            let results = this.serviceReport.map(function (obj) {
                return obj.count;
            });
            var ctx = document.getElementById('serviceReport').getContext('2d');
            serviceReportChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`],
                    datasets: [{
                        // backgroundColor: ['#dc3545'], // '#dc3545', '#007bff', '#ffc107', '#17a2b8'
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        data: results,
                        // stack: 'Stack 0'
                    }, ]
                },
                options: {
                    // fill: true,
                    // indexAxis: 'y',
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            ticks: {
                                stepSize: 1
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }
    }

    // draw top serviced equipments chart
    model.topServicedChart = () => {
        if (typeof topServicedChart !== 'undefined') {
            topServicedChart.destroy();
        }
        let labels = model.topServiced.map(obj => {
            return obj.asset
        });
        let data = model.topServiced.map(obj => {
            return obj.count;
        });
        var ctx = document.getElementById('topServiced').getContext('2d');
        topServicedChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    backgroundColor: ['#007bff', '#dc3545' , '#ffc107', '#17a2b8', '#343a40'],
                    data: data,
                    // stack: 'Stack 0'
                }]
            },
            options: {
                // fill: true,
                // indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            stepSize: 1
                        }
                    },
                    // x: {
                    //     grid: {
                    //         display: false
                    //     }
                    // }
                }
            }
        });
    }

    return model;
})