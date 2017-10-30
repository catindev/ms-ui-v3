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


    function selectWithReasons(reasons) {
        const options = (reasons.map(
            reason => `<option value="${reason}">${reason}</option>`
        )).join('');

        return `
            <select id="reason" name="reason" class="js-input">
                ${ options }
            </select> 
        `
    }


    function template({ _id, name, trunk, phones, account: { noTargetReasons } }) {
        return `
        <h1 class="mobilePadding">
            <a href="/customers/${ _id }" class="backButton"></a>
            ${ name }
        </h1>
        <h2>Оформить отказ</h2>

        <div class="sidebar onlyDesktop">
            <a class="sidebar__link" href="/customers/${ _id }">Профиль 🗿</a>
            <div class="sidebar__divider"></div>
            <a class="sidebar__link" href="/customers/${ _id }/edit">
                Изменить профиль 📝
            </a>
            <a class="sidebar__link" href="/customers/${ _id }/deal">
                Закрыть сделку 💸
            </a>            
            <a class="sidebar__link sidebar__link--active">
                Оформить отказ 🚯
            </a>
        </div> 

        <div class="message" id="errorMessage"></div>

        <label for="reason">Причина</label>
        ${ selectWithReasons(noTargetReasons) }

        <label for="info">Комментарий</label>
        <input type="text" id="comment" name="comment" class="js-input" />
        
        <div class="buttonsPanel">
            <button>Оформить</button>
            <a href="/customers/${ _id }" class="button default">
                Отменить
            </a>
        </div>           
        `
    }

    let _id;

    fetch(`${ Config.API_HOST }/customers/${ location.pathname.split('/')[2] }?token=${ getCookie('msid') }`)
        .then(response => response.json())
        .then(checkResponse)
        .then(({ customer }) => {
            _id = customer._id
            rejectForm.classList.remove('preloader');
            rejectForm.innerHTML = template(customer);
            hideTabsOnFocus();
        })
        .catch(error => console.error('Error:', error.message));


    /* Form logic */

    let isRequest = false;

    rejectForm.addEventListener("submit", function(event) {
        event.preventDefault();

        errorMessage.style.display = 'none';
        if (isRequest == true) return false;
        const { reason, comment } = rejectForm;

        if (!reason.value) {
            newColdForm.classList.add('shake')
            setTimeout(() => newColdForm.classList.remove('shake'), 1000)
            return false
        }

        isRequest = true;
        fetch(`${ Config.API_HOST }/customers/${ _id }/reject?token=${ getCookie('msid') }`, {
                method: "put",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    reason: reason.value,
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

                newColdForm.classList.add('shake')
                setTimeout(() => newColdForm.classList.remove('shake'), 1000)
            });

    })
})();