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


    function text({ id, name }) {
        const value = CUSTOMER[id] ? CUSTOMER[id] : '';
        return `
            <label for="${ id}">${name}</label>
            <input type="text" id="${ id}" name="${id}" value="${value}" class="js-input" />
        `
    }

    const isChecked = (customer, fieldID, value) => customer[fieldID] && customer[fieldID].indexOf(value) !== -1 ? 'checked' : '';
    function multiselect({ items, id, name }) {
        const options = (items.map(
            item => {
                const checked = isChecked(CUSTOMER, id, item);
                console.log(id, item, checked)
                return `<li>
                    <label>
                    <input type="checkbox" ${ checked} name="${id}" value="${item}"> 
                        ${ item}
                    </label>
                </li>
            `
            })).join('');

        return `
            <label>${ name}</label>
            <ul>${ options}</ul>
        `
    }

    function getMultiselectValues(domElements) {
        const selected = [].filter.call(domElements, element => element.checked);
        return selected.map(({ value }) => value)
    }
    const isSelected = (customer, fieldID, value) => customer[fieldID] === value ? 'selected' : '';
    function select({ items, id, name }) {
        const options = (items.map(
            item => {
                const selected = isSelected(CUSTOMER, id, item);
                return `<option value="${item}" ${selected}>${item}</option>`
            })).join('');

        return `
            <label for="${ id}">${name}</label>
            <select id="${ id}" name="${id}" class="js-input">
                <option value=""></option>
                ${ options}
            </select> 
        `
    }

    const render = { select, text, multiselect }
    function customs(fields) {
        return (fields.map(field => render[field.type](field))).join('')
    }

    function template({ _id, name, task: { when = '', what = '' } = {} }) {
        return `
        <h1 class="mobilePadding">
            <a href="/customers/${ _id}" class="backButton"></a>
            ${ name}
        </h1>
        <h2>Поставить задачу</h2>         

        <div class="message" id="errorMessage"></div>

        <label for="name">Что сделать?</label>
        <input type="text" id="what" name="what" value="${what}" class="js-input" />
        
        <label for="info">Когда?</label>
        <input type="date" id="when" name="when" value="${when}" class="js-input" />

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

        const { when, what } = editForm;

        if (!when.value || !what.value) {
            window.scrollTo(0, 0);
            errorMessage.innerText = 'Заполните форму полностью'
            errorMessage.style.display = 'block'
            editForm.classList.add('shake')
            setTimeout(() => editForm.classList.remove('shake'), 1000)
            return false
        }

        const data = { when: when.value, what: what.value };

        isRequest = true;
        fetch(`${Config.API_HOST}/customers/${_id}/set.task?token=${getCookie('msid')}`, {
            method: "put",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(checkResponse)
            .then(() => { document.location.href = '/customers/' + _id })
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