(function() {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const { login, password } = loginForm;
        if (!login.value || !password.value) {
            loginForm.classList.add("shake");
            setTimeout(() => loginForm.classList.remove("shake"), 1000);
        }

        const body = JSON.stringify({ login: login.value, password: password.value });

        fetch(Config.API_HOST + "/sessions", {
                method: "post",
                headers: { "Content-type": "application/json" },
                body
            })
            .then(response => response.json())
            .then(jsonResponse => {
              console.logjsonResponse
                if (jsonResponse.status !== 200) throw Error(jsonResponse.message);
                return jsonResponse;
            })
            .then(({ token }) => {
                const expires = new Date(new Date().getTime() + 31536000000);
                document.cookie = `msid=${token};expires=${expires};path=/`;
                window.location.reload();
            })
            .catch(error => {
                console.error('Error:',error.message)
                loginForm.classList.add("shake");
                setTimeout(() => loginForm.classList.remove("shake"), 1000);
            });
    });
})();