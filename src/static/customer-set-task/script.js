(function () {

    function hideTabsOnFocus() {
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
    }

    function template({ _id, name, task: { when = '', what = '', time = '' } = {} }) {
        return `
        <h1 class="mobilePadding">
            <a href="/customers/${ _id}" class="backButton"></a>
            ${ name}
        </h1>
        <h2>Поставить задачу</h2>         

        <div class="message" id="errorMessage"></div>

        <label for="what">Что сделать</label>
        <input type="text" id="what" name="what" value="${what}" class="js-input" />
        
        <label for="when">Когда</label>
        <input type="date" id="when" name="when" value="${when}" class="js-input" />

        <label for="time">Во сколько</label>
        <input type="time" id="time" name="time" value="${time}" class="js-input" />

        <div class="buttonsPanel">
            <button>Сохранить</button>
            <a href="/customers/${ _id}" class="button default">
                Отменить
            </a>
        </div>           
        `
    }

    let _id, customparams, CUSTOMER;

    fetch(`${Config.API_HOST}/customers/${location.pathname.split('/')[2]}?token=${getCookie('msid')}&params=1`)
        .then(response => response.json())
        .then(checkResponse)
        .then(({ customer }) => {
            _id = customer._id;
            CUSTOMER = customer;
            customparams = customer.params;

            editForm.classList.remove('preloader');
            editForm.innerHTML = template(customer);

            hideTabsOnFocus();
        })
        .catch(error => console.error('Error:', error.message));


    /* Form logic */

    let isRequest = false;

    editForm.addEventListener("submit", function (event) {
        event.preventDefault();

        errorMessage.style.display = 'none';
        console.log(isRequest)
        if (isRequest == true) return false;

        const { when, what, time } = editForm;

        if (!when.value || !what.value || !time.value) {
            window.scrollTo(0, 0);
            errorMessage.innerText = 'Заполните форму полностью'
            errorMessage.style.display = 'block'
            editForm.classList.add('shake')
            setTimeout(() => editForm.classList.remove('shake'), 1000)
            return false
        }

        isRequest = true;
        fetch(`${Config.API_HOST}/customers/${_id}/set.task?token=${getCookie('msid')}`, {
            method: "put",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                when: when.value, what: what.value, time: time.value
            })
        })
            .then(response => response.json())
            .then(checkResponse)
            .then(() => { document.location.href = '/customers/' + _id })
            .catch(error => {
                isRequest = false;

                console.error('Error:', error.message)

                errorMessage.innerText = error.message + '  😦'
                errorMessage.style.display = 'block'

                editForm.classList.add('shake')
                setTimeout(() => editForm.classList.remove('shake'), 1000)
            });

    })
})();