(function () {
    // var OneSignal = window.OneSignal || [];

    fetch(`${Config.API_HOST}/users/me?token=${getCookie('msid')}&today=true`)
        .then(response => response.json())
        .then(checkResponse)
        .then(({ user }) => {
            console.log('user', user._id, user.account._id)

            OneSignal.push(["getNotificationPermission", function (permission) {
                if (permission === 'granted') {
                    OneSignal.sendTags({
                        'userId': user._id, 'accountId': user.account._id,
                    }).then(function (tagsSent) {
                        document.getElementById('description').innerText = 'Уведомления включены 👍'
                        console.log('Tags sent state:', tagsSent);
                    })
                } else {
                    if (permission === 'default') document.getElementById('description').innerText = 'Ожидаем включения 🦑'
                    else document.getElementById('description').innerText = 'Уведомления не включены 😳'
                }
                console.log("Site Notification Permission:", permission);
            }]);
        })
        .catch(error => console.error('Error:', error.message));

})();