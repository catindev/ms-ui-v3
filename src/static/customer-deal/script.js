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


    function template({ _id, name, trunk, phones, account: { noTargetReasons } }) {
        return `
        <h1 class="mobilePadding">
            <a href="/customers/${ _id}" class="backButton"></a>
            ${ name}
        </h1>
        <h2>Закрыть сделку</h2>

        <div class="message" id="errorMessage"></div>

        <label for="amount">Сумма сделки</label>
        <input type="number" id="amount" name="amount" class="js-input" />

        <label for="info">Комментарий</label>
        <input type="text" id="comment" name="comment" class="js-input" />
        
        <div class="buttonsPanel">
            <button>Сохранить</button>
            <a href="/customers/${ _id}" class="button default">
                Отменить
            </a>
        </div>           
        `
    }

    let _id;

    fetch(`${Config.API_HOST}/customers/${location.pathname.split('/')[2]}?token=${getCookie('msid')}`)
        .then(response => response.json())
        .then(checkResponse)
        .then(({ customer }) => {
            _id = customer._id
            dealForm.classList.remove('preloader');
            dealForm.innerHTML = template(customer);
            hideTabsOnFocus();
        })
        .catch(error => console.error('Error:', error.message));


    /* Form logic */

    let isRequest = false;

    dealForm.addEventListener("submit", function (event) {
        event.preventDefault();

        errorMessage.style.display = 'none';
        if (isRequest == true) return false;
        const { amount, comment } = dealForm;

        if (!amount.value) {
            window.scrollTo(0, 0);
            errorMessage.innerText = 'Заполните сумму сделки'
            errorMessage.style.display = 'block'
            dealForm.classList.add('shake')
            setTimeout(() => dealForm.classList.remove('shake'), 1000)
            return false
        }

        isRequest = true;
        fetch(`${Config.API_HOST}/customers/${_id}/deal?token=${getCookie('msid')}`, {
            method: "put",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                amount: amount.value,
                comment: comment.value
            })
        })
            .then(response => response.json())
            .then(checkResponse)
            .then(() => { document.location.href = '/customers' })
            .catch(error => {
                isRequest = false;

                console.error('Error:', error.message)

                errorMessage.innerText = error.message + '  😦'
                errorMessage.style.display = 'block'

                dealForm.classList.add('shake')
                setTimeout(() => dealForm.classList.remove('shake'), 1000)
            });

    })
})();