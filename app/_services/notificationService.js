app.service('NotificationService', ['$timeout', function ($timeout) {

    this.getUrl = () => {
        return `http://localhost:3000`;
    }

    let successAudio = new Audio('assets/ding-sound.mp3');
    let errorAudio = new Audio('assets/error-2.wav');

    this.showSuccess = () => {
        successAudio.play();
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
        errorAudio.play();
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

    this.showWarning = () => {
        return Swal.fire({
            title: "WARNING",
            text: "Are you sure you want to proceed?",
            icon: "warning",
            showCancelButton: true,
            focusConfirm: false,
            reverseButtons: true
        });
    };

}]);