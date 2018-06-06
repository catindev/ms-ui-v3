var isCallbackInProgress = false;

function callbackNow(elem) {
    if (isCallbackInProgress === true) return false;
    callbackLayout.style.display = 'block';

    isCallbackInProgress = true;
    const customer = elem.getAttribute('customer');

    fetch(`${Config.API_HOST}/customers/${customer}/call?token=${getCookie('msid')}&client_timestamp=${new Date().getTime()}`)
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


function registerCallbacks() {
    const callButtons = document.getElementsByClassName('callbackButton');

    const callHandler = function () {
        callbackLayout.style.display = 'block';

        const customer = this.getAttribute('customer');
        fetch(`${Config.API_HOST}/customers/${customer}/call?token=${getCookie('msid')}`)
            .then(response => response.json())
            .then(checkResponse)
            .then(response => callbackLayout.style.display = 'none')
            .catch(error => {
                callbackLayout.style.display = 'none';
                console.error('Ошибка. Вызов отклонён');
            });
    }

    for (var i = 0; i < callButtons.length; i++) {
        callButtons[i].addEventListener('click', callHandler, false)
    }

}