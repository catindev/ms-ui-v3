var isCallbackInProgress = false;

function registerCallbacks() {
    if (isCallbackInProgress === true) return false;

    isCallbackInProgress = true;
    const requestTimestamp = new Date().getTime();
    const callButtons = document.getElementsByClassName('callbackButton');

    const callHandler = function () {
        callbackLayout.style.display = 'block';

        const customer = this.getAttribute('customer');
        fetch(`${Config.API_HOST}/customers/${customer}/cold.call?token=${getCookie('msid')}&client_timestamp=${requestTimestamp}`)
            .then(response => response.json())
            .then(checkResponse)
            .then(response => {
                isCallbackInProgress = false;
                callbackLayout.style.display = 'none';
            })
            .catch(error => {
                isCallbackInProgress = false;
                callbackLayout.style.display = 'none';
                console.error('Ошибка. Вызов отклонён');
            });
    }

    for (var i = 0; i < callButtons.length; i++) {
        callButtons[i].addEventListener('click', callHandler, false)
    }

}