(function () {
    // var OneSignal = window.OneSignal || [];

    fetch(`${Config.API_HOST}/users/me?token=${getCookie('msid')}&today=true`)
        .then(response => response.json())
        .then(checkResponse)
        .then(user => {
            console.log('user', user)

            OneSignal.push(["getNotificationPermission", function (permission) {
                console.log("Site Notification Permission:", permission);
            }]);
        })
        .catch(error => console.error('Error:', error.message));

})();