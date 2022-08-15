app.service('DateService', function () {
    this.getDate = () => {
        var d = new Date();
        months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        return d.getFullYear() + '-' + months[d.getMonth()] + '-' + d.getDate();
    };

     this.getTime = () => {
        var d = new Date();
        return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    };
});