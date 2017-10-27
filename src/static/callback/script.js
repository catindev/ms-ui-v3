function registerCallbacks() {
    const callButtons = document.getElementsByClassName('callbackButton');

    const callHandler = function() {
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