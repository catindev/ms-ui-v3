'use strict';

(function () {

    var loginForm = document.getElementById('loginForm');

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        infoMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        loginForm.classList.remove("shake");

        var login = loginForm.login,
            code = loginForm.code;


        if (!login.value && !code.value) {
            loginForm.classList.add("shake");
            setTimeout(function () {
                return loginForm.classList.remove("shake");
            }, 1000);
            return false;
        }

        var body = code.value !== '' ? JSON.stringify({ code: code.value }) : JSON.stringify({ phone: login.value });

        var endpoint = code.value !== '' ? '/sessions' : '/sessions/password';
        console.log(endpoint, body);

        fetch(Config.API_HOST + endpoint, {
            method: "post",
            headers: { "Content-type": "application/json" },
            body: body
        }).then(function (response) {
            return response.json();
        }).then(checkResponse).then(function (_ref) {
            var token = _ref.token;

            if (code.value === '') {
                theButton.innerText = 'Войти';
                phoneNumber.style.display = 'none';
                smsCode.style.display = 'block';
                infoMessage.style.display = 'block';
                return false;
            }

            var expires = new Date(new Date().getTime() + 31536000000);
            document.cookie = 'msid=' + token + ';expires=' + expires + ';path=/';
            window.location.reload();
        }).catch(function (error) {
            if (message === 'Failed to fetch') message = 'Ошибка входа. Проверьте подключен ли компьютер к интернету';
            errorMessage.innerText = (message || 'Ошибка входа. Проверьте соединение с интернетом или войдите через браузер <a href="https://www.google.ru/chrome/browser/desktop/index.html">гугл хром</a>') + '  😦';
            errorMessage.style.display = 'block';
            loginForm.classList.add("shake");
            setTimeout(function () {
                return loginForm.classList.remove("shake");
            }, 1000);
        });
    });
})();