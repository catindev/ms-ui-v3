(function () {

    let isRequest = false;

    const CONTACTID = location.pathname.split('/')[2];

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

    editContactForm.addEventListener("submit", function (event) {
        event.preventDefault();
        errorMessage.style.display = 'none'
        if (isRequest == true) return false;
        const { phone, name, successURL } = editContactForm

        if (!phone.value || !name.value) {
            editContactForm.classList.add('shake')
            setTimeout(() => editContactForm.classList.remove('shake'), 1000)
            return false
        }

        isRequest = true;
        fetch(`${Config.API_HOST}/contacts/${CONTACTID}?token=${getCookie('msid')}`, {
            method: "put",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                phone: phone.value,
                name: name.value
            })
        })
            .then(response => response.json())
            .then(checkResponse)
            .then(({ id }) => {
                document.location.href = successURL.value
            })
            .catch(error => {
                isRequest = false;

                console.error('Error:', error.message)

                errorMessage.innerText = error.message + '  😦'
                errorMessage.style.display = 'block'

                editContactForm.classList.add('shake')
                setTimeout(() => editContactForm.classList.remove('shake'), 1000)
            });

    })


    fetch(`${Config.API_HOST}/contacts/${CONTACTID}?token=${getCookie('msid')}&populate=customer`)
        .then(response => response.json())
        .then(checkResponse)
        .then(({ contact }) => {
            customerName.innerText = contact.customer.name + ' / ' + contact.name;
            document.getElementById('phone').value = contact.phone;
            document.getElementById('name').value = contact.name;
            document.getElementById('successURL').value = contact._id;
            if (contact.customer.funnelStep === 'cold') {
                cancelButton.setAttribute('href', '/leads/cold/' + contact.customer._id);
                successURL.value = '/leads/cold/' + contact.customer._id;
            }
            else {
                cancelButton.setAttribute('href', '/customers/' + contact.customer._id);
                successURL.value = '/customers/' + contact.customer._id;
            }
        })
        .catch(error => console.error('Error:', error.message));

})();