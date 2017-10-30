(function() {

    function hideTabsOnFocus() {
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
    }


    function text({ id, name }) {
        return `
            <label for="${ id }">${ name }</label>
            <input type="text" id="${ id }" name="${ id }" class="js-input" />
        `
    }


    function multiselect({ items, id, name }) {
        const options = (items.map(
            item => `
                <li>
                    <label>
                    <input type="checkbox" name="${ id }" value="${ item }"> 
                        ${ item }
                    </label>
                </li>
            `
        )).join('');

        return `
            <label>${ name }</label>
            <ul>${ options }</ul>
        `
    }   

    function getMultiselectValues(domElements) {
        const selected = [].filter.call(domElements, element => element.checked);
        return selected.map( ({ value }) => value)
    }


    function select({ items, id, name }) {
        const options = (items.map(
            item => `<option value="${item}">${item}</option>`
        )).join('');

        return `
            <label for="${ id }">${ name }</label>
            <select id="${ id }" name="${ id }" class="js-input">
                ${ options }
            </select> 
        `
    }

    const render = { select, text, multiselect }
    function customs(fields) {
        return (fields.map(field => render[field.type](field))).join('')
    }

    function template({ _id, name, info='', notes='', params }) {
        return `
        <h1 class="mobilePadding">
            <a href="/leads/hot/${ _id }" class="backButton"></a>
            ${ name }
        </h1>
        <h2>Заполнить профиль</h2>
        <div class="message" id="errorMessage"></div>

        <label for="name">Имя</label>
        <input type="text" id="name" name="name" class="js-input" />
        
        <label for="info">Описание</label>
        <input type="text" id="info" name="info" value="${ info }" class="js-input" />

        ${ customs(params) }

        <label for="notes">Заметки</label>
        <textarea id="notes" name="notes" class="js-input">${ notes }</textarea>

        <div class="buttonsPanel">
            <button>Сохранить</button>
            <a href="/leads/hot/${ _id }" class="button default">
                Отменить
            </a>
        </div>           
        `
    }

    let _id, customparams;

    fetch(`${ Config.API_HOST }/customers/${ location.pathname.split('/')[3] }?token=${ getCookie('msid') }&params=1`)
        .then(response => response.json())
        .then(checkResponse)
        .then(({ customer }) => {
            _id = customer._id;
            customparams = customer.params;

            editForm.classList.remove('preloader');
            editForm.innerHTML = template(customer);

            hideTabsOnFocus();
        })
        .catch(error => console.error('Error:', error.message));


    /* Form logic */

    let isRequest = false;

    editForm.addEventListener("submit", function(event) {
        event.preventDefault();

        errorMessage.style.display = 'none';
        console.log(isRequest)
        if (isRequest == true) return false;

        const { name, info, notes } = editForm;

        if (!name.value) {
            window.scrollTo(0,0);
            errorMessage.innerText = 'Имя не заполнено'
            errorMessage.style.display = 'block'
            editForm.classList.add('shake')
            setTimeout(() => editForm.classList.remove('shake'), 1000)
            return false
        }     

        const data = { name: name.value, info: info.value, notes: notes.value };
        customparams.forEach( ({ id, type }) => {
            if (type === 'multiselect') data[id] = getMultiselectValues(editForm[id])    
            else data[id] = editForm[id].value    
        }); 

        isRequest = true;
        fetch(`${ Config.API_HOST }/customers/${ _id }?token=${ getCookie('msid') }`, {
                method: "put",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(checkResponse)
            .then(() => { document.location.href = '/customers' })
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