(function () {
    // var OneSignal = window.OneSignal || [];

    fetch(`${Config.API_HOST}/users/me?token=${getCookie('msid')}&today=true`)
        .then(response => response.json())
        .then(checkResponse)
        .then(({ user }) => {
            console.log('user', user._id, user.account._id)

            OneSignal.push(["getNotificationPermission", function (permission) {
                if (permission === 'granted') OneSignal.sendTags({
                    'userId': user._id, 'accountId': user.account._id,
                }).then(function (tagsSent) {
                    console.log('Tags sent state:', tagsSent);
                });
                console.log("Site Notification Permission:", permission);
            }]);
        })
        .catch(error => console.error('Error:', error.message));

})();