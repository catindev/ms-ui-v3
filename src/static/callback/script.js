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