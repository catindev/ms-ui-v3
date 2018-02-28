(function () {

    let isRequest = false;

    const CUSTOMERID = location.pathname.split('/')[2];

    const inputs = document.getElementsByClassName('js-input');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('focus', function () {
            bottomTabs.style.display = 'none'
        }, false);
        inputs[i].addEventListener('blur', function () {
            const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
            if (width < 1024) bottomTabs.style.display = 'block'
        }, false);
    }

    newContactForm.addEventListener("submit", function (event) {
        event.preventDefault();
        errorMessage.style.display = 'none'
        if (isRequest == true) return false;
        const { phone, name } = newContactForm

        if (!phone.value || !name.value) {
            newContactForm.classList.add('shake')
            setTimeout(() => newContactForm.classList.remove('shake'), 1000)
            return false
        }

        isRequest = true;
        fetch(`${Config.API_HOST}/customers/${CUSTOMERID}/contacts?token=${getCookie('msid')}`, {
            method: "post",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                phone: phone.value,
                name: name.value
            })
        })
            .then(response => response.json())
            .then(checkResponse)
            .then(({ id }) => { document.location.href = '/customers/' + CUSTOMERID })
            .catch(error => {
                isRequest = false;

                console.error('Error:', error.message)

                errorMessage.innerText = error.message + '  😦'
                errorMessage.style.display = 'block'

                newContactForm.classList.add('shake')
                setTimeout(() => newContactForm.classList.remove('shake'), 1000)
            });

    })


    fetch(`${Config.API_HOST}/customers/${CUSTOMERID}?token=${getCookie('msid')}&params=1`)
        .then(response => response.json())
        .then(checkResponse)
        .then(({ customer }) => {
            contactName.innerText = customer.name;
            if (customer.funnelStep === 'cold') cancelButton.setAttribute('href', '/leads/cold/' + customer._id)
            else cancelButton.setAttribute('href', '/customers/' + customer._id)
        })
        .catch(error => console.error('Error:', error.message));

})();