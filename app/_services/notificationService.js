app.service('NotificationService', ['$timeout', function ($timeout) {

    this.showSuccess = () => {
        Swal.fire({
            title: ' ',
            text: 'Process Completed Successfully!',
            icon: 'success',
            position: 'bottom-end',
            toast: true,
            background: 'green',
            timer: 2000,
            showConfirmButton: false
        });
    };

    this.showError = error => {
        Swal.fire({
            title: 'ERROR!',
            text: `${error.data.sqlMessage}`,
            icon: 'error'
        });
    };

    this.showErrorText = text => {
        Swal.fire({
            title: 'ERROR!',
            text: `${text}`,
            icon: 'error'
        });
    };

    this.getUrl = () => {
        return `http://localhost:3000`;
    }

}]);