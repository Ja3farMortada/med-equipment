app.service('NotificationService', ['$timeout', function ($timeout) {

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
            text: `${error.data}`,
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