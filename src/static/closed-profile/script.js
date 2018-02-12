(function () {

    const CUSTOMERID = location.pathname.split('/')[2];

    function template(customer) {
        const { _id, name, trunk, user, phones, params, reject, deal } = customer;

        const getParamValue = value => typeof value === 'string' ?
            value : value.join('</br>');

        function customs(params) {
            return (params.map(({ name, id }) => {
                if (typeof customer[id] === 'object' &&
                    customer[id].length === 0) return '';
                return customer[id] ?
                    `<div class="label">${name}</div>
                    <div class="data">${getParamValue(customer[id])}</div>`
                    :
                    ''
            })).join('')
        }

        const rejectHTML = reject ?
            `<div class="label">Причина отказа</div>
            <div class="data">${reject.reason}</div>
            ${ reject.comment ? `<div class="label">Комментарий</div><div class="data">${reject.comment}</div>` : ''}`
            : '';

        const dealHTML = deal ?
            `<div class="label">Сумма сделки</div>
            <div class="data">${deal.amount}</div>
            ${ deal.comment ? `<div class="label">Комментарий</div><div class="data">${deal.comment}</div>` : ''}`
            : '';


        return `
            <div class="sidebar onlyDesktop">
                <a class="sidebar__link js-comeback_btn">
                    Взять в работу 💸
                </a>       
            </div>             

            <h1 class="mobilePadding">
                <a href="/closed" class="backButton"></a>
                ${ name}
            </h1>
            <h2 class="mobilePadding">${ phones.join('')}</h2>

            <div class="optionsPanel onlyMobile">
                <a class="optionsButton js-comeback_btn">
                    Взять в работу 💸
                </a>                         
            </div>             

            <div4 class="card">
                ${rejectHTML}
                ${dealHTML}              
                ${customs(params)}
            </div>                      
        `
    }

    fetch(`${Config.API_HOST}/customers/${location.pathname.split('/')[2]}?token=${getCookie('msid')}&params=1`)
        .then(response => response.json())
        .then(checkResponse)
        .then(({ customer }) => {
            Profile.classList.remove('preloader');
            Profile.innerHTML = template(customer) + createPlaylist(customer.calls);
            playerInit();
            waitForComeback();
        })
        .catch(error => console.error('Error:', error.message));

    // Comeback logic        
    function waitForComeback() {
        let isRequest = false;
        Array
            .from(document.querySelectorAll('.js-comeback_btn'))
            .forEach(button => button.addEventListener('click', OnComeback));

        function OnComeback(event) {
            if (isRequest === true) return;
            isRequest = true;
            fetch(`${Config.API_HOST}/customers/${CUSTOMERID}/comeback?token=${getCookie('msid')}`, {
                method: "put",
                headers: { "Content-type": "application/json" }
            })
                .then(response => response.json())
                .then(checkResponse)
                .then(() => { document.location.href = '/customers/' + CUSTOMERID })
                .catch(error => {
                    isRequest = false;
                    console.error('Error:', error.message)
                    alert(error.message + '  😦')
                });
        }
    }

})();