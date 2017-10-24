(function() {


    loginForm.addEventListener("submit", function(event) {
        event.preventDefault()

        infoMessage.style.display = 'none'
        errorMessage.style.display = 'none'
        loginForm.classList.remove("shake")

        const { login, code } = loginForm

        if (!login.value && !code.value) {
            loginForm.classList.add("shake")
            setTimeout(() => loginForm.classList.remove("shake"), 1000)
            return false
        }

        const body = code.value !== '' ? 
            JSON.stringify({ code: code.value })
            :
            JSON.stringify({ phone: login.value })

        const endpoint = code.value !== '' ? '/sessions' : '/sessions/password'
        console.log(endpoint, body)

        fetch(Config.API_HOST + endpoint, {
                method: "post",
                headers: { "Content-type": "application/json" },
                body
            })
            .then(response => response.json())
            .then(jsonResponse => {
                if (jsonResponse.status !== 200) throw Error(jsonResponse.message)
                return jsonResponse
            })
            .then(({ token }) => {
                if (code.value === '') {                   
                    theButton.innerText = 'Войти'                    
                    phoneNumber.style.display = 'none'
                    smsCode.style.display = 'block'
                    infoMessage.style.display = 'block'
                    return false
                }

                const expires = new Date(new Date().getTime() + 31536000000)
                document.cookie = `msid=${token};expires=${expires};path=/`
                window.location.reload()
            })
            .catch(error => {
                errorMessage.innerText = error.message + '  😦'
                errorMessage.style.display = 'block'
                loginForm.classList.add("shake")
                setTimeout(() => loginForm.classList.remove("shake"), 1000)
            })
    })
})()