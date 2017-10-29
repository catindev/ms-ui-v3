(function() {

    let isRequest = false;

    const inputs = document.getElementsByClassName('js-input');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('focus', function() {
            bottomTabs.style.display = 'none'
        }, false);
        inputs[i].addEventListener('blur', function() {
            const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
            if (width < 1024) bottomTabs.style.display = 'block'
        }, false);
    }

    newColdForm.addEventListener("submit", function(event) {
        event.preventDefault();
        errorMessage.style.display = 'none'
        if (isRequest == true) return false;
        const { phones, name, info } = newColdForm

        if (!phones.value || !name.value || !info.value) {
            newColdForm.classList.add('shake')
            setTimeout(() => newColdForm.classList.remove('shake'), 1000)
            return false
        }

        isRequest = true;
        fetch(Config.API_HOST + "/customers/cold.leads?token=" + getCookie('msid'), {
                method: "post",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    phones: phones.value,
                    name: name.value,
                    info: info.value
                })
            })
            .then(response => response.json())
            .then(checkResponse)
            .then(({ id }) => { document.location.href = '/leads/cold' })
            .catch(error => {
                isRequest = false;
                
                console.error('Error:', error.message)

                errorMessage.innerText = error.message + '  😦'
                errorMessage.style.display = 'block'

                newColdForm.classList.add('shake')
                setTimeout(() => newColdForm.classList.remove('shake'), 1000)
            });

    })

})();