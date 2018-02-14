(function () {
    var OneSignal = window.OneSignal || [];

    fetch(`${Config.API_HOST}/users/me?token=${getCookie('msid')}&today=true`)
        .then(response => response.json())
        .then(checkResponse)
        .then(user => {
            console.log('user', user)

            OneSignal.push(function () {
                OneSignal.init({ appId: "6b6458f2-a7b7-4665-bfb9-63d9214c3ceb" });

                OneSignal.push(["getNotificationPermission", function (permission) {
                    console.log("Site Notification Permission:", permission);
                }]);
            });
        })
        .catch(error => console.error('Error:', error.message));

})();