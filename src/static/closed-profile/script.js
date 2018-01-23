(function () {

    function template(customer) {
        const { _id, name, trunk, user, phones, params, reject } = customer;

        function customs(params) {
            return (params.map(({ name, id }) => customer[id] ?
                `<div class="label">${name}</div>
                <div class="data">${ customer[id]}</div>` :
                '')).join('')
        }

        return `
            <h1 class="mobilePadding">
                <a href="/closed" class="backButton"></a>
                ${ name}
            </h1>
            <h2 class="mobilePadding">${ phones.join('')}</h2>
            <div class="card">
                <div class="label">Причина отказа</div>
                <div class="data">${reject.reason}</div>
                ${ reject.comment ?
                `<div class="label">Комментарий</div><div class="data">${reject.comment}</div>`
                :
                ''}                
                ${ customs(params)}
            </div>                      
        `
    }

    fetch(`${Config.API_HOST}/customers/${location.pathname.split('/')[2]}?token=${getCookie('msid')}&params=1`)
        .then(response => response.json())
        .then(checkResponse)
        .then(({ customer }) => {
            Profile.classList.remove('preloader');
            Profile.innerHTML = template(customer)
        })
        .catch(error => console.error('Error:', error.message));
})();