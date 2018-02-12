(function () {

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
            <h1 class="mobilePadding">
                <a href="/closed" class="backButton"></a>
                ${ name}
            </h1>
            <h2 class="mobilePadding">${ phones.join('')}</h2>
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
        })
        .catch(error => console.error('Error:', error.message));
})();