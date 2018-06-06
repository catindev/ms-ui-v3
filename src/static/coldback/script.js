var isColdbackInProgress = false;
function coldbackNow(elem) {
    if (isColdbackInProgress === true) return false;
    callbackLayout.style.display = 'block';

    isColdbackInProgress = true;
    const customer = elem.getAttribute('customer');

    fetch(`${Config.API_HOST}/customers/${customer}/call?token=${getCookie('msid')}&client_timestamp=${new Date().getTime()}`)
        .then(response => response.json())
        .then(checkResponse)
        .then(response => {
            isColdbackInProgress = false;
            callbackLayout.style.display = 'none';
        })
        .catch(error => {
            isColdbackInProgress = false;
            callbackLayout.style.display = 'none';
            console.error('Ошибка. Вызов отклонён');
        });
}